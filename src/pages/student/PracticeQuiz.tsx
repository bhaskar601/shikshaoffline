import axios from 'axios';
import { AlertCircle, BarChart3, CheckCircle, Clock, ExternalLink, Image, Lightbulb, SkipForward, Target, Timer, Trophy, Video, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface Question {
  _id: string;
  question: string;
  questionImage?: string; 
  options: string[];
  correctAnswer: string;
  hint?: {
    text?: string;
    image?: string;
    video?: string;
  };
}

const PracticeQuiz: React.FC = () => {
  const { subject, topic } = useParams<{ subject: string; topic: string }>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const[className, setClassName] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<
    { questionId: string; selected: string; isCorrect: boolean }[]
  >([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [attemptedQuestions, setAttemptedQuestions] = useState<Set<number>>(new Set());
  const [quizCompleted, setQuizCompleted] = useState(false); // Added explicit quiz completion state

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const studentCookie = localStorage.getItem("student");
        const parsed = studentCookie ? JSON.parse(studentCookie) : null;
        const className = parsed?.student?.class || parsed?.class || null;
        setClassName(className);
        const res = await axios.get(`http://localhost:5000/questions/${className}/${subject}/${topic}`);
        setQuestions(res.data);
        setStartTime(Date.now());
        setQuestionStartTime(Date.now());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [subject, topic]);

  const handleAnswer = (option: string) => {
    if (selectedAnswer !== null) return;

    const currentQuestion = questions[current];
    const isCorrect = option === currentQuestion.correctAnswer;

    setSelectedAnswer(option);
    setAnswers((prev) => [
      ...prev,
      { questionId: currentQuestion._id, selected: option, isCorrect },
    ]);
    setAttemptedQuestions(prev => new Set(prev).add(current));
    
    setShowFeedback(true);
  };

  const handleNext = () => {
    // Reset states for next question
    setSelectedAnswer(null);
    setShowFeedback(false);
    setShowHint(false);
    
    // Check if this is the last question
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setQuestionStartTime(Date.now()); // Reset question timer
    } else {
      // Quiz is completed
      setEndTime(Date.now());
      setQuizCompleted(true);
    }
  };

  const handleSkip = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    setShowHint(false);
    
    // Check if this is the last question
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setQuestionStartTime(Date.now()); // Reset question timer
    } else {
      // Quiz is completed
      setEndTime(Date.now());
      setQuizCompleted(true);
    }
  };

  const getResult = () => {
    const correct = answers.filter((a) => a.isCorrect).length;
    const incorrect = answers.filter((a) => !a.isCorrect).length;
    const unattempted = questions.length - answers.length;
    
    // Calculate total time properly
    const totalTime = endTime && startTime ? (endTime - startTime) / 1000 : 0;
    
    // Calculate average time per question based on total questions attempted/viewed
    // This includes both answered and skipped questions
    const questionsAttempted = quizCompleted ? questions.length : current + 1;
    const avgTime = questionsAttempted > 0 ? totalTime / questionsAttempted : 0;
    
    const score = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;

    return { correct, incorrect, unattempted, totalTime, avgTime, score };
  };

  // Helper function to check if hint exists and has content
  const hasHint = (question: Question) => {
    if (!question.hint) return false;
    return !!(question.hint.text?.trim() || question.hint.image?.trim() || question.hint.video?.trim());
  };

  // Helper function to render hint content
  const renderHintContent = (
    hint: Question["hint"],
  ) => {

    // Prepare local image path if image exists
    let localImagePath: string | null = null;
    if (hint.image && hint.image.trim()) {
      const imageName = hint.image.split("/").pop();
      localImagePath = `/images/${className}/${subject}/${topic}/${imageName}`;
    }

    return (
      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
        <div className="flex items-start gap-2">
          <Lightbulb
            className="text-amber-600 mt-0.5 flex-shrink-0"
            size={18}
          />
          <div className="flex-1">
            <p className="font-medium text-amber-800 mb-2">Hint:</p>

            {/* Text Hint */}
            {hint.text && hint.text.trim() && (
              <div className="mb-3">
                <p className="text-amber-700">{hint.text}</p>
              </div>
            )}

            {/* Image Hint - Render Locally */}
            {localImagePath && (
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Image className="text-amber-600" size={16} />
                  <span className="text-sm font-medium text-amber-800">
                    Image Hint:
                  </span>
                </div>
                <div className="border border-amber-300 rounded-lg p-2 bg-amber-100">
                  <img
                    src={localImagePath}
                    alt="Hint"
                    className="max-w-full max-h-60 w-auto h-auto object-contain rounded-md"
                    style={{ maxWidth: "400px", maxHeight: "240px" }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      const parent =
                        e.currentTarget.parentElement?.parentElement;
                      if (parent) parent.style.display = "none";
                    }}
                  />
                </div>
              </div>
            )}

            {/* Video Hint - Still using external URL */}
            {hint.video && hint.video.trim() && (
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Video className="text-amber-600" size={16} />
                  <span className="text-sm font-medium text-amber-800">
                    Video Hint:
                  </span>
                </div>
                <a
                  href={hint.video}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg transition-colors duration-200 border border-amber-300 hover:border-amber-400"
                >
                  <Video size={16} />
                  <span className="font-medium">Watch Video Hint</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  

  // Helper function to render question image with fixed size
  const renderQuestionImage = (
    questionImage?: string,
  ) => {
    const imageName = questionImage.split("/").pop();
    const localImagePath = `/images/${className}/${subject}/${topic}/${imageName}`;
    console.log(localImagePath);
    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Image className="text-blue-600" size={18} />
          <span className="text-sm font-medium text-gray-700">
            Question Image:
          </span>
        </div>
        <div className="border-2 border-gray-200 rounded-lg p-3 bg-gray-50">
          <div className="flex justify-center">
            <img
              src={localImagePath}
              alt="Question"
              className="max-w-full max-h-80 w-auto h-auto object-contain rounded-lg shadow-sm"
              style={{ maxWidth: "500px", maxHeight: "320px" }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const parent = e.currentTarget.parentElement?.parentElement;
                if (parent) parent.style.display = "none";
              }}
            />
          </div>
        </div>
      </div>
    );
  };
  
  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-lg font-medium text-gray-600">Loading questions...</p>
      </div>
    </div>
  );
  
  if (questions.length === 0) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-600">No questions available for this topic.</p>
      </div>
    </div>
  );

  const progress = ((current + 1) / questions.length) * 100;

  // Pie chart data
  const { correct, incorrect, unattempted } = getResult();
  const pieData = [
    { name: 'Correct', value: correct, color: '#10B981' },
    { name: 'Incorrect', value: incorrect, color: '#EF4444' },
    { name: 'Unattempted', value: unattempted, color: '#6B7280' }
  ].filter(item => item.value > 0);

  const getScoreMessage = (score: number) => {
    if (score >= 90) return { message: "Outstanding! 🌟", color: "text-emerald-600" };
    if (score >= 80) return { message: "Excellent work! 🎉", color: "text-green-600" };
    if (score >= 70) return { message: "Good job! 👍", color: "text-blue-600" };
    if (score >= 60) return { message: "Keep practicing! 💪", color: "text-yellow-600" };
    return { message: "Need more practice 📚", color: "text-red-600" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Target className="text-blue-600" />
            Practice Quiz: {subject} - {topic}
          </h1>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {!quizCompleted ? (
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-gray-600">
                  Question {current + 1} of {questions.length}
                </span>
                <span className="text-sm font-medium text-gray-600 flex items-center gap-1">
                  <Clock size={16} />
                  {startTime ? Math.floor((Date.now() - startTime) / 1000) : 0}s
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-xl">
              {/* Hint Section */}
              {hasHint(questions[current]) && (
                <div className="mb-6">
                  {!showHint ? (
                    <button
                      onClick={() => setShowHint(true)}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 hover:bg-blue-50 px-3 py-2 rounded-lg"
                    >
                      <Lightbulb size={18} />
                      Show Hint
                    </button>
                  ) : (
                    <div>
                      {renderHintContent(questions[current].hint)}
                      <button
                        onClick={() => setShowHint(false)}
                        className="mt-2 text-sm text-amber-600 hover:text-amber-700 font-medium"
                      >
                        Hide Hint
                      </button>
                    </div>
                  )}
                </div>
              )}

              <h2 className="text-xl font-semibold text-gray-800 mb-6 leading-relaxed">
                {String(questions[current].question)}
              </h2>

              {/* Question Image with Fixed Size */}
              {renderQuestionImage(questions[current].questionImage)}
              
              <div className="grid gap-3">
                {questions[current].options.map((opt, i) => {
                  const isSelected = opt === selectedAnswer;
                  const isCorrect = opt === questions[current].correctAnswer;
                  
                  let classes = "p-4 rounded-lg cursor-pointer border-2 transition-all duration-200 text-left";
                  
                  if (selectedAnswer === null) {
                    classes += " border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md";
                  } else {
                    if (isSelected && isCorrect) {
                      classes += " border-green-500 bg-green-50 text-green-700";
                    } else if (isSelected && !isCorrect) {
                      classes += " border-red-500 bg-red-50 text-red-700";
                    } else if (isCorrect) {
                      classes += " border-green-500 bg-green-50 text-green-700";
                    } else {
                      classes += " border-gray-200 bg-gray-50 text-gray-500";
                    }
                  }

                  return (
                    <div
                      key={i}
                      className={classes}
                      onClick={() => handleAnswer(opt)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{String(opt)}</span>
                        {selectedAnswer !== null && (
                          <>
                            {isSelected && isCorrect && <CheckCircle className="text-green-600" size={20} />}
                            {isSelected && !isCorrect && <XCircle className="text-red-600" size={20} />}
                            {!isSelected && isCorrect && <CheckCircle className="text-green-600" size={20} />}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {showFeedback && (
                <div className="mt-6 p-4 rounded-lg bg-gray-50 border-l-4 border-blue-500">
                  <div className="flex items-center gap-2 mb-2">
                    {selectedAnswer === questions[current].correctAnswer ? (
                      <CheckCircle className="text-green-600" size={20} />
                    ) : (
                      <XCircle className="text-red-600" size={20} />
                    )}
                    <span className="font-medium">
                      {selectedAnswer === questions[current].correctAnswer ? "Correct!" : "Incorrect"}
                    </span>
                  </div>
                  {selectedAnswer !== questions[current].correctAnswer && (
                    <p className="text-sm text-gray-600">
                      The correct answer is: <strong>{String(questions[current].correctAnswer)}</strong>
                    </p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 flex gap-3">
                {selectedAnswer ? (
                  <button
                    onClick={handleNext}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    {current === questions.length - 1 ? "Finish Quiz 🎯" : "Next Question →"}
                  </button>
                ) : (
                  <button
                    onClick={handleSkip}
                    className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 px-6 rounded-lg font-medium hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
                  >
                    <SkipForward size={18} />
                    {current === questions.length - 1 ? "Finish Quiz" : "Skip Question"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Results Page */
          <div className="space-y-6">
            {/* Score Card */}
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="mb-6">
                <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
                <div className={`text-xl font-semibold ${getScoreMessage(getResult().score).color}`}>
                  {getScoreMessage(getResult().score).message}
                </div>
              </div>
              
              <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                {getResult().score}%
              </div>
              <p className="text-gray-600">Your Score</p>
            </div>

            {/* Analytics */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <BarChart3 className="text-blue-600" />
                  Performance Breakdown
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Detailed Stats */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Timer className="text-blue-600" />
                  Detailed Statistics
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="text-green-600" size={20} />
                      <span className="font-medium text-green-700">Correct Answers</span>
                    </div>
                    <span className="text-xl font-bold text-green-600">{correct}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <XCircle className="text-red-600" size={20} />
                      <span className="font-medium text-red-700">Incorrect Answers</span>
                    </div>
                    <span className="text-xl font-bold text-red-600">{incorrect}</span>
                  </div>

                  {unattempted > 0 && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="text-gray-600" size={20} />
                        <span className="font-medium text-gray-700">Unattempted</span>
                      </div>
                      <span className="text-xl font-bold text-gray-600">{unattempted}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="text-blue-600" size={20} />
                      <span className="font-medium text-blue-700">Total Time</span>
                    </div>
                    <span className="text-xl font-bold text-blue-600">
                      {Math.floor(getResult().totalTime)}s
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Timer className="text-purple-600" size={20} />
                      <span className="font-medium text-purple-700">Avg Time/Question</span>
                    </div>
                    <span className="text-xl font-bold text-purple-600">
                      {getResult().avgTime.toFixed(1)}s
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => {
                  // Reset quiz state
                  setCurrent(0);
                  setQuizCompleted(false);
                  setAnswers([]);
                  setSelectedAnswer(null);
                  setShowFeedback(false);
                  setShowHint(false);
                  setAttemptedQuestions(new Set());
                  setStartTime(Date.now());
                  setQuestionStartTime(Date.now());
                  setEndTime(null);
                }}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-8 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg"
              >
                Retake Quiz
              </button>
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-8 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg">
                Review Answers
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PracticeQuiz;
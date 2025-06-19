import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

interface Question {
  _id: string;
  subject: string;
  class: string;
  topic: string;
  question: string;
  options: string[];
}

export default function CreateQuiz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [teacherId, setTeacherId] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [topicFilter, setTopicFilter] = useState("");

  // New state for quizId input
  const [quizId, setQuizId] = useState("");

  const { toast } = useToast();

  useEffect(() => {
    const teacherCookie = Cookies.get("teacher");
    if (teacherCookie) {
      const parsed = JSON.parse(teacherCookie);
      setTeacherId(parsed.teacher.teacherId);

      axios
        .get("http://localhost:5000/questions/")
        .then((res) => {
          const allQuestions = res.data;
          const filteredByTeacher = allQuestions.filter((q: any) => {
            return !q.teacherId || q.teacherId === parsed.teacher.teacherId;
          });

          setQuestions(filteredByTeacher);
          setFilteredQuestions(filteredByTeacher);
        })
        .catch(() => {
          toast({
            title: "Error",
            description: "Failed to fetch questions",
            variant: "destructive",
          });
        });
    }
  }, []);
  

  const handleFilter = () => {
    const filtered = questions.filter(
      (q) =>
        (!subjectFilter || q.subject === subjectFilter) &&
        (!topicFilter || q.topic === topicFilter)
    );
    setFilteredQuestions(filtered);
  };

  const toggleSelect = (id: string) => {
    setSelectedQuestions((prev) =>
      prev.includes(id) ? prev.filter((qId) => qId !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
  if (!teacherId || selectedQuestions.length === 0 || !quizId.trim()) {
    toast({
      title: "Error",
      description:
        "Please select questions, enter Quiz ID, and ensure you're logged in as a teacher",
      variant: "destructive",
    });
    return;
  }

  try {
    const payload = {
      teacherId,
      quizId: quizId.trim(),
      questions: selectedQuestions,
    };

    console.log("Submitting quiz with payload:", payload); // ✅ Debug log

    const res = await axios.post("http://localhost:5000/quizzes/", payload);

    console.log("Quiz creation success:", res.data); // ✅ Debug log

    toast({
      title: "Quiz Created",
      description: `Your quiz "${res.data.quizId}" was successfully created!`,
    });

    setSelectedQuestions([]);
    setQuizId("");
  } catch (error: any) {
    console.error("Quiz creation failed:", error); // ✅ Debug log

    toast({
      title: "Error",
      description: error.response?.data?.error || "Failed to create quiz",
      variant: "destructive",
    });
  }
};


  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Create Quiz</h2>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Filter by subject"
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Filter by topic"
          value={topicFilter}
          onChange={(e) => setTopicFilter(e.target.value)}
          className="border p-2 rounded"
        />
        <Button onClick={handleFilter}>Filter</Button>
      </div>

      {/* New input for quizId */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter Quiz ID"
          value={quizId}
          onChange={(e) => setQuizId(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="grid gap-4">
        {filteredQuestions.map((q) => (
          <div
            key={q._id}
            className={`p-4 border rounded shadow-sm ${
              selectedQuestions.includes(q._id) ? "bg-green-100" : "bg-white"
            }`}
            onClick={() => toggleSelect(q._id)}
          >
            <p className="font-semibold">{q.question}</p>
            <ul className="list-disc pl-4">
              {q.options.map((opt, i) => (
                <li key={i}>{opt}</li>
              ))}
            </ul>
            <small className="text-gray-500">
              Subject: {q.subject} | Topic: {q.topic}
            </small>
          </div>
        ))}
      </div>

      <Button className="mt-4" onClick={handleSubmit}>
        Submit Quiz
      </Button>
    </div>
  );
}

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { AlertCircle, BookOpen, Loader2, Play } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const SubjectTopics: React.FC = () => {
  const { subject } = useParams<{ subject: string }>();
  const [topics, setTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopics = async () => {
      setLoading(true);
      setError(null);

      try {
        const studentCookie = localStorage.getItem("student");

        let className: string | null = null;
        if (studentCookie) {
          const parsed = JSON.parse(studentCookie);
          className = parsed?.student?.class || parsed?.class || null;
        }

        if (!className) {
          setError("Class information not found in cookie.");
          setTopics([]);
          return;
        }

        if (!subject) {
          setError("Subject is not specified.");
          setTopics([]);
          return;
        }

        const res = await axios.get(
          `http://localhost:5000/questions/topics/${className}/${subject}`
        );

        if (res.data && Array.isArray(res.data.topics)) {
          setTopics(res.data.topics);
        } else {
          setError("Invalid topics data received from server.");
          setTopics([]);
        }
      } catch {
        setError("Failed to load topics. Please try again later.");
        setTopics([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, [subject]);

  const getSubjectIcon = (subjectName: string) => {
    const icons: { [key: string]: string } = {
      'Math': '📐',
      'Science': '🔬',
      'English': '📚',
      'Hindi': '📖',
      'History': '🏛️',
      'Geography': '🌍',
      'Physics': '⚛️',
      'Chemistry': '🧪',
      'Biology': '🧬',
    };
    return icons[subjectName] || '📝';
  };

  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
      <p className="text-gray-600 font-medium">Loading topics...</p>
      <p className="text-gray-500 text-sm mt-2">Please wait while we fetch the topics</p>
    </div>
  );

  const ErrorState = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-800 mb-2">Something went wrong</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <Button 
          onClick={() => window.location.reload()} 
          variant="outline" 
          className="border-red-200 text-red-700 hover:bg-red-50"
        >
          Try Again
        </Button>
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md text-center">
        <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Topics Available</h3>
        <p className="text-gray-600 mb-4">
          कोई टॉपिक नहीं मिला। कृपया बाद में फिर से कोशिश करें।
        </p>
        <Link to="/student/dashboard">
          <Button variant="outline">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="edu-container">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white p-3 rounded-full shadow-sm border">
                <span className="text-2xl">{getSubjectIcon(subject || '')}</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {subject} <span className="text-gray-600">के टॉपिक</span>
                </h1>
                <p className="text-gray-600 mt-1">
                  प्रश्नों का अभ्यास शुरू करने के लिए एक टॉपिक चुनें
                </p>
              </div>
            </div>
            
            {!loading && !error && topics.length > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {topics.length} उपलब्ध टॉपिक
                </Badge>
              </div>
            )}
          </div>

          {/* Content */}
          {loading && <LoadingState />}
          {error && <ErrorState />}
          {!loading && !error && topics.length === 0 && <EmptyState />}

          {!loading && !error && topics.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {topics.map((topic, index) => (
                <Card 
                  key={topic} 
                  className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md bg-white/80 backdrop-blur-sm"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg font-semibold text-gray-800 group-hover:text-blue-700 transition-colors line-clamp-2">
                        {topic}
                      </CardTitle>
                      <Badge 
                        variant="outline" 
                        className="text-xs bg-gradient-to-r from-purple-100 to-blue-100 border-purple-200 text-purple-700"
                      >
                        #{index + 1}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0 pb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <BookOpen className="h-4 w-4" />
                      <span>प्रैक्टिस प्रश्न</span>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-0">
                    <Link to={`/student/practice/${subject}/${topic}`} className="w-full">
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
                        size="sm"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Quiz
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SubjectTopics;
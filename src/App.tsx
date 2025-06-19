import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { QuizProvider } from "@/contexts/QuizContext";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import NotAuthorized from "./pages/NotAuthorized";

// Student Pages
import StudentDashboard from "./pages/student/Dashboard";
import StudentPractice from "./pages/student/Practice";
import PracticeQuiz from "./pages/student/PracticeQuiz";
import QuizById from "./pages/student/QuizById";
import GroupQuiz from "./pages/student/GroupQuiz";
import StudentReport from "./pages/student/StudentReport";
import SingleQuizReport from "./pages/student/SingleQuizReport";
import SubjectTopics from "./pages/student/SubjectTopics";

// Question Page
import Upload_question from "./components/questions/Upload_question";
import LoginStudent from "./pages/LoginStudent";

// Teacher Pages
import TeacherDashboard from "./pages/teacher/Dashboard";
import CreateQuiz from "./pages/teacher/CreateQuiz";
import Analytics from "./pages/teacher/Analytics";
import AddMyQuestion from "./pages/teacher/AddMyquestion";
import QuizDetails from "./pages/teacher/QuizDetails";
import QuizAnalyticsPage from "./pages/teacher/QuizAnalyticsPage";

//Quiz
import AttemptQuiz from "./pages/student/AttemptQuiz";
const queryClient = new QueryClient();

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/about" element={<About />} />
      <Route path="/not-authorized" element={<NotAuthorized />} />
      <Route path="/uploadquestion" element={<Upload_question />} />

      {/* Student Routes */}
      <Route path="/student" element={<StudentDashboard />} />
      <Route path="/student/practice" element={<StudentPractice />} />
      <Route path="/student/practice/:subject" element={<SubjectTopics />} />
      <Route path="/student/practice/:subject/:topic" element={<PracticeQuiz />} />
      <Route path="/student/quiz" element={<QuizById />} />
      <Route path="/student/group-quiz" element={<GroupQuiz />} />
      <Route path='/studentreport/:id' element={<StudentReport></StudentReport>}></Route>
      <Route path='/singlequiz/:id' element={<SingleQuizReport></SingleQuizReport>}></Route>
      <Route path='/login/student' element={<LoginStudent></LoginStudent>}></Route>

      {/* Quiz */}
      <Route path="/attemptquiz/:id" element={<AttemptQuiz></AttemptQuiz>}></Route>

      {/* Teacher Routes */}
      <Route path="/teacher" element={<TeacherDashboard />} />
      <Route path="/teacher/create-quiz" element={<CreateQuiz />} />
      <Route path="/teacher/analytics" element={<Analytics />} />
      <Route path="/addmyquestion"element={<AddMyQuestion></AddMyQuestion>}></Route>
      <Route path="/teacher/quiz-details/:quizId" element={<QuizDetails />} />
      <Route path="/teacher/quiz-analytics/:quizId" element={<QuizAnalyticsPage />} />


      {/* 404 - Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <QuizProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </QuizProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

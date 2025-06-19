import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BookOpen, Users, FlaskConical, Calculator } from 'lucide-react';

const Index: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-edu-blue/10 to-white py-16">
          <div className="edu-container">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                  Prepare for NMMS Exam with Confidence
                </h1>
                <p className="text-lg text-gray-700 mb-6">
                  A comprehensive learning platform designed specifically for government school students of Classes 6, 7, and 8 to excel in the NMMS examination.
                </p>
                <div className="flex flex-wrap gap-4">
                  {/* <Link to="/register">
                    <Button size="lg" className="bg-edu-blue hover:bg-edu-blue-dark">
                      Join as Student
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="lg" variant="outline">
                      Join as Teacher
                    </Button>
                  </Link> */}
                </div>
              </div>
              
              <div className="md:w-1/2 flex justify-center">
                <div className="relative">
                  <div className="w-64 h-64 bg-edu-blue/20 rounded-full absolute top-4 left-4"></div>
                  <div className="w-64 h-64 bg-edu-yellow/20 rounded-full absolute top-8 left-8"></div>
                  <div className="bg-white p-6 rounded-lg shadow-lg z-10 relative">
                    <img 
                      src="https://img.freepik.com/free-vector/students-with-laptops-studying-online-course_74855-5293.jpg" 
                      alt="Students learning online" 
                      className="w-64 h-64 object-cover rounded"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* What is NMMS Section */}
        <section className="py-16 bg-white">
          <div className="edu-container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">What is NMMS?</h2>
              <p className="text-gray-700 max-w-3xl mx-auto">
                The National Means-cum-Merit Scholarship (NMMS) is a centrally sponsored scholarship program aimed at 
                providing financial assistance to meritorious students from economically weaker sections to reduce the 
                dropout rate and encourage them to continue their education.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <BookOpen className="h-12 w-12 mb-4 text-edu-blue" />,
                  title: "Academic Excellence",
                  description: "The scholarship promotes academic excellence and helps talented students continue their education."
                },
                {
                  icon: <Users className="h-12 w-12 mb-4 text-edu-purple" />,
                  title: "Financial Support",
                  description: "NMMS provides financial assistance to students from economically weaker sections."
                },
                {
                  icon: <FlaskConical className="h-12 w-12 mb-4 text-edu-green" />,
                  title: "Comprehensive Subjects",
                  description: "The exam tests students on Mathematics, Science, Social Science, and Mental Ability."
                },
                {
                  icon: <Calculator className="h-12 w-12 mb-4 text-edu-yellow" />,
                  title: "Competitive Exam",
                  description: "NMMS is a competitive scholarship exam conducted at the state level for Class 8 students."
                }
              ].map((item, index) => (
                <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6 text-center">
                    <div className="flex justify-center">{item.icon}</div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="edu-container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Features</h2>
              <p className="text-gray-700 max-w-3xl mx-auto">
                Our platform offers a variety of features to help students prepare effectively for the NMMS exam.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "Practice Questions",
                  description: "Access a vast repository of practice questions for Mathematics, Science, Social Science, and MAT.",
                  image: "https://img.freepik.com/free-vector/tiny-students-sitting-near-books_74855-15547.jpg"
                },
                {
                  title: "Teacher-Created Quizzes",
                  description: "Teachers can create custom quizzes tailored to specific topics or areas of improvement.",
                  image: "https://img.freepik.com/free-vector/teacher-concept-illustration_114360-1638.jpg"
                },
                {
                  title: "Group Quiz Mode",
                  description: "Study together with friends by attempting quizzes in groups of three to enhance collaborative learning.",
                  image: "https://img.freepik.com/free-vector/students-watching-webinar-computer-studying-online_74855-15522.jpg"
                },
                {
                  title: "Analytics & Progress Tracking",
                  description: "Track your progress over time with detailed analytics on your performance in various subjects.",
                  image: "https://img.freepik.com/free-vector/data-inform-illustration-concept_114360-864.jpg"
                }
              ].map((item, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-6 items-center p-6 bg-white rounded-lg shadow-md">
                  <div className="md:w-1/3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="rounded-lg w-full h-48 object-cover"
                    />
                  </div>
                  <div className="md:w-2/3">
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-600 mb-4">{item.description}</p>
                    <Link to="/register">
                      <Button variant="outline" size="sm">Learn More</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-edu-blue text-white">
          <div className="edu-container text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your NMMS Preparation?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Join thousands of students who are already using our platform to prepare for the NMMS exam.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/register">
                <Button size="lg" variant="secondary">
                  Register Now
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="bg-transparent border-white hover:bg-white/20">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;

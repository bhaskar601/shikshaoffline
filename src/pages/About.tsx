
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Award, GraduationCap, BookText } from 'lucide-react';

const About: React.FC = () => {
  const sections = [
    {
      title: "What is NMMS?",
      icon: <BookOpen className="h-10 w-10 text-edu-blue mb-4" />,
      content: `
        The National Means-cum-Merit Scholarship (NMMS) is a Central Sector Scheme that provides scholarships to 
        meritorious students from economically weaker sections to reduce dropout rates in class VIII and encourage 
        them to continue their education at the secondary stage.
      `
    },
    {
      title: "Eligibility Criteria",
      icon: <Award className="h-10 w-10 text-edu-purple mb-4" />,
      content: `
        • Students must be studying in Class VIII in a government, local body, or government-aided school.
        • Parental income should not exceed ₹3,50,000 per annum.
        • Students must score at least 55% marks (50% for SC/ST) in Class VII annual exam.
        • The student must pass a two-tier merit test conducted by the respective state/UT.
      `
    },
    {
      title: "Exam Pattern",
      icon: <BookText className="h-10 w-10 text-edu-green mb-4" />,
      content: `
        The NMMS exam consists of two parts:
        
        1. Mental Ability Test (MAT): 
           • 90 multiple-choice questions
           • Tests reasoning and critical thinking
        
        2. Scholastic Aptitude Test (SAT):
           • 90 multiple-choice questions
           • Covers Mathematics, Science, and Social Science
        
        Time: 90 minutes for each test
        Total Marks: 180 (90 marks for each test)
        Minimum qualifying marks: 40% (General), 32% (SC/ST/PH)
      `
    },
    {
      title: "Scholarship Benefits",
      icon: <GraduationCap className="h-10 w-10 text-edu-yellow mb-4" />,
      content: `
        • Scholarship amount: ₹12,000 per annum (₹1,000 per month)
        • Duration: 4 years (from Classes IX to XII)
        • Direct transfer to the student's bank account
        • Helps cover educational expenses and reduces financial burden
        
        Around 1,00,000 scholarships are awarded to students nationwide each year.
      `
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 py-12 bg-gray-50">
        <div className="edu-container">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">About NMMS Examination</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn more about the National Means-cum-Merit Scholarship scheme and how it helps talented students from economically weaker sections.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {sections.map((section, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col items-center">
                  <div className="flex flex-col items-center text-center mb-4">
                    {section.icon}
                    <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                  </div>
                  <div className="whitespace-pre-line">
                    {section.content}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card className="mb-12">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {[
                  {
                    q: "When is the NMMS exam conducted?",
                    a: "The NMMS examination is typically conducted in November each year. The exact date varies by state."
                  },
                  {
                    q: "How can I prepare for the NMMS exam?",
                    a: "Prepare by studying NCERT textbooks for Classes 6-8, solving previous years' papers, and focusing on developing reasoning skills for the MAT section."
                  },
                  {
                    q: "How are the scholarships distributed?",
                    a: "Scholarships are distributed to students based on their merit in the NMMS exam and the state-wise quota."
                  },
                  {
                    q: "Can private school students apply for NMMS?",
                    a: "No, only students studying in government, local body, or government-aided schools are eligible."
                  },
                  {
                    q: "What documents are required for the NMMS application?",
                    a: "Required documents include school certificate, income certificate of parents, caste certificate (if applicable), and bank account details of the student."
                  }
                ].map((faq, idx) => (
                  <div key={idx}>
                    <h3 className="font-bold text-lg">{faq.q}</h3>
                    <p className="mt-1 text-gray-700">{faq.a}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;

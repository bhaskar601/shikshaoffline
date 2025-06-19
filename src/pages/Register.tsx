
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Register: React.FC = () => {
  const { register: registerUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [instituteId, setInstituteId] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [classLevel, setClassLevel] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!name || !email || !password || !instituteId || (role === 'student' && !classLevel)) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    // For demo, no password complexity requirements
    
    try {
      await registerUser(
        {
          name,
          email,
          instituteId,
          class: role === 'student' ? classLevel : undefined,
        },
        password,
        role
      );
      
      // Redirect based on role
      if (role === 'student') {
        navigate('/student');
      } else {
        navigate('/teacher');
      }
    } catch (error) {
      console.error('Registration error', error);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="flex items-center justify-center p-2 bg-primary/10 rounded-full mb-2">
            <BookOpen className="h-10 w-10 text-edu-blue" />
          </div>
          <CardTitle className="text-2xl text-center">Create an account</CardTitle>
          <CardDescription className="text-center">
            Register to start preparing for NMMS exam
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="student" className="w-full" onValueChange={(value) => setRole(value as 'student' | 'teacher')}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="teacher">Teacher</TabsTrigger>
            </TabsList>
            
            <TabsContent value="student">
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="student-name">Full Name</Label>
                  <Input 
                    id="student-name" 
                    placeholder="Your Name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="student-email">Email</Label>
                  <Input 
                    id="student-email" 
                    type="email" 
                    placeholder="your.email@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="student-class">Class</Label>
                    <Select 
                      value={classLevel} 
                      onValueChange={setClassLevel}
                      required
                    >
                      <SelectTrigger id="student-class">
                        <SelectValue placeholder="Select Class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6">Class 6</SelectItem>
                        <SelectItem value="7">Class 7</SelectItem>
                        <SelectItem value="8">Class 8</SelectItem>
                        <SelectItem value="NMMS">NMMS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="student-institute">Institute ID</Label>
                    <Input 
                      id="student-institute" 
                      placeholder="e.g., INST001" 
                      value={instituteId}
                      onChange={(e) => setInstituteId(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="student-password">Password</Label>
                  <Input 
                    id="student-password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="student-confirm-password">Confirm Password</Label>
                  <Input 
                    id="student-confirm-password" 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="teacher">
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="teacher-name">Full Name</Label>
                  <Input 
                    id="teacher-name" 
                    placeholder="Your Name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="teacher-email">Email</Label>
                  <Input 
                    id="teacher-email" 
                    type="email" 
                    placeholder="teacher.email@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="teacher-institute">Institute ID</Label>
                  <Input 
                    id="teacher-institute" 
                    placeholder="e.g., INST001" 
                    value={instituteId}
                    onChange={(e) => setInstituteId(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="teacher-password">Password</Label>
                  <Input 
                    id="teacher-password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="teacher-confirm-password">Confirm Password</Label>
                  <Input 
                    id="teacher-confirm-password" 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
            </TabsContent>
          </Tabs>
          
          <CardFooter className="flex flex-col">
            <Button 
              className="w-full" 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? 'Registering...' : 'Register'}
            </Button>
            
            <p className="mt-4 text-center text-sm text-gray-500">
              Already have an account?{' '}
              <a href="/login" className="text-edu-blue hover:underline">
                Login here
              </a>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Register;

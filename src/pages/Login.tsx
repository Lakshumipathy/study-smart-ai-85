import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, BookOpen } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | null>(null);

  const handleRoleSelect = (role: 'student' | 'teacher') => {
    setSelectedRole(role);
  };

  const handleLogin = () => {
    if (selectedRole) {
      const userId = selectedRole === 'student' ? 'student_001' : 'teacher_001';
      login(selectedRole, userId);
      navigate(selectedRole === 'student' ? '/student/dashboard' : '/teacher/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
            <GraduationCap className="w-10 h-10 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold">EduGrade AI</CardTitle>
          <CardDescription className="text-base">
            AI-Powered Student Performance Management System
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground text-center">Select your role to continue</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleRoleSelect('student')}
                className={`p-6 rounded-lg border-2 transition-all hover:scale-105 ${
                  selectedRole === 'student'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <BookOpen className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="font-semibold text-foreground">Student</p>
              </button>
              <button
                onClick={() => handleRoleSelect('teacher')}
                className={`p-6 rounded-lg border-2 transition-all hover:scale-105 ${
                  selectedRole === 'teacher'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <GraduationCap className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="font-semibold text-foreground">Teacher</p>
              </button>
            </div>
          </div>
          <Button 
            onClick={handleLogin} 
            disabled={!selectedRole}
            className="w-full"
            size="lg"
          >
            Continue
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

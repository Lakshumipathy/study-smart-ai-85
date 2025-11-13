import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingUp, TrendingDown, BookOpen, Target, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from "recharts";
import { useToast } from "@/hooks/use-toast";

export default function StudentPerformance() {
  const [regNo, setRegNo] = useState("");
  const [semester, setSemester] = useState("");
  const [verified, setVerified] = useState(false);
  const [studentData, setStudentData] = useState<any>(null);
  const { toast } = useToast();

  const handleVerify = () => {
    const storedData = localStorage.getItem('studentData');
    if (!storedData) {
      toast({
        title: "No data available",
        description: "Teacher hasn't uploaded any performance data yet.",
        variant: "destructive",
      });
      return;
    }

    const allStudents = JSON.parse(storedData);
    const student = allStudents.find(
      (s: any) => s.regNo === regNo && s.semester === semester
    );

    if (student) {
      setStudentData(student);
      setVerified(true);
      toast({
        title: "Verification successful!",
        description: "Your performance data has been loaded.",
      });
    } else {
      toast({
        title: "Verification failed",
        description: "Registration number or semester doesn't match our records.",
        variant: "destructive",
      });
      setVerified(false);
      setStudentData(null);
    }
  };

  if (!verified) {
    return (
      <DashboardLayout>
        <div className="max-w-md mx-auto mt-20">
          <Card>
            <CardHeader>
              <CardTitle>View Performance Data</CardTitle>
              <CardDescription>
                Enter your registration number and semester to access your performance review
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="regNo">Registration Number</Label>
                <Input
                  id="regNo"
                  placeholder="e.g., 2024CS001"
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <Input
                  id="semester"
                  placeholder="e.g., 5"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                />
              </div>
              <Button onClick={handleVerify} className="w-full">
                View Performance
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const { subjectData, radarData, overallGrade, overallPercentage, strengths, weaknesses, schedule } = studentData;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Performance Review</h2>
            <p className="text-muted-foreground">Semester {semester} - {regNo}</p>
          </div>
          <Button variant="outline" onClick={() => setVerified(false)}>
            Change Details
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Overall Grade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">{overallGrade}</div>
              <p className="text-sm text-muted-foreground mt-1">{overallPercentage}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Strongest Subject</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">Computer Science</div>
              <p className="text-sm text-success flex items-center gap-1 mt-1">
                <TrendingUp className="h-4 w-4" />
                95%
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Needs Improvement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">Physics</div>
              <p className="text-sm text-warning flex items-center gap-1 mt-1">
                <TrendingDown className="h-4 w-4" />
                78%
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Subject-wise Performance</CardTitle>
              <CardDescription>Your marks across all subjects</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={subjectData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="marks" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skills Assessment</CardTitle>
              <CardDescription>Comprehensive subject analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar name="Score" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-success" />
                Your Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {strengths.map((strength: string) => (
                  <div key={strength} className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                    <span className="font-medium">{strength}</span>
                    <Badge variant="outline" className="bg-success text-success-foreground">Excellent</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-warning" />
                Areas for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weaknesses.map((weakness: string) => (
                  <div key={weakness} className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                    <span className="font-medium">{weakness}</span>
                    <Badge variant="outline" className="bg-warning text-warning-foreground">Focus Needed</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              AI-Generated Weekly Study Schedule
            </CardTitle>
            <CardDescription>Personalized plan to improve your Physics performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {schedule.map((item: any) => (
                <div key={item.day} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{item.day}</p>
                      <p className="text-sm text-muted-foreground">{item.topic}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">{item.duration}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bell, TrendingUp, TrendingDown, BookOpen, Target, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from "recharts";

export default function StudentDashboard() {
  const [hasNewData, setHasNewData] = useState(false);

  useEffect(() => {
    const dataUploaded = localStorage.getItem('datasetUploaded');
    setHasNewData(dataUploaded === 'true');
  }, []);

  // Demo data
  const subjectData = [
    { subject: "Mathematics", marks: 85, total: 100 },
    { subject: "Physics", marks: 78, total: 100 },
    { subject: "Chemistry", marks: 92, total: 100 },
    { subject: "English", marks: 88, total: 100 },
    { subject: "Computer Sci", marks: 95, total: 100 },
  ];

  const radarData = [
    { subject: "Math", score: 85 },
    { subject: "Physics", score: 78 },
    { subject: "Chemistry", score: 92 },
    { subject: "English", score: 88 },
    { subject: "CS", score: 95 },
  ];

  const overallGrade = "A";
  const overallPercentage = 87.6;

  const strengths = ["Chemistry", "Computer Science", "Mathematics"];
  const weaknesses = ["Physics"];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {hasNewData && (
          <Alert className="border-primary bg-primary/10">
            <Bell className="h-4 w-4 text-primary" />
            <AlertTitle className="text-primary">New Performance Data Available!</AlertTitle>
            <AlertDescription className="text-foreground">
              Your teacher has uploaded new performance data. Check out your latest results below.
            </AlertDescription>
          </Alert>
        )}

        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Performance Review</h2>
          <p className="text-muted-foreground">Your academic performance and insights</p>
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
                {strengths.map((strength) => (
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
                {weaknesses.map((weakness) => (
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
              {[
                { day: "Monday", topic: "Newton's Laws of Motion", duration: "1 hour" },
                { day: "Tuesday", topic: "Practice Problems - Forces", duration: "45 mins" },
                { day: "Wednesday", topic: "Energy and Work", duration: "1 hour" },
                { day: "Thursday", topic: "Review and Quiz", duration: "30 mins" },
                { day: "Friday", topic: "Momentum and Collisions", duration: "1 hour" },
              ].map((schedule) => (
                <div key={schedule.day} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{schedule.day}</p>
                      <p className="text-sm text-muted-foreground">{schedule.topic}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">{schedule.duration}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, BookOpen, Calendar, Award, ExternalLink, CheckCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Subject {
  subject: string;
  marks: number;
  total: number;
  percentage: number;
}

interface StudyResource {
  title: string;
  type: string;
  url: string;
  description: string;
}

interface StudyPlanItem {
  day: string;
  subject: string;
  task: string;
  resources: string;
}

export default function StudentPerformance() {
  const [regNo, setRegNo] = useState("");
  const [semester, setSemester] = useState("");
  const [verified, setVerified] = useState(false);
  const [studentData, setStudentData] = useState<any>(null);
  const [studyResources, setStudyResources] = useState<Record<string, StudyResource[]>>({});
  const [studyPlan, setStudyPlan] = useState<StudyPlanItem[]>([]);
  const [aiSummary, setAiSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleVerify = async () => {
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
        description: "Loading your performance data...",
      });
      
      await generateInsights(student);
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

  const generateInsights = async (student: any) => {
    setLoading(true);
    
    try {
      const subjects: Subject[] = student.subjectData.map((s: any) => ({
        subject: s.subject,
        marks: s.marks,
        total: s.total,
        percentage: (s.marks / s.total) * 100,
      }));

      const weakSubjects = subjects.filter(s => s.percentage < 75);
      const strongSubjects = subjects.filter(s => s.percentage >= 75);

      if (weakSubjects.length > 0) {
        const resourcesMap: Record<string, StudyResource[]> = {};
        
        for (const subject of weakSubjects) {
          try {
            const { data, error } = await supabase.functions.invoke('generate-performance-insights', {
              body: { 
                subjects: [{ name: subject.subject, marks: subject.marks, total: subject.total }],
                type: 'resources' 
              }
            });

            if (error) throw error;
            
            const parsedResources = JSON.parse(data.content);
            resourcesMap[subject.subject] = parsedResources;
          } catch (err) {
            console.error(`Error generating resources for ${subject.subject}:`, err);
          }
        }
        
        setStudyResources(resourcesMap);

        try {
          const { data, error } = await supabase.functions.invoke('generate-performance-insights', {
            body: { 
              subjects: weakSubjects.map(s => ({ name: s.subject, marks: s.marks, total: s.total })),
              type: 'studyPlan' 
            }
          });

          if (error) throw error;
          
          const parsedPlan = JSON.parse(data.content);
          setStudyPlan(parsedPlan);
        } catch (err) {
          console.error('Error generating study plan:', err);
        }
      }

      try {
        const { data, error } = await supabase.functions.invoke('generate-performance-insights', {
          body: { 
            subjects: {
              strong: strongSubjects.map(s => ({ name: s.subject, marks: s.marks, total: s.total })),
              weak: weakSubjects.map(s => ({ name: s.subject, marks: s.marks, total: s.total })),
              overall: student.overallPercentage
            },
            type: 'summary' 
          }
        });

        if (error) throw error;
        
        setAiSummary(data.content);
      } catch (err) {
        console.error('Error generating summary:', err);
      }
    } finally {
      setLoading(false);
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

  const subjects: Subject[] = studentData.subjectData.map((s: any) => ({
    ...s,
    percentage: (s.marks / s.total) * 100,
  }));

  const weakSubjects = subjects.filter(s => s.percentage < 75);
  const chartData = subjects.map(s => ({
    name: s.subject,
    marks: s.marks,
    percentage: s.percentage,
  }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Performance Review</h2>
            <p className="text-muted-foreground">Comprehensive analysis of your academic performance</p>
          </div>
          <Button variant="outline" onClick={() => setVerified(false)}>
            Change Details
          </Button>
        </div>

        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Student Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="text-lg font-semibold">{studentData.name || "Student"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Registration No.</p>
                <p className="text-lg font-semibold">{regNo}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="text-lg font-semibold">{studentData.department || "Computer Science"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Semester</p>
                <p className="text-lg font-semibold">{semester}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Attendance</p>
                <p className="text-lg font-semibold">{studentData.attendance || "92%"}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Overall Grade</p>
                  <p className="text-3xl font-bold text-primary">{studentData.overallGrade}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Overall Percentage</p>
                  <p className="text-3xl font-bold">{studentData.overallPercentage}%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Subject-wise Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead className="text-center">Marks Obtained</TableHead>
                  <TableHead className="text-center">Total Marks</TableHead>
                  <TableHead className="text-center">Percentage</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjects.map((subject, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{subject.subject}</TableCell>
                    <TableCell className="text-center">{subject.marks}</TableCell>
                    <TableCell className="text-center">{subject.total}</TableCell>
                    <TableCell className="text-center">{subject.percentage.toFixed(1)}%</TableCell>
                    <TableCell className="text-center">
                      {subject.percentage >= 75 ? (
                        <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
                          Strong
                        </Badge>
                      ) : (
                        <Badge variant="destructive">Needs Improvement</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Visual Performance Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="marks" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.percentage >= 75 ? "hsl(var(--chart-2))" : "hsl(var(--chart-1))"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {loading ? (
          <Card>
            <CardHeader>
              <CardTitle>Loading AI-powered insights...</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ) : weakSubjects.length > 0 ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Recommended Study Resources
                </CardTitle>
                <CardDescription>
                  AI-curated resources to help you improve in weaker subjects
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {weakSubjects.map((subject) => (
                  <div key={subject.subject} className="space-y-3">
                    <h4 className="font-semibold text-lg">{subject.subject}</h4>
                    <div className="grid gap-3">
                      {studyResources[subject.subject]?.map((resource, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                          <ExternalLink className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className="font-medium">{resource.title}</h5>
                              <Badge variant="outline" className="text-xs">{resource.type}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{resource.description}</p>
                            <a 
                              href={resource.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline"
                            >
                              View Resource →
                            </a>
                          </div>
                        </div>
                      )) || (
                        <p className="text-sm text-muted-foreground">Loading resources...</p>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {studyPlan.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Personalized Weekly Study Plan
                  </CardTitle>
                  <CardDescription>
                    Follow this schedule to improve your performance in weaker areas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {studyPlan.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-4 p-4 rounded-lg border bg-card">
                        <div className="flex-shrink-0 w-24">
                          <Badge variant="outline">{item.day}</Badge>
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold mb-1">{item.subject}</h5>
                          <p className="text-sm text-muted-foreground mb-2">{item.task}</p>
                          <p className="text-xs text-primary">{item.resources}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-green-600 mb-1">Outstanding Performance!</h3>
                  <p className="text-muted-foreground">
                    Congratulations! You're performing excellently in all subjects. Keep up the great work!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {aiSummary && (
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                AI Performance Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{aiSummary}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

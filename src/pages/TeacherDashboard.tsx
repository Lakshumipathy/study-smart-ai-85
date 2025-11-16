import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, CheckCircle, Users, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Activity {
  id: string;
  message: string;
  timestamp: string;
  type: 'dataset' | 'assignment' | 'event';
}

export default function TeacherDashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem('teacherActivities');
    if (stored) {
      const activities = JSON.parse(stored);
      setRecentActivities(activities.slice(0, 5).sort((a: Activity, b: Activity) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ));
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    
    setUploading(true);
    
    // Simulate upload process and store sample student data
    setTimeout(() => {
      const sampleStudentData = [
        {
          regNo: "2024CS001",
          semester: "5",
          subjectData: [
            { subject: "Mathematics", marks: 85, total: 100 },
            { subject: "Physics", marks: 78, total: 100 },
            { subject: "Chemistry", marks: 92, total: 100 },
            { subject: "English", marks: 88, total: 100 },
            { subject: "Computer Sci", marks: 95, total: 100 },
          ],
          radarData: [
            { subject: "Math", score: 85 },
            { subject: "Physics", score: 78 },
            { subject: "Chemistry", score: 92 },
            { subject: "English", score: 88 },
            { subject: "CS", score: 95 },
          ],
          overallGrade: "A",
          overallPercentage: 87.6,
          strengths: ["Chemistry", "Computer Science", "Mathematics"],
          weaknesses: ["Physics"],
          schedule: [
            { day: "Monday", topic: "Newton's Laws of Motion", duration: "1 hour" },
            { day: "Tuesday", topic: "Practice Problems - Forces", duration: "45 mins" },
            { day: "Wednesday", topic: "Energy and Work", duration: "1 hour" },
            { day: "Thursday", topic: "Review and Quiz", duration: "30 mins" },
            { day: "Friday", topic: "Momentum and Collisions", duration: "1 hour" },
          ],
        },
        {
          regNo: "2024CS002",
          semester: "5",
          subjectData: [
            { subject: "Mathematics", marks: 92, total: 100 },
            { subject: "Physics", marks: 88, total: 100 },
            { subject: "Chemistry", marks: 85, total: 100 },
            { subject: "English", marks: 90, total: 100 },
            { subject: "Computer Sci", marks: 97, total: 100 },
          ],
          radarData: [
            { subject: "Math", score: 92 },
            { subject: "Physics", score: 88 },
            { subject: "Chemistry", score: 85 },
            { subject: "English", score: 90 },
            { subject: "CS", score: 97 },
          ],
          overallGrade: "A+",
          overallPercentage: 90.4,
          strengths: ["Computer Science", "Mathematics", "English"],
          weaknesses: ["Chemistry"],
          schedule: [
            { day: "Monday", topic: "Chemical Bonding", duration: "1 hour" },
            { day: "Tuesday", topic: "Practice Problems - Equations", duration: "45 mins" },
            { day: "Wednesday", topic: "Organic Chemistry", duration: "1 hour" },
            { day: "Thursday", topic: "Review and Quiz", duration: "30 mins" },
            { day: "Friday", topic: "Lab Techniques", duration: "1 hour" },
          ],
        },
      ];
      
      localStorage.setItem('studentData', JSON.stringify(sampleStudentData));
      localStorage.setItem('datasetUploaded', 'true');
      const timestamp = new Date().toISOString();
      localStorage.setItem('uploadTimestamp', timestamp);
      localStorage.setItem('lastDatasetUploaded', Date.now().toString());
      
      // Add to recent activities
      const activity: Activity = {
        id: Date.now().toString(),
        message: "Student performance dataset uploaded",
        timestamp,
        type: 'dataset'
      };
      const activities = JSON.parse(localStorage.getItem('teacherActivities') || '[]');
      activities.unshift(activity);
      localStorage.setItem('teacherActivities', JSON.stringify(activities));
      setRecentActivities(activities.slice(0, 5));
      
      toast({
        title: "Dataset uploaded successfully!",
        description: "Students can now view their performance data.",
      });
      
      setUploading(false);
      setFile(null);
    }, 2000);
  };

  const stats = [
    { label: "Total Students", value: "156", icon: Users, color: "text-primary" },
    { label: "Active Datasets", value: "12", icon: FileText, color: "text-success" },
    { label: "Pending Reviews", value: "8", icon: CheckCircle, color: "text-warning" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Teacher Dashboard</h2>
          <p className="text-muted-foreground">Manage student performance data and analytics</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Student Performance Data
            </CardTitle>
            <CardDescription>
              Upload CSV or Excel files containing student performance data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
              <Input
                type="file"
                onChange={handleFileChange}
                accept=".csv,.xlsx,.xls"
                className="max-w-xs mx-auto"
              />
              {file && (
                <p className="mt-4 text-sm text-muted-foreground">
                  Selected: {file.name}
                </p>
              )}
            </div>
            <Button 
              onClick={handleUpload} 
              disabled={!file || uploading}
              className="w-full"
            >
              {uploading ? "Uploading..." : "Upload Dataset"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div 
                    key={activity.id} 
                    className={`flex items-start gap-4 ${index < recentActivities.length - 1 ? 'pb-4 border-b' : ''}`}
                  >
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'dataset' ? 'bg-success' : 
                      activity.type === 'assignment' ? 'bg-primary' : 
                      'bg-warning'
                    }`} />
                    <div className="flex-1">
                      <p className="font-medium">{activity.message}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No recent activities</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

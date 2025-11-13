import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, CheckCircle, Users, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function TeacherDashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    
    setUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      localStorage.setItem('datasetUploaded', 'true');
      localStorage.setItem('uploadTimestamp', new Date().toISOString());
      
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
            <div className="space-y-4">
              <div className="flex items-start gap-4 pb-4 border-b">
                <div className="w-2 h-2 rounded-full bg-success mt-2" />
                <div>
                  <p className="font-medium">Dataset uploaded for Grade 10A</p>
                  <p className="text-sm text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4 pb-4 border-b">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <div>
                  <p className="font-medium">Performance review completed</p>
                  <p className="text-sm text-muted-foreground">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-warning mt-2" />
                <div>
                  <p className="font-medium">Assignment deadline reminder</p>
                  <p className="text-sm text-muted-foreground">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

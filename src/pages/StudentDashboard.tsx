import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bell, BookOpen, TrendingUp, Calendar } from "lucide-react";

export default function StudentDashboard() {
  const { userId } = useAuth();
  const [hasNewData, setHasNewData] = useState(false);

  useEffect(() => {
    const dataUploaded = localStorage.getItem('datasetUploaded');
    setHasNewData(dataUploaded === 'true');
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {hasNewData && (
          <Alert className="border-primary bg-primary/10">
            <Bell className="h-4 w-4 text-primary" />
            <AlertTitle className="text-primary">New Performance Data Available!</AlertTitle>
            <AlertDescription className="text-foreground">
              Your teacher has uploaded new performance data. Check "Performance Review" from the menu to view your results.
            </AlertDescription>
          </Alert>
        )}

        <div>
          <h2 className="text-4xl font-bold text-foreground mb-2">
            Welcome, Student {userId}!
          </h2>
          <p className="text-muted-foreground text-lg">
            Use the sidebar menu to access your academic features
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Performance Review
              </CardTitle>
              <CardDescription>View your grades and performance analytics</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Assignments
              </CardTitle>
              <CardDescription>Track and manage your assignments</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Club Events
              </CardTitle>
              <CardDescription>Explore and register for club activities</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Check "Performance Review" to view your detailed academic performance after entering your credentials</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Stay updated with the latest assignments and club events through the sidebar menu</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Track your achievements and receive personalized feedback from teachers</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

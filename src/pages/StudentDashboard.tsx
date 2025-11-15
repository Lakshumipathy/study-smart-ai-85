import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { GraduationCap, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function StudentDashboard() {
  const { userId } = useAuth();
  const [notifications, setNotifications] = useState<{ type: string; count: number }[]>([]);

  useEffect(() => {
    const checkNotifications = () => {
      const lastCheckedAssignments = localStorage.getItem("lastCheckedAssignments") || "0";
      const lastCheckedEvents = localStorage.getItem("lastCheckedEvents") || "0";
      const lastAssignmentPosted = localStorage.getItem("lastAssignmentPosted") || "0";
      const lastEventPosted = localStorage.getItem("lastEventPosted") || "0";

      const newNotifications = [];
      
      if (parseInt(lastAssignmentPosted) > parseInt(lastCheckedAssignments)) {
        const assignments = JSON.parse(localStorage.getItem("assignments") || "[]");
        if (assignments.length > 0) {
          newNotifications.push({ type: "assignments", count: assignments.length });
        }
      }

      if (parseInt(lastEventPosted) > parseInt(lastCheckedEvents)) {
        const events = JSON.parse(localStorage.getItem("clubEvents") || "[]");
        if (events.length > 0) {
          newNotifications.push({ type: "events", count: events.length });
        }
      }

      setNotifications(newNotifications);
    };

    checkNotifications();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {notifications.length > 0 && (
          <Alert>
            <Bell className="h-4 w-4" />
            <AlertTitle>New Updates Available!</AlertTitle>
            <AlertDescription className="space-y-1">
              {notifications.map((notif, idx) => (
                <div key={idx}>
                  {notif.type === "assignments" && (
                    <Link to="/student/assignments" className="text-primary hover:underline block">
                      {notif.count} new assignment{notif.count > 1 ? "s" : ""} posted
                    </Link>
                  )}
                  {notif.type === "events" && (
                    <Link to="/student/events" className="text-primary hover:underline block">
                      {notif.count} new event{notif.count > 1 ? "s" : ""} posted
                    </Link>
                  )}
                </div>
              ))}
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <GraduationCap className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-2xl">Welcome, {userId}!</CardTitle>
                <CardDescription>
                  Your academic dashboard is ready to help you succeed
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Use the sidebar menu to navigate through your performance reviews, assignments, 
              club events, achievements, and feedback sections.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, CheckCircle } from "lucide-react";

export default function StudentAssignments() {
  const assignments = [
    { id: 1, title: "Physics Lab Report", subject: "Physics", dueDate: "2025-12-15", status: "pending" },
    { id: 2, title: "Math Problem Set", subject: "Mathematics", dueDate: "2025-12-10", status: "submitted" },
    { id: 3, title: "Chemistry Experiment", subject: "Chemistry", dueDate: "2025-12-20", status: "pending" },
    { id: 4, title: "English Essay", subject: "English", dueDate: "2025-12-08", status: "graded" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Assignments</h2>
          <p className="text-muted-foreground">Track and manage your assignments</p>
        </div>

        <div className="grid gap-4">
          {assignments.map((assignment) => (
            <Card key={assignment.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-lg">{assignment.title}</CardTitle>
                      <CardDescription>{assignment.subject}</CardDescription>
                    </div>
                  </div>
                  <Badge 
                    variant={assignment.status === 'graded' ? 'default' : assignment.status === 'submitted' ? 'secondary' : 'outline'}
                    className={
                      assignment.status === 'graded' ? 'bg-success text-success-foreground' :
                      assignment.status === 'submitted' ? 'bg-primary text-primary-foreground' :
                      'bg-warning text-warning-foreground'
                    }
                  >
                    {assignment.status === 'graded' ? <CheckCircle className="h-3 w-3 mr-1" /> : 
                     assignment.status === 'submitted' ? <CheckCircle className="h-3 w-3 mr-1" /> :
                     <Clock className="h-3 w-3 mr-1" />}
                    {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Due: {assignment.dueDate}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

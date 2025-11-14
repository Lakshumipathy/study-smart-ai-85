import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";

interface Feedback {
  id: string;
  studentId: string;
  subject: string;
  message: string;
  submittedDate: string;
}

export default function TeacherFeedback() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("studentFeedback");
    if (stored) {
      setFeedbacks(JSON.parse(stored));
    }
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Student Feedback</h2>
          <p className="text-muted-foreground">View feedback submitted by students</p>
        </div>

        {feedbacks.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No feedback submitted yet
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {feedbacks.map((feedback) => (
              <Card key={feedback.id}>
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <CardTitle className="text-lg">{feedback.subject}</CardTitle>
                      <p className="text-sm text-muted-foreground">Student ID: {feedback.studentId}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-foreground">{feedback.message}</p>
                  <p className="text-sm text-muted-foreground">Submitted: {feedback.submittedDate}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

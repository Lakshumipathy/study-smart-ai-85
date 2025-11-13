import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ThumbsUp, AlertCircle } from "lucide-react";

export default function StudentFeedback() {
  const feedbacks = [
    { 
      id: 1, 
      subject: "Mathematics", 
      teacher: "Mr. Johnson", 
      comment: "Excellent problem-solving skills. Keep up the good work!", 
      type: "positive",
      date: "2025-12-01"
    },
    { 
      id: 2, 
      subject: "Physics", 
      teacher: "Dr. Smith", 
      comment: "Need to focus more on theoretical concepts. Practice recommended.", 
      type: "improvement",
      date: "2025-11-28"
    },
    { 
      id: 3, 
      subject: "English", 
      teacher: "Ms. Williams", 
      comment: "Great essay writing skills. Vocabulary is impressive.", 
      type: "positive",
      date: "2025-11-25"
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Teacher Feedback</h2>
          <p className="text-muted-foreground">Reviews and suggestions from your teachers</p>
        </div>

        <div className="grid gap-4">
          {feedbacks.map((feedback) => (
            <Card key={feedback.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {feedback.type === 'positive' ? (
                      <ThumbsUp className="h-5 w-5 text-success" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-warning" />
                    )}
                    <div>
                      <CardTitle className="text-lg">{feedback.subject}</CardTitle>
                      <CardDescription>by {feedback.teacher}</CardDescription>
                    </div>
                  </div>
                  <Badge 
                    variant="outline"
                    className={feedback.type === 'positive' ? 'bg-success/10 text-success border-success' : 'bg-warning/10 text-warning border-warning'}
                  >
                    {feedback.type === 'positive' ? 'Positive' : 'Needs Improvement'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground mb-2">{feedback.comment}</p>
                <p className="text-sm text-muted-foreground">{feedback.date}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

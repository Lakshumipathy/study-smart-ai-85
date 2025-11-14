import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface Feedback {
  id: string;
  studentId: string;
  subject: string;
  message: string;
  submittedDate: string;
}

export default function StudentFeedback() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const { userId } = useAuth();

  const handleSubmit = () => {
    if (!subject || !message) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    const feedback: Feedback = {
      id: Date.now().toString(),
      studentId: userId || '',
      subject,
      message,
      submittedDate: new Date().toISOString().split('T')[0],
    };

    const stored = localStorage.getItem("studentFeedback");
    const feedbacks = stored ? JSON.parse(stored) : [];
    feedbacks.push(feedback);
    localStorage.setItem("studentFeedback", JSON.stringify(feedbacks));

    setSubject("");
    setMessage("");

    toast({
      title: "Success",
      description: "Feedback submitted successfully",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Submit Feedback</h2>
          <p className="text-muted-foreground">Share your thoughts and suggestions</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Feedback Form
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Course Quality, Facilities, etc."
              />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your feedback..."
                rows={6}
              />
            </div>
            <Button onClick={handleSubmit} className="w-full">
              <MessageSquare className="h-4 w-4 mr-2" />
              Submit Feedback
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

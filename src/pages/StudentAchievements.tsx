import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, Star, Medal } from "lucide-react";

export default function StudentAchievements() {
  const achievements = [
    { id: 1, title: "Perfect Attendance", description: "Attended all classes in November", icon: Star, color: "text-warning" },
    { id: 2, title: "Top Scorer", description: "Highest marks in Chemistry", icon: Trophy, color: "text-success" },
    { id: 3, title: "Best Project", description: "Outstanding Computer Science project", icon: Award, color: "text-primary" },
    { id: 4, title: "Quick Learner", description: "Completed all assignments on time", icon: Medal, color: "text-chart-4" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Achievements</h2>
          <p className="text-muted-foreground">Your awards and accomplishments</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {achievements.map((achievement) => (
            <Card key={achievement.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full bg-muted ${achievement.color}`}>
                    <achievement.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{achievement.title}</CardTitle>
                    <CardDescription>{achievement.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Progress Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Overall Achievement Score</span>
                  <span className="text-sm text-muted-foreground">85/100</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-success" style={{ width: '85%' }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

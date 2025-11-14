import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { Trophy, ExternalLink } from "lucide-react";

interface Achievement {
  id: string;
  studentId: string;
  type: 'inter-college' | 'external';
  date: string;
  content: string;
  location: string;
  universityName?: string;
  fileName: string;
  submittedDate: string;
}

export default function TeacherAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("achievements");
    if (stored) {
      setAchievements(JSON.parse(stored));
    }
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Student Achievements</h2>
          <p className="text-muted-foreground">View student achievement submissions</p>
        </div>

        {achievements.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No achievements submitted yet
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Trophy className="h-5 w-5 text-warning" />
                      <div>
                        <CardTitle className="text-lg">{achievement.content}</CardTitle>
                        <p className="text-sm text-muted-foreground">Student ID: {achievement.studentId}</p>
                      </div>
                    </div>
                    <Badge variant={achievement.type === 'inter-college' ? 'default' : 'secondary'}>
                      {achievement.type === 'inter-college' ? 'Inter-College' : 'External'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid gap-2 text-sm">
                    <p><strong>Date of Participation:</strong> {achievement.date}</p>
                    <p><strong>Location:</strong> {achievement.location}</p>
                    {achievement.universityName && (
                      <p><strong>University:</strong> {achievement.universityName}</p>
                    )}
                    <p><strong>Submitted:</strong> {achievement.submittedDate}</p>
                    <div className="flex items-center gap-2 text-primary">
                      <ExternalLink className="h-4 w-4" />
                      <span>File: {achievement.fileName}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

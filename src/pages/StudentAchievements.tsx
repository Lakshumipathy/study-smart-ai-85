import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { Trophy, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function StudentAchievements() {
  const [type, setType] = useState<'inter-college' | 'external'>('inter-college');
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const [universityName, setUniversityName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  const { userId } = useAuth();

  const handleSubmit = () => {
    if (!date || !content || !location || !file) {
      toast({
        title: "Error",
        description: "Please fill all required fields and upload a file",
        variant: "destructive",
      });
      return;
    }

    if (type === 'external' && !universityName) {
      toast({
        title: "Error",
        description: "Please enter university name for external participation",
        variant: "destructive",
      });
      return;
    }

    const achievement = {
      id: Date.now().toString(),
      studentId: userId,
      type,
      date,
      content,
      location,
      universityName: type === 'external' ? universityName : undefined,
      fileName: file.name,
      submittedDate: new Date().toISOString().split('T')[0],
    };

    const stored = localStorage.getItem("achievements");
    const achievements = stored ? JSON.parse(stored) : [];
    achievements.push(achievement);
    localStorage.setItem("achievements", JSON.stringify(achievements));

    setDate("");
    setContent("");
    setLocation("");
    setUniversityName("");
    setFile(null);
    setType('inter-college');

    toast({
      title: "Success",
      description: "Achievement submitted successfully",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Submit Achievement</h2>
          <p className="text-muted-foreground">Record your academic and extracurricular achievements</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-warning" />
              Achievement Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="mb-3 block">Participation Type</Label>
              <RadioGroup value={type} onValueChange={(value) => setType(value as 'inter-college' | 'external')}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="inter-college" id="inter" />
                  <Label htmlFor="inter" className="font-normal cursor-pointer">
                    Inter-College Participation
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="external" id="external" />
                  <Label htmlFor="external" className="font-normal cursor-pointer">
                    External Participation
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="date">Date of Participation *</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="content">Achievement Content *</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Describe your achievement (e.g., First Prize in Science Fair, Sports Championship)"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Main Auditorium, Sports Complex"
              />
            </div>

            {type === 'external' && (
              <div>
                <Label htmlFor="university">University Name *</Label>
                <Input
                  id="university"
                  value={universityName}
                  onChange={(e) => setUniversityName(e.target.value)}
                  placeholder="e.g., XYZ University"
                />
              </div>
            )}

            <div>
              <Label htmlFor="file">Upload Certificate/Document *</Label>
              <div className="mt-2">
                <Input
                  id="file"
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                {file && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Selected: {file.name}
                  </p>
                )}
              </div>
            </div>

            <Button onClick={handleSubmit} className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Submit Achievement
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

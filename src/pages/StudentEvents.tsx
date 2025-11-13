import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";

export default function StudentEvents() {
  const events = [
    { id: 1, title: "Science Club Meeting", date: "2025-12-12", time: "3:00 PM", location: "Lab 101", club: "Science Club" },
    { id: 2, title: "Coding Workshop", date: "2025-12-14", time: "4:00 PM", location: "Computer Lab", club: "Tech Club" },
    { id: 3, title: "Math Competition", date: "2025-12-18", time: "2:00 PM", location: "Auditorium", club: "Math Club" },
    { id: 4, title: "Drama Rehearsal", date: "2025-12-13", time: "5:00 PM", location: "Theater", club: "Drama Club" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Club Events</h2>
          <p className="text-muted-foreground">Upcoming events and activities</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {events.map((event) => (
            <Card key={event.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <Badge variant="secondary">{event.club}</Badge>
                </div>
                <CardDescription className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {event.date} at {event.time}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {event.location}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Briefcase, CheckCircle, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ResearchSubmission {
  id: string;
  type: 'research';
  studentId: string;
  studentName: string;
  registerNumber: string;
  department: string;
  semester: string;
  researchTitle: string;
  researchDomain: string;
  publicationType: string;
  publisherName: string;
  doiLink: string;
  abstract: string;
  dateOfPublication: string;
  mentorName: string;
  organization: string;
  fileUrl?: string;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface InternshipSubmission {
  id: string;
  type: 'internship';
  studentId: string;
  studentName: string;
  registerNumber: string;
  department: string;
  semester: string;
  companyName: string;
  role: string;
  startDate: string;
  endDate: string;
  duration: string;
  internshipType: string;
  supervisorName: string;
  description: string;
  skills: string[];
  certificateUrl?: string;
  projectDetails?: string;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

type Submission = ResearchSubmission | InternshipSubmission;

export default function TeacherResearchInternship() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filter, setFilter] = useState<'all' | 'research' | 'internship'>('all');
  const { toast } = useToast();

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = () => {
    const stored = localStorage.getItem("researchInternshipSubmissions");
    if (stored) {
      setSubmissions(JSON.parse(stored));
    }
  };

  const handleApprove = (id: string) => {
    const updated = submissions.map(s => 
      s.id === id ? { ...s, status: 'approved' as const } : s
    );
    setSubmissions(updated);
    localStorage.setItem("researchInternshipSubmissions", JSON.stringify(updated));
    
    toast({
      title: "Approved",
      description: "Submission has been approved",
    });
  };

  const handleReject = (id: string) => {
    const updated = submissions.map(s => 
      s.id === id ? { ...s, status: 'rejected' as const } : s
    );
    setSubmissions(updated);
    localStorage.setItem("researchInternshipSubmissions", JSON.stringify(updated));
    
    toast({
      title: "Rejected",
      description: "Submission has been rejected",
      variant: "destructive",
    });
  };

  const filteredSubmissions = submissions.filter(s => {
    if (filter === 'all') return true;
    return s.type === filter;
  });

  const researchSubmissions = filteredSubmissions.filter(s => s.type === 'research') as ResearchSubmission[];
  const internshipSubmissions = filteredSubmissions.filter(s => s.type === 'internship') as InternshipSubmission[];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Research & Internship Submissions</h2>
          <p className="text-muted-foreground">Review and approve student submissions</p>
        </div>

        <div className="flex gap-2">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All ({submissions.length})
          </Button>
          <Button 
            variant={filter === 'research' ? 'default' : 'outline'}
            onClick={() => setFilter('research')}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Research ({submissions.filter(s => s.type === 'research').length})
          </Button>
          <Button 
            variant={filter === 'internship' ? 'default' : 'outline'}
            onClick={() => setFilter('internship')}
          >
            <Briefcase className="h-4 w-4 mr-2" />
            Internship ({submissions.filter(s => s.type === 'internship').length})
          </Button>
        </div>

        {filteredSubmissions.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No submissions found
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue={filter === 'research' ? 'research' : filter === 'internship' ? 'internship' : 'all'} className="w-full">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="research">Research</TabsTrigger>
              <TabsTrigger value="internship">Internship</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {filteredSubmissions.map((submission) => (
                <Card key={submission.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {submission.type === 'research' ? (
                          <BookOpen className="h-5 w-5 text-primary" />
                        ) : (
                          <Briefcase className="h-5 w-5 text-primary" />
                        )}
                        <div>
                          <CardTitle className="text-lg">
                            {submission.type === 'research' 
                              ? (submission as ResearchSubmission).researchTitle 
                              : `${(submission as InternshipSubmission).companyName} - ${(submission as InternshipSubmission).role}`}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {submission.studentName} ({submission.registerNumber}) - {submission.department}, Sem {submission.semester}
                          </p>
                        </div>
                      </div>
                      <Badge variant={
                        submission.status === 'approved' ? 'default' : 
                        submission.status === 'rejected' ? 'destructive' : 
                        'secondary'
                      }>
                        {submission.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {submission.type === 'research' ? (
                      <div className="space-y-2 text-sm">
                        <p><strong>Domain:</strong> {(submission as ResearchSubmission).researchDomain}</p>
                        <p><strong>Publication Type:</strong> {(submission as ResearchSubmission).publicationType}</p>
                        <p><strong>Publisher:</strong> {(submission as ResearchSubmission).publisherName}</p>
                        <p><strong>DOI:</strong> <a href={(submission as ResearchSubmission).doiLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{(submission as ResearchSubmission).doiLink}</a></p>
                        <p><strong>Date of Publication:</strong> {(submission as ResearchSubmission).dateOfPublication}</p>
                        <p><strong>Mentor:</strong> {(submission as ResearchSubmission).mentorName}</p>
                        <p><strong>Organization:</strong> {(submission as ResearchSubmission).organization}</p>
                        <p><strong>Abstract:</strong> {(submission as ResearchSubmission).abstract}</p>
                        {(submission as ResearchSubmission).fileUrl && (
                          <p><strong>File:</strong> {(submission as ResearchSubmission).fileUrl}</p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2 text-sm">
                        <p><strong>Company:</strong> {(submission as InternshipSubmission).companyName}</p>
                        <p><strong>Role:</strong> {(submission as InternshipSubmission).role}</p>
                        <p><strong>Duration:</strong> {(submission as InternshipSubmission).startDate} to {(submission as InternshipSubmission).endDate} ({(submission as InternshipSubmission).duration})</p>
                        <p><strong>Type:</strong> {(submission as InternshipSubmission).internshipType}</p>
                        <p><strong>Supervisor:</strong> {(submission as InternshipSubmission).supervisorName}</p>
                        <p><strong>Description:</strong> {(submission as InternshipSubmission).description}</p>
                        <p><strong>Skills Gained:</strong> {(submission as InternshipSubmission).skills.join(', ')}</p>
                        {(submission as InternshipSubmission).projectDetails && (
                          <p><strong>Project Details:</strong> {(submission as InternshipSubmission).projectDetails}</p>
                        )}
                        {(submission as InternshipSubmission).certificateUrl && (
                          <p><strong>Certificate:</strong> {(submission as InternshipSubmission).certificateUrl}</p>
                        )}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">Submitted: {submission.submittedDate}</p>
                    
                    {submission.status === 'pending' && (
                      <div className="flex gap-2 pt-2">
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => handleApprove(submission.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleReject(submission.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="research" className="space-y-4">
              {researchSubmissions.map((submission) => (
                <Card key={submission.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <div>
                          <CardTitle className="text-lg">{submission.researchTitle}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {submission.studentName} ({submission.registerNumber}) - {submission.department}, Sem {submission.semester}
                          </p>
                        </div>
                      </div>
                      <Badge variant={
                        submission.status === 'approved' ? 'default' : 
                        submission.status === 'rejected' ? 'destructive' : 
                        'secondary'
                      }>
                        {submission.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <p><strong>Domain:</strong> {submission.researchDomain}</p>
                      <p><strong>Publication Type:</strong> {submission.publicationType}</p>
                      <p><strong>Publisher:</strong> {submission.publisherName}</p>
                      <p><strong>DOI:</strong> <a href={submission.doiLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{submission.doiLink}</a></p>
                      <p><strong>Date of Publication:</strong> {submission.dateOfPublication}</p>
                      <p><strong>Mentor:</strong> {submission.mentorName}</p>
                      <p><strong>Organization:</strong> {submission.organization}</p>
                      <p><strong>Abstract:</strong> {submission.abstract}</p>
                      {submission.fileUrl && <p><strong>File:</strong> {submission.fileUrl}</p>}
                    </div>
                    <p className="text-xs text-muted-foreground">Submitted: {submission.submittedDate}</p>
                    
                    {submission.status === 'pending' && (
                      <div className="flex gap-2 pt-2">
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => handleApprove(submission.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleReject(submission.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="internship" className="space-y-4">
              {internshipSubmissions.map((submission) => (
                <Card key={submission.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Briefcase className="h-5 w-5 text-primary" />
                        <div>
                          <CardTitle className="text-lg">
                            {submission.companyName} - {submission.role}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {submission.studentName} ({submission.registerNumber}) - {submission.department}, Sem {submission.semester}
                          </p>
                        </div>
                      </div>
                      <Badge variant={
                        submission.status === 'approved' ? 'default' : 
                        submission.status === 'rejected' ? 'destructive' : 
                        'secondary'
                      }>
                        {submission.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <p><strong>Duration:</strong> {submission.startDate} to {submission.endDate} ({submission.duration})</p>
                      <p><strong>Type:</strong> {submission.internshipType}</p>
                      <p><strong>Supervisor:</strong> {submission.supervisorName}</p>
                      <p><strong>Description:</strong> {submission.description}</p>
                      <p><strong>Skills Gained:</strong> {submission.skills.join(', ')}</p>
                      {submission.projectDetails && (
                        <p><strong>Project Details:</strong> {submission.projectDetails}</p>
                      )}
                      {submission.certificateUrl && (
                        <p><strong>Certificate:</strong> {submission.certificateUrl}</p>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">Submitted: {submission.submittedDate}</p>
                    
                    {submission.status === 'pending' && (
                      <div className="flex gap-2 pt-2">
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => handleApprove(submission.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleReject(submission.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
}

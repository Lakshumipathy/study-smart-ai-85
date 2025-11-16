import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Briefcase, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
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

export default function StudentResearchInternship() {
  const [submissionType, setSubmissionType] = useState<'research' | 'internship'>('research');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const { toast } = useToast();
  const { userId } = useAuth();

  // Research form state
  const [researchTitle, setResearchTitle] = useState("");
  const [researchDomain, setResearchDomain] = useState("");
  const [publicationType, setPublicationType] = useState("");
  const [publisherName, setPublisherName] = useState("");
  const [doiLink, setDoiLink] = useState("");
  const [abstract, setAbstract] = useState("");
  const [dateOfPublication, setDateOfPublication] = useState("");
  const [mentorName, setMentorName] = useState("");
  const [organization, setOrganization] = useState("");
  const [researchFile, setResearchFile] = useState<File | null>(null);

  // Internship form state
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [internshipType, setInternshipType] = useState("");
  const [supervisorName, setSupervisorName] = useState("");
  const [description, setDescription] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [certificate, setCertificate] = useState<File | null>(null);
  const [projectDetails, setProjectDetails] = useState("");

  // Student info
  const [studentName, setStudentName] = useState("");
  const [registerNumber, setRegisterNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("researchInternshipSubmissions");
    if (stored) {
      const allSubmissions = JSON.parse(stored);
      setSubmissions(allSubmissions.filter((s: Submission) => s.studentId === userId));
    }
  }, [userId]);

  const calculateDuration = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const months = Math.floor(diffDays / 30);
      const days = diffDays % 30;
      return `${months} months ${days} days`;
    }
    return "";
  };

  const addSkill = () => {
    if (skillsInput.trim() && !skills.includes(skillsInput.trim())) {
      setSkills([...skills, skillsInput.trim()]);
      setSkillsInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleSubmitResearch = () => {
    if (!researchTitle || !researchDomain || !publicationType || !publisherName || 
        !doiLink || !abstract || !dateOfPublication || !mentorName || !organization ||
        !studentName || !registerNumber || !department || !semester) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    const submission: ResearchSubmission = {
      id: Date.now().toString(),
      type: 'research',
      studentId: userId || '',
      studentName,
      registerNumber,
      department,
      semester,
      researchTitle,
      researchDomain,
      publicationType,
      publisherName,
      doiLink,
      abstract,
      dateOfPublication,
      mentorName,
      organization,
      fileUrl: researchFile?.name,
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'pending',
    };

    const stored = localStorage.getItem("researchInternshipSubmissions");
    const allSubmissions = stored ? JSON.parse(stored) : [];
    allSubmissions.push(submission);
    localStorage.setItem("researchInternshipSubmissions", JSON.stringify(allSubmissions));

    setSubmissions([...submissions, submission]);
    resetResearchForm();

    toast({
      title: "Success",
      description: "Research submission submitted successfully",
    });
  };

  const handleSubmitInternship = () => {
    if (!companyName || !role || !startDate || !endDate || !internshipType || 
        !supervisorName || !description || skills.length === 0 ||
        !studentName || !registerNumber || !department || !semester) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    const submission: InternshipSubmission = {
      id: Date.now().toString(),
      type: 'internship',
      studentId: userId || '',
      studentName,
      registerNumber,
      department,
      semester,
      companyName,
      role,
      startDate,
      endDate,
      duration: calculateDuration(),
      internshipType,
      supervisorName,
      description,
      skills,
      certificateUrl: certificate?.name,
      projectDetails,
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'pending',
    };

    const stored = localStorage.getItem("researchInternshipSubmissions");
    const allSubmissions = stored ? JSON.parse(stored) : [];
    allSubmissions.push(submission);
    localStorage.setItem("researchInternshipSubmissions", JSON.stringify(allSubmissions));

    setSubmissions([...submissions, submission]);
    resetInternshipForm();

    toast({
      title: "Success",
      description: "Internship submission submitted successfully",
    });
  };

  const resetResearchForm = () => {
    setResearchTitle("");
    setResearchDomain("");
    setPublicationType("");
    setPublisherName("");
    setDoiLink("");
    setAbstract("");
    setDateOfPublication("");
    setMentorName("");
    setOrganization("");
    setResearchFile(null);
    setStudentName("");
    setRegisterNumber("");
    setDepartment("");
    setSemester("");
  };

  const resetInternshipForm = () => {
    setCompanyName("");
    setRole("");
    setStartDate("");
    setEndDate("");
    setInternshipType("");
    setSupervisorName("");
    setDescription("");
    setSkills([]);
    setSkillsInput("");
    setCertificate(null);
    setProjectDetails("");
    setStudentName("");
    setRegisterNumber("");
    setDepartment("");
    setSemester("");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Research & Internship</h2>
          <p className="text-muted-foreground">Submit your research contributions or internship details</p>
        </div>

        <Tabs defaultValue="submit" className="w-full">
          <TabsList>
            <TabsTrigger value="submit">Submit New</TabsTrigger>
            <TabsTrigger value="view">My Submissions</TabsTrigger>
          </TabsList>

          <TabsContent value="submit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Information</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="studentName">Name *</Label>
                  <Input
                    id="studentName"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <Label htmlFor="registerNumber">Register Number *</Label>
                  <Input
                    id="registerNumber"
                    value={registerNumber}
                    onChange={(e) => setRegisterNumber(e.target.value)}
                    placeholder="Enter register number"
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department *</Label>
                  <Input
                    id="department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Enter department"
                  />
                </div>
                <div>
                  <Label htmlFor="semester">Semester *</Label>
                  <Input
                    id="semester"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    placeholder="Enter semester"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Submission Type</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={submissionType} onValueChange={(value) => setSubmissionType(value as 'research' | 'internship')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="research">Research Contribution</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {submissionType === 'research' ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Research Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="researchTitle">Research Title *</Label>
                    <Input
                      id="researchTitle"
                      value={researchTitle}
                      onChange={(e) => setResearchTitle(e.target.value)}
                      placeholder="Enter research title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="researchDomain">Research Domain *</Label>
                    <Input
                      id="researchDomain"
                      value={researchDomain}
                      onChange={(e) => setResearchDomain(e.target.value)}
                      placeholder="e.g., Machine Learning, IoT"
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="publicationType">Publication Type *</Label>
                      <Select value={publicationType} onValueChange={setPublicationType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="journal">Journal</SelectItem>
                          <SelectItem value="conference">Conference</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="publisherName">Publisher Name *</Label>
                      <Input
                        id="publisherName"
                        value={publisherName}
                        onChange={(e) => setPublisherName(e.target.value)}
                        placeholder="Enter publisher name"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="doiLink">DOI Link *</Label>
                    <Input
                      id="doiLink"
                      value={doiLink}
                      onChange={(e) => setDoiLink(e.target.value)}
                      placeholder="https://doi.org/..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="abstract">Abstract *</Label>
                    <Textarea
                      id="abstract"
                      value={abstract}
                      onChange={(e) => setAbstract(e.target.value)}
                      placeholder="Enter research abstract"
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateOfPublication">Date of Publication *</Label>
                    <Input
                      id="dateOfPublication"
                      type="date"
                      value={dateOfPublication}
                      onChange={(e) => setDateOfPublication(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="mentorName">Mentor Name *</Label>
                      <Input
                        id="mentorName"
                        value={mentorName}
                        onChange={(e) => setMentorName(e.target.value)}
                        placeholder="Enter mentor name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="organization">College/Organization *</Label>
                      <Input
                        id="organization"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder="Enter organization"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="researchFile">Upload PDF (Optional)</Label>
                    <Input
                      id="researchFile"
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setResearchFile(e.target.files?.[0] || null)}
                    />
                  </div>
                  <Button onClick={handleSubmitResearch} className="w-full">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Submit Research
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    Internship Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Enter company name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">Role *</Label>
                      <Input
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="e.g., Software Developer"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="startDate">Start Date *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">End Date *</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                  {startDate && endDate && (
                    <div>
                      <Label>Duration (Auto-calculated)</Label>
                      <Input value={calculateDuration()} disabled />
                    </div>
                  )}
                  <div>
                    <Label htmlFor="internshipType">Internship Type *</Label>
                    <Select value={internshipType} onValueChange={setInternshipType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="offline">Offline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="supervisorName">Supervisor Name *</Label>
                    <Input
                      id="supervisorName"
                      value={supervisorName}
                      onChange={(e) => setSupervisorName(e.target.value)}
                      placeholder="Enter supervisor name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description of Work *</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your work during the internship"
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="skillsInput">Skills Gained *</Label>
                    <div className="flex gap-2">
                      <Input
                        id="skillsInput"
                        value={skillsInput}
                        onChange={(e) => setSkillsInput(e.target.value)}
                        placeholder="Enter a skill and press Add"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      />
                      <Button type="button" onClick={addSkill}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="gap-1">
                          {skill}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => removeSkill(skill)} />
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="certificate">Certificate Upload *</Label>
                    <Input
                      id="certificate"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setCertificate(e.target.files?.[0] || null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="projectDetails">Project Details (Optional)</Label>
                    <Textarea
                      id="projectDetails"
                      value={projectDetails}
                      onChange={(e) => setProjectDetails(e.target.value)}
                      placeholder="Describe any projects you worked on"
                      rows={3}
                    />
                  </div>
                  <Button onClick={handleSubmitInternship} className="w-full">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Submit Internship
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="view" className="space-y-4">
            {submissions.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No submissions yet
                </CardContent>
              </Card>
            ) : (
              submissions.map((submission) => (
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
                              ? submission.researchTitle 
                              : `${submission.companyName} - ${submission.role}`}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            Submitted: {submission.submittedDate}
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
                  <CardContent>
                    {submission.type === 'research' ? (
                      <div className="space-y-2 text-sm">
                        <p><strong>Domain:</strong> {submission.researchDomain}</p>
                        <p><strong>Publication:</strong> {submission.publicationType} - {submission.publisherName}</p>
                        <p><strong>Mentor:</strong> {submission.mentorName}</p>
                      </div>
                    ) : (
                      <div className="space-y-2 text-sm">
                        <p><strong>Duration:</strong> {submission.duration}</p>
                        <p><strong>Type:</strong> {submission.internshipType}</p>
                        <p><strong>Skills:</strong> {submission.skills.join(', ')}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

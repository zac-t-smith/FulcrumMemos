import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Download, Mail, Linkedin, Briefcase, GraduationCap, Award, Code } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Resume() {
  const { data: resumes = [], isLoading } = useQuery({
    queryKey: ['resume'],
    queryFn: () => base44.entities.Resume.list(),
  });

  const resume = resumes[0] || {};

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Skeleton className="h-12 w-64 mb-8" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] py-12 print:bg-white print:py-0">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-8 print:hidden">
          <h1 className="text-3xl font-bold text-[#0B1F3B]">Resume</h1>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handlePrint}>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Resume Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 print:shadow-none print:p-0">
          {/* Header */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h1 className="text-4xl font-bold text-[#0B1F3B] mb-2">Zac Smith</h1>
            <p className="text-xl text-[#6B7280] mb-4">{resume.headline || "Restructuring & Credit Investing"}</p>
            <div className="flex flex-wrap gap-4 text-sm">
              {resume.email && (
                <a href={`mailto:${resume.email}`} className="flex items-center text-[#0EA5E9] hover:underline">
                  <Mail className="w-4 h-4 mr-2" />
                  {resume.email}
                </a>
              )}
              {resume.linkedin_url && (
                <a href={resume.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center text-[#0EA5E9] hover:underline">
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn Profile
                </a>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Summary */}
              {resume.summary && (
                <section>
                  <h2 className="text-xl font-bold text-[#0B1F3B] mb-4 flex items-center">
                    <Briefcase className="w-5 h-5 mr-2" />
                    Professional Summary
                  </h2>
                  <p className="text-[#6B7280] leading-relaxed whitespace-pre-line">
                    {resume.summary}
                  </p>
                </section>
              )}

              {/* Experience */}
              {resume.experience && resume.experience.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-[#0B1F3B] mb-4 flex items-center">
                    <Briefcase className="w-5 h-5 mr-2" />
                    Experience
                  </h2>
                  <div className="space-y-6">
                    {resume.experience.map((exp, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold text-[#2A2F36]">{exp.title}</h3>
                            <p className="text-[#6B7280]">{exp.company}</p>
                          </div>
                          <span className="text-sm text-[#6B7280] whitespace-nowrap ml-4">
                            {exp.start} - {exp.end}
                          </span>
                        </div>
                        {exp.bullets && exp.bullets.length > 0 && (
                          <ul className="list-disc list-inside space-y-1 text-[#6B7280]">
                            {exp.bullets.map((bullet, i) => (
                              <li key={i} className="leading-relaxed">{bullet}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Education */}
              {resume.education && resume.education.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-[#0B1F3B] mb-4 flex items-center">
                    <GraduationCap className="w-5 h-5 mr-2" />
                    Education
                  </h2>
                  <div className="space-y-4">
                    {resume.education.map((edu, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-[#2A2F36]">{edu.degree}</h3>
                            <p className="text-[#6B7280]">{edu.school}</p>
                            {edu.notes && <p className="text-sm text-[#6B7280] mt-1">{edu.notes}</p>}
                          </div>
                          <span className="text-sm text-[#6B7280] whitespace-nowrap ml-4">{edu.dates}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Skills */}
              {resume.skills && resume.skills.length > 0 && (
                <Card className="border-none shadow-sm">
                  <CardHeader className="pb-3">
                    <h2 className="text-lg font-bold text-[#0B1F3B] flex items-center">
                      <Code className="w-5 h-5 mr-2" />
                      Skills
                    </h2>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {resume.skills.map((skill, index) => (
                        <span key={index} className="bg-[#0B1F3B]/10 text-[#0B1F3B] px-3 py-1 rounded-full text-sm font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Certifications */}
              {resume.certifications && resume.certifications.length > 0 && (
                <Card className="border-none shadow-sm">
                  <CardHeader className="pb-3">
                    <h2 className="text-lg font-bold text-[#0B1F3B] flex items-center">
                      <Award className="w-5 h-5 mr-2" />
                      Certifications
                    </h2>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {resume.certifications.map((cert, index) => (
                        <li key={index} className="text-[#6B7280] text-sm">{cert}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Selected Work */}
              {resume.selected_work && resume.selected_work.length > 0 && (
                <Card className="border-none shadow-sm">
                  <CardHeader className="pb-3">
                    <h2 className="text-lg font-bold text-[#0B1F3B]">Selected Work</h2>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {resume.selected_work.map((work, index) => (
                        <li key={index} className="text-[#6B7280] text-sm">{work}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

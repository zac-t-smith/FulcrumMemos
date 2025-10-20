import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, ExternalLink, Calendar, Building, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import ReactMarkdown from "react-markdown";
import { Skeleton } from "@/components/ui/skeleton";

export default function MemoDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug');
  const [showSources, setShowSources] = useState(false);

  const { data: memos = [], isLoading } = useQuery({
    queryKey: ['memo', slug],
    queryFn: () => base44.entities.Memo.filter({ slug }),
  });

  const memo = memos[0];

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Skeleton className="h-12 w-3/4 mb-8" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!memo) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardContent className="p-12 text-center">
            <h2 className="text-2xl font-bold text-[#2A2F36] mb-4">Memo not found</h2>
            <Link to={createPageUrl("Memos")}>
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Memos
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const sections = [
    { id: 'summary', title: 'Executive Summary', content: memo.executive_summary },
    { id: 'capital', title: 'Capital Structure', content: memo.capital_structure },
    { id: 'timeline', title: 'Timeline', content: memo.timeline },
    { id: 'mechanics', title: 'Restructuring Mechanics', content: memo.restructuring_mechanics },
    { id: 'scenarios', title: 'Scenarios', content: memo.scenarios },
    { id: 'valuation', title: 'Valuation', content: memo.valuation },
    { id: 'recovery', title: 'Recovery Waterfall', content: memo.recovery_waterfall },
    { id: 'lessons', title: 'Key Lessons', content: memo.key_lessons },
    { id: 'monitoring', title: 'Monitoring Plan', content: memo.monitoring_plan },
  ].filter(section => section.content);

  return (
    <div className="min-h-screen bg-[#F3F4F6] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link to={createPageUrl("Memos")} className="inline-flex items-center text-[#0EA5E9] hover:text-[#0B1F3B] mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Memos
        </Link>

        {/* Hero Section */}
        <Card className="border-none shadow-lg mb-8">
          <CardContent className="p-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="bg-[#0E9F6E]/10 text-[#0E9F6E] border-[#0E9F6E]/20">
                {memo.memo_type}
              </Badge>
              {memo.tags?.map((tag, i) => (
                <Badge key={i} variant="outline">{tag}</Badge>
              ))}
            </div>

            <h1 className="text-4xl font-bold text-[#0B1F3B] mb-4">{memo.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-[#6B7280] mb-6">
              <div className="flex items-center">
                <Building className="w-4 h-4 mr-2" />
                {memo.company}
              </div>
              {memo.ticker_or_issuer_id && (
                <div className="text-sm font-mono">{memo.ticker_or_issuer_id}</div>
              )}
              {memo.analysis_date && (
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {format(new Date(memo.analysis_date), "MMMM d, yyyy")}
                </div>
              )}
            </div>

            {memo.thesis_one_liner && (
              <p className="text-lg text-[#2A2F36] font-medium border-l-4 border-[#0EA5E9] pl-4 py-2 bg-[#0EA5E9]/5">
                {memo.thesis_one_liner}
              </p>
            )}

            <div className="flex gap-3 mt-6">
              {memo.show_pdf_download && (
                <Button className="bg-[#0B1F3B] hover:bg-[#0B1F3B]/90">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              )}
              {memo.sources && memo.sources.length > 0 && (
                <Dialog open={showSources} onOpenChange={setShowSources}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Sources
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Sources & Citations</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      {memo.sources.map((source, i) => (
                        <div key={i} className="border-l-2 border-[#0EA5E9] pl-4">
                          <h4 className="font-semibold text-[#2A2F36] mb-1">{source.label}</h4>
                          {source.citation && (
                            <p className="text-sm text-[#6B7280] mb-2">{source.citation}</p>
                          )}
                          {source.url && (
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-[#0EA5E9] hover:underline flex items-center"
                            >
                              {source.url}
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <Card className="border-none shadow-sm sticky top-20">
              <CardContent className="p-6">
                <h3 className="font-bold text-[#0B1F3B] mb-4">Contents</h3>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="block text-sm text-[#6B7280] hover:text-[#0EA5E9] transition-colors py-1"
                    >
                      {section.title}
                    </a>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-8">
            {sections.map((section) => (
              <Card key={section.id} id={section.id} className="border-none shadow-sm scroll-mt-24">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-[#0B1F3B] mb-6 pb-3 border-b border-gray-200">
                    {section.title}
                  </h2>
                  
                  {/* Executive Summary & Markdown Sections */}
                  {(section.id === 'summary' || section.id === 'capital' || section.id === 'mechanics' || 
                    section.id === 'valuation' || section.id === 'recovery') && (
                    <div className="prose prose-slate max-w-none">
                      <ReactMarkdown>{section.content}</ReactMarkdown>
                    </div>
                  )}

                  {/* Timeline */}
                  {section.id === 'timeline' && Array.isArray(section.content) && (
                    <div className="space-y-4">
                      {section.content.map((event, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="flex-shrink-0 w-24 text-sm font-medium text-[#6B7280]">
                            {event.date}
                          </div>
                          <div className="flex-1 border-l-2 border-[#0EA5E9] pl-4 pb-4">
                            <h4 className="font-semibold text-[#2A2F36] mb-1">{event.headline}</h4>
                            <p className="text-sm text-[#6B7280]">{event.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Scenarios */}
                  {section.id === 'scenarios' && Array.isArray(section.content) && (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b-2 border-[#0B1F3B]">
                            <th className="text-left py-3 px-4 font-semibold text-[#0B1F3B]">Scenario</th>
                            <th className="text-left py-3 px-4 font-semibold text-[#0B1F3B]">Probability</th>
                            <th className="text-left py-3 px-4 font-semibold text-[#0B1F3B]">Recovery</th>
                            <th className="text-left py-3 px-4 font-semibold text-[#0B1F3B]">Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {section.content.map((scenario, i) => (
                            <tr key={i} className="border-b border-gray-200">
                              <td className="py-3 px-4 font-medium">{scenario.name}</td>
                              <td className="py-3 px-4">{scenario.probability}</td>
                              <td className="py-3 px-4">{scenario.recovery_range}</td>
                              <td className="py-3 px-4 text-sm text-[#6B7280]">{scenario.notes}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Key Lessons */}
                  {section.id === 'lessons' && Array.isArray(section.content) && (
                    <ul className="space-y-3">
                      {section.content.map((lesson, i) => (
                        <li key={i} className="flex items-start">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0E9F6E]/10 text-[#0E9F6E] flex items-center justify-center font-semibold text-sm mr-3 mt-0.5">
                            {i + 1}
                          </span>
                          <span className="text-[#6B7280] leading-relaxed">{lesson}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Monitoring Plan */}
                  {section.id === 'monitoring' && Array.isArray(section.content) && (
                    <div className="space-y-4">
                      {section.content.map((item, i) => (
                        <Card key={i} className="border border-gray-200">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-[#2A2F36]">{item.event}</h4>
                              <Badge variant="outline" className="text-xs">
                                {item.milestone_date}
                              </Badge>
                            </div>
                            <p className="text-sm text-[#6B7280]">{item.signal}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {/* Confidential Notes (if applicable) */}
            {memo.confidential_notes && memo.status === 'Private' && (
              <Card className="border-2 border-amber-200 bg-amber-50">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-amber-900 mb-4">Confidential Notes</h2>
                  <p className="text-amber-800 whitespace-pre-line">{memo.confidential_notes}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

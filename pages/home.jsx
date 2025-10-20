import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, TrendingUp, Award, ArrowRight, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function Home() {
  const { data: memos = [] } = useQuery({
    queryKey: ['featured-memos'],
    queryFn: () => base44.entities.Memo.filter({ status: 'Public' }, '-date_published', 3),
  });

  const stats = [
    { label: "Years Experience", value: "3+", icon: Calendar },
    { label: "Focus", value: "Special Sits", icon: TrendingUp },
    { label: "Memos Published", value: memos.length, icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F3F4F6]">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-[#F3F4F6] rounded-full px-4 py-2 mb-6">
            <Award className="w-4 h-4 text-[#0EA5E9]" />
            <span className="text-sm font-medium text-[#6B7280]">Available for Opportunities</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-[#0B1F3B] mb-6 tracking-tight">
            Zac Smith
          </h1>
          
          <p className="text-2xl md:text-3xl text-[#2A2F36] mb-6 font-light">
            Restructuring & Credit Investing
          </p>
          
          <p className="text-lg text-[#6B7280] max-w-2xl mx-auto leading-relaxed mb-10">
            RX analyst focused on special situations and distressed credit. This site hosts my resume 
            and a curated portfolio of credit memos analyzing complex restructurings, covenant packages, 
            and turnaround opportunities.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl("Memos")}>
              <Button className="bg-[#0B1F3B] hover:bg-[#0B1F3B]/90 text-white px-8 py-6 text-lg h-auto">
                Explore Memos
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to={createPageUrl("Resume")}>
              <Button variant="outline" className="border-[#0B1F3B] text-[#0B1F3B] hover:bg-[#F3F4F6] px-8 py-6 text-lg h-auto">
                View Resume
                <FileText className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#0B1F3B]/10 mb-4">
                  <stat.icon className="w-6 h-6 text-[#0B1F3B]" />
                </div>
                <div className="text-4xl font-bold text-[#0B1F3B] mb-2">{stat.value}</div>
                <div className="text-sm text-[#6B7280] font-medium">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Featured Memos */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#0B1F3B] mb-3">Featured Analyses</h2>
          <p className="text-[#6B7280]">Recent restructuring and credit memos</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {memos.map((memo) => (
            <Link key={memo.id} to={createPageUrl(`MemoDetail?slug=${memo.slug}`)}>
              <Card className="border-none shadow-sm hover:shadow-lg transition-all duration-300 h-full group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <Badge className="bg-[#0E9F6E]/10 text-[#0E9F6E] border-[#0E9F6E]/20">
                      {memo.memo_type}
                    </Badge>
                    <span className="text-xs text-[#6B7280]">
                      {memo.analysis_date && format(new Date(memo.analysis_date), "MMM yyyy")}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-[#0B1F3B] mb-2 group-hover:text-[#0EA5E9] transition-colors">
                    {memo.title}
                  </h3>
                  
                  <p className="text-[#6B7280] text-sm mb-4 font-medium">{memo.company}</p>
                  
                  <p className="text-[#6B7280] text-sm leading-relaxed mb-4">
                    {memo.thesis_one_liner}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {memo.tags?.slice(0, 3).map((tag, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link to={createPageUrl("Memos")}>
            <Button variant="outline" className="border-[#0B1F3B] text-[#0B1F3B] hover:bg-[#F3F4F6]">
              View All Memos
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

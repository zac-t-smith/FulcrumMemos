import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Mail, Linkedin, FileText, TrendingUp, Target, BookOpen } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-[#F3F4F6] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#0B1F3B] to-[#0EA5E9] flex items-center justify-center">
            <span className="text-white font-bold text-3xl">ZS</span>
          </div>
          <h1 className="text-4xl font-bold text-[#0B1F3B] mb-4">About Zac Smith</h1>
          <p className="text-xl text-[#6B7280]">Restructuring & Credit Investing</p>
        </div>

        {/* Main Bio */}
        <Card className="border-none shadow-lg mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-[#0B1F3B] mb-6">Background</h2>
            <div className="space-y-4 text-[#6B7280] leading-relaxed">
              <p>
                I'm an aspiring restructuring analyst with a deep interest in distressed credit, 
                special situations, and turnaround investing. My analytical approach combines 
                rigorous financial modeling with practical understanding of bankruptcy mechanics 
                and creditor dynamics.
              </p>
              <p>
                Through this portfolio, I document my learning journey by analyzing real-world 
                restructuring cases, dissecting capital structures, and developing frameworks 
                for evaluating distressed opportunities. Each memo represents hundreds of hours 
                of research, modeling, and synthesis of complex financial and legal documents.
              </p>
              <p>
                My goal is to build a career in special situations investing, leveraging analytical 
                rigor and a passion for understanding how companies navigate financial distress.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Why RX Section */}
        <Card className="border-none shadow-lg mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-[#0B1F3B] mb-6 flex items-center">
              <Target className="w-6 h-6 mr-2" />
              Why Restructuring?
            </h2>
            <div className="space-y-4 text-[#6B7280] leading-relaxed">
              <p>
                Restructuring sits at the intersection of finance, law, and strategy—requiring 
                both technical mastery and creative problem-solving. What draws me to this field:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong className="text-[#2A2F36]">Complexity:</strong> Each situation is unique, 
                  requiring deep analysis of capital structures, covenants, and recovery scenarios
                </li>
                <li>
                  <strong className="text-[#2A2F36]">Value Creation:</strong> Finding opportunities 
                  where others see only risk, identifying mispriced securities in stressed situations
                </li>
                <li>
                  <strong className="text-[#2A2F36]">Learning:</strong> Constantly evolving landscape 
                  that demands continuous learning and adaptation
                </li>
                <li>
                  <strong className="text-[#2A2F36]">Impact:</strong> Contributing to solutions that 
                  help companies emerge stronger while generating returns for investors
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Approach Section */}
        <Card className="border-none shadow-lg mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-[#0B1F3B] mb-6 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              My Approach
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-[#2A2F36] flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-[#0EA5E9]" />
                  Research Process
                </h3>
                <ul className="space-y-2 text-sm text-[#6B7280]">
                  <li>• Deep dive into SEC filings and credit agreements</li>
                  <li>• Build detailed financial models</li>
                  <li>• Map capital structures and recovery waterfalls</li>
                  <li>• Analyze comparable situations and precedents</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-[#2A2F36] flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-[#0EA5E9]" />
                  Documentation
                </h3>
                <ul className="space-y-2 text-sm text-[#6B7280]">
                  <li>• Comprehensive executive summaries</li>
                  <li>• Scenario analysis with probability weights</li>
                  <li>• Key lessons and takeaways</li>
                  <li>• Ongoing monitoring frameworks</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact CTA */}
        <Card className="border-none shadow-lg bg-gradient-to-br from-[#0B1F3B] to-[#0EA5E9]">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Let's Connect</h2>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Interested in discussing restructuring opportunities, sharing insights, 
              or exploring collaboration? I'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("Contact")}>
                <Button className="bg-white text-[#0B1F3B] hover:bg-white/90">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </Link>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                  <Linkedin className="w-4 h-4 mr-2" />
                  Connect on LinkedIn
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Unlock, ArrowRight, Calendar } from "lucide-react";
import { format } from "date-fns";

const PASSCODE = "rx2025"; // In production, this would be environment-based

export default function Private() {
  const [isUnlocked, setIsUnlocked] = useState(
    sessionStorage.getItem('privateAccess') === 'granted'
  );
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");

  const { data: privateMemos = [] } = useQuery({
    queryKey: ['private-memos'],
    queryFn: () => base44.entities.Memo.filter({ status: 'Private' }, '-date_published'),
    enabled: isUnlocked,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passcode === PASSCODE) {
      setIsUnlocked(true);
      sessionStorage.setItem('privateAccess', 'granted');
      setError("");
    } else {
      setError("Incorrect passcode. Please try again.");
    }
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center py-12">
        <Card className="max-w-md w-full mx-4 border-none shadow-lg">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#0B1F3B]/10 flex items-center justify-center">
                <Lock className="w-8 h-8 text-[#0B1F3B]" />
              </div>
              <h1 className="text-2xl font-bold text-[#0B1F3B] mb-2">Private Memos</h1>
              <p className="text-[#6B7280]">Enter passcode to access confidential analyses</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="passcode" className="text-[#2A2F36]">Passcode</Label>
                <Input
                  id="passcode"
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter passcode"
                  className="mt-1"
                />
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full bg-[#0B1F3B] hover:bg-[#0B1F3B]/90">
                <Unlock className="w-4 h-4 mr-2" />
                Unlock Access
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#0B1F3B] mb-2">Private Memos</h1>
            <p className="text-[#6B7280]">{privateMemos.length} confidential analyses</p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              sessionStorage.removeItem('privateAccess');
              setIsUnlocked(false);
            }}
          >
            <Lock className="w-4 h-4 mr-2" />
            Lock
          </Button>
        </div>

        {privateMemos.length === 0 ? (
          <Card className="border-none shadow-sm">
            <CardContent className="p-12 text-center">
              <Lock className="w-12 h-12 text-[#6B7280] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#2A2F36] mb-2">No private memos yet</h3>
              <p className="text-[#6B7280]">Private memos will appear here when available</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {privateMemos.map((memo) => (
              <Link key={memo.id} to={createPageUrl(`MemoDetail?slug=${memo.slug}`)}>
                <Card className="border-none shadow-sm hover:shadow-lg transition-all duration-300 h-full group border-l-4 border-l-amber-500">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                        PRIVATE
                      </Badge>
                      <span className="text-xs text-[#6B7280]">
                        {memo.analysis_date && format(new Date(memo.analysis_date), "MMM yyyy")}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-[#0B1F3B] mb-2 group-hover:text-[#0EA5E9] transition-colors line-clamp-2">
                      {memo.title}
                    </h3>
                    
                    <p className="text-[#6B7280] text-sm mb-4 font-medium">{memo.company}</p>
                    
                    <p className="text-[#6B7280] text-sm leading-relaxed mb-4 line-clamp-3">
                      {memo.thesis_one_liner}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge className="bg-[#0E9F6E]/10 text-[#0E9F6E] border-[#0E9F6E]/20 text-xs">
                        {memo.memo_type}
                      </Badge>
                      {memo.tags?.slice(0, 2).map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {tag}
 

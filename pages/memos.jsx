import React, { useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Calendar, ArrowRight, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function Memos() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterYear, setFilterYear] = useState("all");

  const { data: memos = [], isLoading } = useQuery({
    queryKey: ['memos'],
    queryFn: () => base44.entities.Memo.filter({ status: 'Public' }, '-date_published'),
  });

  const filteredMemos = useMemo(() => {
    return memos.filter((memo) => {
      const matchesSearch = searchQuery === "" || 
        memo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        memo.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        memo.thesis_one_liner?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        memo.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType = filterType === "all" || memo.memo_type === filterType;
      
      const memoYear = memo.analysis_date ? new Date(memo.analysis_date).getFullYear().toString() : null;
      const matchesYear = filterYear === "all" || memoYear === filterYear;

      return matchesSearch && matchesType && matchesYear;
    });
  }, [memos, searchQuery, filterType, filterYear]);

  const uniqueYears = useMemo(() => {
    const years = memos
      .map(m => m.analysis_date ? new Date(m.analysis_date).getFullYear() : null)
      .filter(y => y !== null);
    return [...new Set(years)].sort((a, b) => b - a);
  }, [memos]);

  const resetFilters = () => {
    setSearchQuery("");
    setFilterType("all");
    setFilterYear("all");
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-[#0B1F3B] mb-2">Credit Memos</h1>
              <p className="text-[#6B7280]">
                {filteredMemos.length} {filteredMemos.length === 1 ? 'analysis' : 'analyses'} available
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-[#6B7280]">
              <TrendingUp className="w-5 h-5 text-[#0EA5E9]" />
              <span>Sorted by most recent</span>
            </div>
          </div>

          {/* Search and Filters */}
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                  <Input
                    placeholder="Search memos, companies, tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="RX">RX</SelectItem>
                    <SelectItem value="Distressed Credit">Distressed Credit</SelectItem>
                    <SelectItem value="Special Sits">Special Sits</SelectItem>
                    <SelectItem value="Covenant Analysis">Covenant Analysis</SelectItem>
                    <SelectItem value="Turnaround">Turnaround</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterYear} onValueChange={setFilterYear}>
                  <SelectTrigger>
                    <Calendar className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {uniqueYears.map(year => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {(searchQuery || filterType !== "all" || filterYear !== "all") && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-[#6B7280]">
                    Showing {filteredMemos.length} of {memos.length} memos
                  </p>
                  <Button variant="ghost" size="sm" onClick={resetFilters}>
                    Clear filters
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Memos Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <Card key={i} className="border-none shadow-sm">
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-24 mb-4" />
                  <Skeleton className="h-8 w-full mb-2" />
                  <Skeleton className="h-4 w-32 mb-4" />
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredMemos.length === 0 ? (
          <Card className="border-none shadow-sm">
            <CardContent className="p-12 text-center">
              <Search className="w-12 h-12 text-[#6B7280] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#2A2F36] mb-2">No memos found</h3>
              <p className="text-[#6B7280] mb-6">Try adjusting your search or filters</p>
              <Button onClick={resetFilters} variant="outline">
                Clear all filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMemos.map((memo) => (
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
                    
                    <h3 className="text-xl font-bold text-[#0B1F3B] mb-2 group-hover:text-[#0EA5E9] transition-colors line-clamp-2">
                      {memo.title}
                    </h3>
                    
                    <p className="text-[#6B7280] text-sm mb-4 font-medium">{memo.company}</p>
                    
                    <p className="text-[#6B7280] text-sm leading-relaxed mb-4 line-clamp-3">
                      {memo.thesis_one_liner}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {memo.tags?.slice(0, 3).map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center text-[#0EA5E9] text-sm font-medium group-hover:gap-2 transition-all">
                      Read analysis
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

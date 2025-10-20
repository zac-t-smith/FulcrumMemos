import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { FileText, User, Mail, Lock, BookOpen, Home } from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  const navItems = [
    { name: "Home", path: createPageUrl("Home"), icon: Home },
    { name: "Resume", path: createPageUrl("Resume"), icon: User },
    { name: "Memos", path: createPageUrl("Memos"), icon: FileText },
    { name: "About", path: createPageUrl("About"), icon: BookOpen },
    { name: "Contact", path: createPageUrl("Contact"), icon: Mail },
    { name: "Private", path: createPageUrl("Private"), icon: Lock },
  ];

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        :root {
          --navy: #0B1F3B;
          --slate: #2A2F36;
          --steel: #6B7280;
          --accent: #0EA5E9;
          --success: #0E9F6E;
          --light-gray: #F3F4F6;
        }
      `}</style>

      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to={createPageUrl("Home")} className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0B1F3B] to-[#0EA5E9] flex items-center justify-center">
                <span className="text-white font-bold text-lg">ZS</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-[#0B1F3B]">Zac Smith</h1>
                <p className="text-xs text-[#6B7280]">RX & Credit Investing</p>
              </div>
            </Link>

            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                      isActive
                        ? "bg-[#0B1F3B] text-white"
                        : "text-[#6B7280] hover:text-[#0B1F3B] hover:bg-[#F3F4F6]"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile menu */}
            <div className="md:hidden flex space-x-2">
              {navItems.slice(0, 3).map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`p-2 rounded-lg ${
                      isActive
                        ? "bg-[#0B1F3B] text-white"
                        : "text-[#6B7280] hover:bg-[#F3F4F6]"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="min-h-screen">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-[#0B1F3B] font-bold mb-2">Zac Smith</h3>
              <p className="text-[#6B7280] text-sm">
                Restructuring & Credit Investing
              </p>
            </div>
            <div>
              <h4 className="text-[#2A2F36] font-semibold mb-2 text-sm">Navigation</h4>
              <div className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="block text-[#6B7280] hover:text-[#0EA5E9] text-sm transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-[#2A2F36] font-semibold mb-2 text-sm">Disclaimer</h4>
              <p className="text-[#6B7280] text-xs leading-relaxed">
                All analyses and opinions expressed are for educational purposes only 
                and do not constitute investment advice. Past performance does not guarantee future results.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-[#6B7280] text-sm">
              © {new Date().getFullYear()} Zac Smith. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

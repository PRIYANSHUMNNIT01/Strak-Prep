import React from "react";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import {
  Trophy,
  Flame,
  CheckCircle2,
  ArrowRight,
  FileCode2,
  Code2,
  Calendar,
  ExternalLink,
  Github,
  Layers,
  Database,
  ShieldCheck,
  TrendingUp,
  Cpu
} from "lucide-react";

function Landing() {
  const platforms = [
    { name: "LeetCode", color: "from-amber-500/20 to-amber-500/5", border: "border-amber-500/30", text: "text-amber-400", meta: "Knight (1967)", url: "https://leetcode.com/u/PriyanshuKumar425" },
    { name: "Codeforces", color: "from-blue-500/20 to-blue-500/5", border: "border-blue-500/30", text: "text-blue-400", meta: "Specialist (1539)", url: "https://codeforces.com/profile/Happy_noob0" },
    { name: "CodeChef", color: "from-orange-500/20 to-orange-500/5", border: "border-orange-500/30", text: "text-orange-400", meta: "3-Star (1784)", url: "https://www.codechef.com/users/Priyanshu4425" },
    { name: "AtCoder", color: "from-emerald-500/20 to-emerald-500/5", border: "border-emerald-500/30", text: "text-emerald-400", meta: "4-Kyu (1276)", url: "https://atcoder.jp/users/Priyanshunoob" },
    { name: "GitHub", color: "from-slate-700/30 to-slate-800/10", border: "border-slate-700", text: "text-white", meta: "Open Source", url: "https://github.com/PRIYANSHUMNNIT01" },
  ];

  const features = [
    {
      icon: Layers,
      title: "Multi-Platform Profile Aggregator",
      description: "View ratings, rank titles, and solved problem counts across LeetCode, Codeforces, CodeChef, and AtCoder from a single dashboard.",
      badge: "Unified Stats"
    },
    {
      icon: Trophy,
      title: "1,000+ Live Contest Tracking",
      description: "Automated real-time contest calendar with synchronized countdowns, divisions, and direct links for Codeforces, LeetCode, CodeChef, and AtCoder.",
      badge: "Live Sync"
    },
    {
      icon: TrendingUp,
      title: "Rating Graphs & Activity Heatmaps",
      description: "Interactive contest rating progression charts over time alongside 24-week submission frequency heatmaps and streak metrics.",
      badge: "Analytics"
    },
    {
      icon: FileCode2,
      title: "Curated DSA Problem Sheets",
      description: "Structured practice trackers for Striver's SDE Sheet and NeetCode 150 with topic-wise progress and local persistence.",
      badge: "Practice"
    },
    {
      icon: Database,
      title: "Scalable Full-Stack Architecture",
      description: "Built with React (Vite), Tailwind CSS, Node.js, Express.js, MongoDB, JWT HTTP-only auth, and Cloudinary media uploads.",
      badge: "Tech Stack"
    },
    {
      icon: ShieldCheck,
      title: "Handle Verification & Search",
      description: "Direct API lookups for any Codeforces or GitHub handle. Switch profiles and inspect public competitive programming records instantly.",
      badge: "Handle Search"
    }
  ];

  const techStack = [
    "React 18 (Vite)",
    "Tailwind CSS v4",
    "Node.js",
    "Express.js",
    "MongoDB",
    "JWT Auth",
    "Cloudinary",
    "Recharts"
  ];

  return (
    <div className="min-h-screen bg-[#080B11] text-slate-100 selection:bg-purple-500 selection:text-white">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 border-b border-slate-800/80 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:32px_32px]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 shadow-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Competitive Programming & Contest Tracker</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight max-w-4xl mx-auto leading-tight">
            Track Your Coding Profiles & Contests in{" "}
            <span className="text-purple-400">One Place</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            A full-stack platform showing your LeetCode, Codeforces, CodeChef, and AtCoder statistics alongside upcoming contest schedules and curated DSA sheets.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/25 transition-all"
            >
              <span>View Demo Profile</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/contest-tracker"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm bg-[#0D121F] hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 transition-all"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Upcoming Contests</span>
            </Link>

            <Link
              to="/sheets"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm bg-[#0D121F] hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 transition-all"
            >
              <FileCode2 className="w-4 h-4 text-emerald-400" />
              <span>DSA Sheets</span>
            </Link>

            <a
              href="https://github.com/PRIYANSHUMNNIT01/Strak-Prep"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm bg-[#0D121F] hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 transition-all"
            >
              <Github className="w-4 h-4 text-slate-300" />
              <span>GitHub</span>
            </a>
          </div>

          {/* Platform Strip */}
          <div className="mt-12 pt-8 border-t border-slate-800/80">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Supported Platforms & Live Profiles (Click to Inspect)
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {platforms.map((p) => (
                <a
                  key={p.name}
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`px-3.5 py-2 rounded-xl bg-[#0D121F] hover:bg-slate-800 border ${p.border} ${p.text} text-xs font-bold shadow-sm flex items-center gap-2 transition-all hover:-translate-y-0.5`}
                  title={`Open ${p.name} Profile`}
                >
                  <span>{p.name}</span>
                  <span className="text-[10px] text-slate-400 font-normal">({p.meta})</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              ))}
            </div>
          </div>

          {/* Interactive Profile Showcase (Priyanshu Kumar's Real Profile) */}
          <div className="mt-14 max-w-4xl mx-auto rounded-2xl bg-[#0D121F] border border-slate-800 p-6 sm:p-8 shadow-2xl text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center font-bold text-purple-300">
                  <Code2 className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>Priyanshu Kumar</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Verified
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">@PriyanshuKumar425 • MNNIT Allahabad • Full-Stack Developer</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-[#090D16] px-4 py-2 rounded-xl border border-slate-800 text-xs">
                  <span className="text-slate-400">Total Solved: </span>
                  <strong className="text-emerald-400 text-sm font-black">1,651+</strong>
                  <span className="text-[10px] text-slate-400 ml-1.5">Across 4 Platforms</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 text-xs">
              <a
                href="https://leetcode.com/u/PriyanshuKumar425"
                target="_blank"
                rel="noreferrer"
                className="bg-[#090D16] hover:bg-slate-900 p-3.5 rounded-xl border border-slate-800 block transition-all"
              >
                <span className="text-slate-400 block mb-1">LeetCode</span>
                <span className="text-base font-bold text-white">Knight (1967)</span>
                <span className="text-[11px] text-amber-400 block mt-0.5">1,362 Solved • Top 3.16%</span>
              </a>
              <a
                href="https://codeforces.com/profile/Happy_noob0"
                target="_blank"
                rel="noreferrer"
                className="bg-[#090D16] hover:bg-slate-900 p-3.5 rounded-xl border border-slate-800 block transition-all"
              >
                <span className="text-slate-400 block mb-1">Codeforces</span>
                <span className="text-base font-bold text-white">Specialist (1539)</span>
                <span className="text-[11px] text-blue-400 block mt-0.5">160 Solved • 18 Contests</span>
              </a>
              <a
                href="https://www.codechef.com/users/Priyanshu4425"
                target="_blank"
                rel="noreferrer"
                className="bg-[#090D16] hover:bg-slate-900 p-3.5 rounded-xl border border-slate-800 block transition-all"
              >
                <span className="text-slate-400 block mb-1">CodeChef</span>
                <span className="text-base font-bold text-white">3-Star (1784)</span>
                <span className="text-[11px] text-orange-400 block mt-0.5">70 Solved • 16 Contests</span>
              </a>
              <a
                href="https://atcoder.jp/users/Priyanshunoob"
                target="_blank"
                rel="noreferrer"
                className="bg-[#090D16] hover:bg-slate-900 p-3.5 rounded-xl border border-slate-800 block transition-all"
              >
                <span className="text-slate-400 block mb-1">AtCoder</span>
                <span className="text-base font-bold text-white">4-Kyu (1276)</span>
                <span className="text-[11px] text-emerald-400 block mt-0.5">59 Solved • 9 Matches</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-[#080B11]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
              Platform Features
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
              Built for Competitive Programmers
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-2">
              Everything required to keep track of contest schedules, ratings, problem statistics, and DSA interview sheets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="bg-[#0D121F] border border-slate-800 rounded-2xl p-6 shadow-md hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-purple-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                      {f.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tech Stack Banner */}
      <section className="py-12 border-t border-slate-800/80 bg-[#090D16]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Tech Stack & Implementation
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 rounded-lg bg-[#0D121F] border border-slate-800 text-xs font-medium text-slate-300"
              >
                {tech}
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-4 max-w-xl mx-auto">
            React (Vite) frontend with Tailwind CSS, Node.js + Express REST API, MongoDB database, Cloudinary media storage, and JWT-based authentication.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-800 bg-[#080B11] text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 StarkPrep • Built by Priyanshu Kumar (MNNIT Allahabad)</p>
          <div className="flex items-center gap-5 text-slate-400">
            <Link to="/profile" className="hover:text-white transition-colors">Dashboard</Link>
            <Link to="/contest-tracker" className="hover:text-white transition-colors">Contests</Link>
            <Link to="/sheets" className="hover:text-white transition-colors">DSA Sheets</Link>
            <Link to="/verify-handles" className="hover:text-white transition-colors">Verify Handles</Link>
            <a
              href="https://github.com/PRIYANSHUMNNIT01/Strak-Prep"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;

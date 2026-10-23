import React from "react";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import {
  Trophy,
  Flame,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  FileCode2,
  ShieldCheck,
  Zap,
  Globe,
  Code2,
  Calendar,
  ExternalLink,
  Github
} from "lucide-react";

function Landing() {
  const platforms = [
    { name: "LeetCode", color: "from-amber-500/20 to-amber-500/5", border: "border-amber-500/30", text: "text-amber-400" },
    { name: "Codeforces", color: "from-blue-500/20 to-blue-500/5", border: "border-blue-500/30", text: "text-blue-400" },
    { name: "GitHub", color: "from-slate-700/30 to-slate-800/10", border: "border-slate-700", text: "text-white" },
    { name: "CodeChef", color: "from-orange-500/20 to-orange-500/5", border: "border-orange-500/30", text: "text-orange-400" },
    { name: "AtCoder", color: "from-emerald-500/20 to-emerald-500/5", border: "border-emerald-500/30", text: "text-emerald-400" },
    { name: "GeeksforGeeks", color: "from-green-500/20 to-green-500/5", border: "border-green-500/30", text: "text-green-400" },
  ];

  const features = [
    {
      icon: Globe,
      title: "Unified Multi-Platform Hub",
      description: "Seamlessly view different coding profiles (LeetCode, Codeforces, CodeChef, GitHub) from one place. Switch handles and explore anyone's stats in real-time.",
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20"
    },
    {
      icon: Trophy,
      title: "Contest Rating & Activity Graphs",
      description: "Interactive rating progression charts across contests alongside 24-week submission heatmaps, current streaks, and historic milestones.",
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20"
    },
    {
      icon: FileCode2,
      title: "Total Coding Questions Aggregator",
      description: "Track your grand total of solved DSA problems across platforms with instant breakdown by difficulty (Easy, Medium, Hard).",
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
    },
    {
      icon: ShieldCheck,
      title: "Live Contest Radar & DSA Sheets",
      description: "Real-time contest countdowns synced with LeetCode, Codeforces & CodeChef plus curated Striver SDE and NeetCode 150 practice sheets.",
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20"
    }
  ];

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 selection:bg-purple-500 selection:text-white">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-purple-600/15 via-indigo-600/15 to-pink-600/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-purple-300 shadow-xl mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>The All-in-One Coding Portfolio & CP Tracker</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight max-w-4xl mx-auto leading-[1.1]">
            One Unified Profile for{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
              All Your Coding Stats
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Consolidate your LeetCode, Codeforces, CodeChef, and GitHub accomplishments into a sleek, unified developer portfolio with total problems solved, contest rating graphs, and submission heatmaps.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-xl shadow-purple-600/25 hover:shadow-purple-600/40 hover:-translate-y-0.5 transition-all"
            >
              <span>Explore Live Portfolio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/contest-tracker"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 hover:-translate-y-0.5 transition-all shadow-lg"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Contest Calendar</span>
            </Link>

            <Link
              to="/sheets"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 hover:-translate-y-0.5 transition-all shadow-lg"
            >
              <FileCode2 className="w-4 h-4 text-indigo-400" />
              <span>DSA Sheets</span>
            </Link>
          </div>

          {/* Platform Strip */}
          <div className="mt-14 pt-8 border-t border-slate-800/80">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
              Integrated With World-Class Coding Platforms
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {platforms.map((p) => (
                <div
                  key={p.name}
                  className={`px-4 py-2 rounded-xl bg-gradient-to-b ${p.color} border ${p.border} ${p.text} text-xs font-bold shadow-sm backdrop-blur-sm`}
                >
                  {p.name}
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Hero Preview Card (Codolio Showcase) */}
          <div className="mt-16 max-w-4xl mx-auto rounded-3xl bg-gradient-to-b from-slate-900 to-[#0B0F19] border border-slate-800 p-6 sm:p-8 shadow-2xl text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center font-bold text-purple-300">
                  <Code2 className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>Live Developer Card</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Active Sync
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">Priyanshu Kumar • @priyanshu_dev • MNNIT Allahabad</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 text-xs">
                  <span className="text-slate-400">Total Solved: </span>
                  <strong className="text-emerald-400 text-sm">1,128+</strong>
                  <span className="text-[10px] text-purple-400 ml-1.5 font-bold">Across Platforms</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 text-xs">
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">LeetCode Solved</span>
                <span className="text-lg font-extrabold text-white">642 Problems</span>
                <span className="text-[10px] text-amber-400 block mt-0.5">Top 5.4% (Knight)</span>
              </div>
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Codeforces Rating</span>
                <span className="text-lg font-extrabold text-white">1542 Rating</span>
                <span className="text-[10px] text-cyan-400 block mt-0.5">Specialist (Max 1620)</span>
              </div>
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Total Contests</span>
                <span className="text-lg font-extrabold text-white">80+ Contests</span>
                <span className="text-[10px] text-purple-400 block mt-0.5">LeetCode & CF</span>
              </div>
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Streak</span>
                <span className="text-lg font-extrabold text-amber-400">🔥 42 Days</span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">Consistent</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-20 bg-[#0B0F19] border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Everything You Need to Track Your Coding Career
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-3">
              Designed specifically for competitive programmers, college students, and engineers preparing for top-tier software engineering roles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="bg-[#0F172A] border border-slate-800/80 hover:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-xl transition-all hover:-translate-y-1"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border mb-5 ${f.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-slate-800/80 bg-[#090D16] text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 StarkPrep • Built with Codolio Architecture</p>
          <div className="flex items-center gap-6 text-slate-400">
            <Link to="/profile" className="hover:text-white transition-colors">Portfolio</Link>
            <Link to="/contest-tracker" className="hover:text-white transition-colors">Contests</Link>
            <Link to="/sheets" className="hover:text-white transition-colors">DSA Sheets</Link>
            <Link to="/verify-handles" className="hover:text-white transition-colors">Verify Handles</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;

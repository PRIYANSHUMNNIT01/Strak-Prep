import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { DSA_SHEETS, getSolvedQuestions, toggleSolvedQuestion } from "../services/sheetData";
import {
  FileCode2,
  CheckCircle2,
  Circle,
  ExternalLink,
  Search,
  Filter,
  Sparkles,
  Award,
  BookOpen,
  ArrowRight,
  TrendingUp
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

function Sheets() {
  const [selectedSheetId, setSelectedSheetId] = useState("striver-sde");
  const [solvedIds, setSolvedIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("ALL");

  useEffect(() => {
    setSolvedIds(getSolvedQuestions());
  }, []);

  const currentSheet = DSA_SHEETS.find((s) => s.id === selectedSheetId) || DSA_SHEETS[0];

  const handleToggle = (id, title) => {
    const updated = toggleSolvedQuestion(id);
    setSolvedIds(updated);
    if (updated.includes(id)) {
      toast.success(`Marked "${title}" as solved! 🎉`);
    } else {
      toast("Removed from solved list", { icon: "↩️" });
    }
  };

  // Calculate totals
  const allQuestions = currentSheet.topics.flatMap((t) => t.questions);
  const totalInSheet = allQuestions.length;
  const solvedInSheet = allQuestions.filter((q) => solvedIds.includes(q.id)).length;
  const progressPercent = Math.round((solvedInSheet / totalInSheet) * 100) || 0;

  // Filtered topics
  const filteredTopics = currentSheet.topics.map((topic) => {
    const questions = topic.questions.filter((q) => {
      const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDiff = difficultyFilter === "ALL" || q.difficulty.toUpperCase() === difficultyFilter;
      return matchesSearch && matchesDiff;
    });
    return { ...topic, questions };
  }).filter((topic) => topic.questions.length > 0);

  const getDifficultyColor = (diff) => {
    switch (diff.toLowerCase()) {
      case "easy":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "medium":
        return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "hard":
        return "text-rose-400 bg-rose-500/10 border-rose-500/20";
      default:
        return "text-slate-400 bg-slate-800 border-slate-700";
    }
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 pb-16">
      <Toaster position="top-right" />
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header Hero */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-400 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Question Tracker</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              DSA Sheets & Problem Tracker
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-1.5 max-w-2xl">
              Follow industry-standard interview preparation roadmaps. Check off problems as you solve them and keep track of your topic-wise mastery.
            </p>
          </div>

          {/* Progress Card */}
          <div className="bg-[#0F172A] p-5 rounded-2xl border border-slate-800 shadow-xl min-w-[280px]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sheet Progress</span>
              <span className="text-xs font-bold text-purple-400">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden mb-3">
              <div
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400 font-medium">Solved:</span>
              <span className="font-bold text-white">
                {solvedInSheet} <span className="text-slate-500">/ {totalInSheet} questions</span>
              </span>
            </div>
          </div>
        </div>

        {/* Sheet Switcher & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8 mb-6">
          {/* Sheet Tabs */}
          <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
            {DSA_SHEETS.map((sheet) => (
              <button
                key={sheet.id}
                onClick={() => setSelectedSheetId(sheet.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  selectedSheetId === sheet.id
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>{sheet.name}</span>
              </button>
            ))}
          </div>

          {/* Search & Difficulty Filter */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search problem name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="ALL">All Difficulties</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>
        </div>

        {/* Topics & Questions */}
        <div className="space-y-6">
          {filteredTopics.map((topicGroup, idx) => {
            const topicSolved = topicGroup.questions.filter((q) => solvedIds.includes(q.id)).length;
            const topicTotal = topicGroup.questions.length;

            return (
              <div
                key={topicGroup.topic}
                className="bg-[#0F172A]/70 border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg backdrop-blur-sm"
              >
                {/* Topic Header */}
                <div className="px-5 py-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 font-bold text-xs flex items-center justify-center border border-purple-500/20">
                      {idx + 1}
                    </span>
                    <h3 className="text-base font-bold text-white">{topicGroup.topic}</h3>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300">
                    {topicSolved} / {topicTotal} Done
                  </span>
                </div>

                {/* Question List */}
                <div className="divide-y divide-slate-800/60">
                  {topicGroup.questions.map((q) => {
                    const isSolved = solvedIds.includes(q.id);

                    return (
                      <div
                        key={q.id}
                        className={`px-5 py-3.5 flex items-center justify-between gap-4 transition-colors ${
                          isSolved ? "bg-emerald-950/10 hover:bg-emerald-950/20" : "hover:bg-slate-800/40"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <button
                            onClick={() => handleToggle(q.id, q.title)}
                            className="text-slate-400 hover:text-emerald-400 transition-colors focus:outline-none flex-shrink-0"
                          >
                            {isSolved ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-600 hover:text-slate-400" />
                            )}
                          </button>

                          <span
                            className={`text-sm font-medium truncate ${
                              isSolved ? "line-through text-slate-400" : "text-white"
                            }`}
                          >
                            {q.title}
                          </span>

                          <span
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${getDifficultyColor(
                              q.difficulty
                            )}`}
                          >
                            {q.difficulty}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="text-xs text-slate-500 hidden sm:inline">{q.platform}</span>
                          <a
                            href={q.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-purple-300 hover:bg-purple-600 hover:text-white transition-all shadow-sm"
                          >
                            <span>Solve</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {filteredTopics.length === 0 && (
            <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
              <FileCode2 className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No problems found matching "{searchQuery}".</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Sheets;

import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { fetchContests } from "../services/api";
import {
  Trophy,
  Calendar,
  Clock,
  ExternalLink,
  Flame,
  Search,
  Filter,
  CheckCircle2,
  CalendarPlus,
  Radio
} from "lucide-react";

function ContestTracker() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePlatform, setActivePlatform] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Clock tick every second for real-time countdown
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadContests = async () => {
      try {
        const data = await fetchContests();
        setContests(data || []);
      } catch (err) {
        console.error("Error fetching contests:", err);
      } finally {
        setLoading(false);
      }
    };
    loadContests();
  }, []);

  const formatCountdown = (startEpoch) => {
    if (!startEpoch) return "Scheduled";
    const diff = startEpoch - currentTime;
    if (diff <= 0) return "🔴 LIVE NOW";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    }
    return `${hours.toString().padStart(2, "0")}h : ${minutes.toString().padStart(2, "0")}m : ${seconds.toString().padStart(2, "0")}s`;
  };

  const getCalendarLink = (contest) => {
    const title = encodeURIComponent(contest.name);
    const details = encodeURIComponent(`Platform: ${contest.platformName || contest.platform}\nContest URL: ${contest.url}`);
    const startIso = contest.startEpoch ? new Date(contest.startEpoch).toISOString().replace(/-|:|\.\d\d\d/g, "") : "";
    const endIso = contest.startEpoch
      ? new Date(contest.startEpoch + 2 * 3600000).toISOString().replace(/-|:|\.\d\d\d/g, "")
      : "";
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${startIso}/${endIso}`;
  };

  const getPlatformBadge = (platform) => {
    const p = (platform || "").toLowerCase();
    if (p.includes("codeforces")) {
      return {
        name: "Codeforces",
        bg: "bg-blue-500/10 border-blue-500/30 text-blue-400",
        pill: "bg-blue-500"
      };
    }
    if (p.includes("leetcode")) {
      return {
        name: "LeetCode",
        bg: "bg-amber-500/10 border-amber-500/30 text-amber-400",
        pill: "bg-amber-500"
      };
    }
    if (p.includes("codechef")) {
      return {
        name: "CodeChef",
        bg: "bg-orange-500/10 border-orange-500/30 text-orange-400",
        pill: "bg-orange-500"
      };
    }
    if (p.includes("atcoder")) {
      return {
        name: "AtCoder",
        bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
        pill: "bg-emerald-500"
      };
    }
    return {
      name: platform || "Contest",
      bg: "bg-purple-500/10 border-purple-500/30 text-purple-400",
      pill: "bg-purple-500"
    };
  };

  const platforms = [
    { id: "ALL", label: "All Contests" },
    { id: "leetcode", label: "LeetCode" },
    { id: "codeforces", label: "Codeforces" },
    { id: "codechef", label: "CodeChef" },
    { id: "atcoder", label: "AtCoder" },
  ];

  const filteredContests = contests.filter((c) => {
    const matchPlatform =
      activePlatform === "ALL" || (c.platform || "").toLowerCase().includes(activePlatform.toLowerCase());
    const matchQuery = (c.name || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchPlatform && matchQuery;
  });

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 pb-16">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header Hero */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 mb-3">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Live Synced Calendar</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Coding Contests & Event Tracker
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-1.5 max-w-2xl">
              Never miss a competitive programming contest again. Live schedules across LeetCode, Codeforces, CodeChef, and AtCoder with real-time countdown timers.
            </p>
          </div>

          {/* Quick Counter */}
          <div className="flex items-center gap-3">
            <div className="bg-[#0F172A] px-5 py-3.5 rounded-2xl border border-slate-800 shadow-xl flex items-center gap-3">
              <Trophy className="w-6 h-6 text-amber-400" />
              <div>
                <p className="text-xs text-slate-400 font-medium">Upcoming Contests</p>
                <p className="text-xl font-bold text-white">{contests.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8 mb-8">
          {/* Platform Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
            {platforms.map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePlatform(p.id)}
                className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  activePlatform === p.id
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search contest round..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
        </div>

        {/* Contest Cards Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400 text-sm">Fetching live contests from Codeforces & LeetCode...</p>
          </div>
        ) : filteredContests.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 rounded-2xl border border-slate-800">
            <Trophy className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-base font-medium">No upcoming contests found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContests.map((contest, idx) => {
              const badge = getPlatformBadge(contest.platform || contest.platformName);
              const countdown = formatCountdown(contest.startEpoch);
              const isLive = countdown.includes("LIVE");

              return (
                <div
                  key={contest.id || idx}
                  className="bg-[#0F172A] border border-slate-800/90 hover:border-slate-700/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all hover:-translate-y-1 group"
                >
                  <div>
                    {/* Top Row: Platform & Live Countdown */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${badge.bg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.pill}`}></span>
                        {badge.name}
                      </span>

                      <div
                        className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${
                          isLive
                            ? "bg-rose-500/20 text-rose-400 border-rose-500/30 animate-pulse"
                            : "bg-slate-800/90 text-purple-300 border-slate-700"
                        }`}
                      >
                        {countdown}
                      </div>
                    </div>

                    {/* Contest Name */}
                    <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2 mb-3">
                      {contest.name}
                    </h3>

                    {/* Date & Duration Info */}
                    <div className="space-y-1.5 text-xs text-slate-400 mb-5">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>Start: <strong className="text-slate-300">{contest.startTime}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>Duration: <strong className="text-slate-300">{contest.duration}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80">
                    <a
                      href={contest.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors shadow-md shadow-purple-600/20"
                    >
                      <span>Participate</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <a
                      href={getCalendarLink(contest)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Add to Google Calendar"
                    >
                      <CalendarPlus className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default ContestTracker;

import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import {
  fetchCurrentUser,
  refreshCodeforcesStats,
  refreshLeetcodeStats,
  fetchLiveCodeforcesUser,
  fetchLiveGithubUser,
  saveStoredProfile,
  DEFAULT_DEMO_USER
} from "../services/api";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  Trophy,
  Flame,
  CheckCircle2,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  Calendar,
  Code2,
  Share2,
  Sparkles,
  TrendingUp,
  Award,
  RefreshCw,
  Search,
  BookOpen
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";

function Profile() {
  const [userData, setUserData] = useState(DEFAULT_DEMO_USER);
  const [loading, setLoading] = useState(false);
  const [customHandle, setCustomHandle] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await fetchCurrentUser();
        if (user) setUserData(user);
      } catch (e) {
        console.error("Error loading user:", e);
      }
    };
    loadUser();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    const toastId = toast.loading("Syncing real platform stats...");
    try {
      const handle = userData?.profileStats?.codeforces?.handle;
      if (handle) {
        const liveCF = await fetchLiveCodeforcesUser(handle);
        if (liveCF) {
          const updated = {
            ...userData,
            profileStats: {
              ...userData.profileStats,
              codeforces: { ...userData.profileStats.codeforces, ...liveCF }
            }
          };
          setUserData(updated);
          saveStoredProfile(updated);
        }
      }
      toast.success("Profile statistics synced successfully!", { id: toastId });
    } catch (e) {
      toast.error("Failed to sync some platforms.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLookup = async (e) => {
    e.preventDefault();
    if (!customHandle.trim()) return;

    setSearchLoading(true);
    const toastId = toast.loading(`Fetching live data for "${customHandle}"...`);
    try {
      const [liveCF, liveGH] = await Promise.all([
        fetchLiveCodeforcesUser(customHandle.trim()),
        fetchLiveGithubUser(customHandle.trim())
      ]);

      if (!liveCF && !liveGH) {
        toast.error(`No public user found on Codeforces for "${customHandle}".`, { id: toastId });
        return;
      }

      const updated = {
        ...userData,
        fullName: liveGH?.name || liveCF?.handle || customHandle,
        username: customHandle,
        avatar: liveCF?.avatar || liveGH?.avatar || userData.avatar,
        bio: liveGH?.bio || `Competitive programmer & algorithm enthusiast | Rating: ${liveCF?.rating || 1500}`,
        profileStats: {
          ...userData.profileStats,
          codeforces: liveCF ? { ...userData.profileStats.codeforces, ...liveCF } : userData.profileStats.codeforces,
          github: liveGH ? { ...userData.profileStats.github, ...liveGH } : userData.profileStats.github
        }
      };

      setUserData(updated);
      saveStoredProfile(updated);
      toast.success(`Loaded stats for ${customHandle}! 🎉`, { id: toastId });
    } catch (err) {
      toast.error("Error fetching live handle data.", { id: toastId });
    } finally {
      setSearchLoading(false);
      setCustomHandle("");
    }
  };

  const copyShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Portfolio link copied to clipboard! 📋");
  };

  // Helper titles
  const getCodeforcesTitle = (rating) => {
    if (rating < 1200) return { title: "Newbie", color: "text-slate-400 bg-slate-500/10 border-slate-500/20" };
    if (rating < 1400) return { title: "Pupil", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
    if (rating < 1600) return { title: "Specialist", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" };
    if (rating < 1900) return { title: "Expert", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" };
    if (rating < 2100) return { title: "Candidate Master", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" };
    if (rating < 2300) return { title: "Master", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
    if (rating < 2400) return { title: "International Master", color: "text-orange-400 bg-orange-500/10 border-orange-500/20" };
    return { title: "Grandmaster", color: "text-rose-500 bg-rose-500/10 border-rose-500/20" };
  };

  const cfStats = userData?.profileStats?.codeforces || {};
  const lcStats = userData?.profileStats?.leetcode || {};
  const ghStats = userData?.profileStats?.github || {};
  const ccStats = userData?.profileStats?.codechef || {};

  const cfRankBadge = getCodeforcesTitle(cfStats.rating || 0);

  const totalQuestions =
    (lcStats.totalProblemsSolved || 0) +
    (cfStats.problemsSolved || 0) +
    (ccStats.contests ? ccStats.contests * 3 : 0);

  const totalContests = (lcStats.attendedContestsCount || 0) + (cfStats.totalContests || 0) + (ccStats.contests || 0);

  // LeetCode Pie Chart Data
  const pieData = [
    { name: "Easy", value: lcStats?.submissionStats?.easy || 180, color: "#10B981" },
    { name: "Medium", value: lcStats?.submissionStats?.medium || 260, color: "#F59E0B" },
    { name: "Hard", value: lcStats?.submissionStats?.hard || 60, color: "#F43F5E" }
  ];

  // Rating History for Graph
  const ratingData = (cfStats.ratingHistory || []).map((entry) => ({
    name: entry.contestName,
    rating: entry.rating,
    date: new Date(entry.timestamp).toLocaleDateString("en-US", { month: "short", year: "2-digit" })
  }));

  // Activity Heatmap Simulation (last 24 weeks)
  const heatmapWeeks = Array.from({ length: 24 }).map((_, wIdx) =>
    Array.from({ length: 7 }).map((_, dIdx) => {
      const active = (wIdx * 7 + dIdx) % 3 === 0 || (wIdx * 7 + dIdx) % 5 === 0;
      const intensity = active ? ((wIdx + dIdx) % 4) + 1 : 0;
      return intensity;
    })
  );

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 pb-20">
      <Toaster position="top-right" />
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Top Codolio Profile Banner */}
        <div className="relative rounded-3xl bg-gradient-to-b from-[#111827] to-[#0B0F19] border border-slate-800 p-6 sm:p-8 shadow-2xl overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* User Info Left */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative">
                <img
                  src={userData.avatar}
                  alt={userData.fullName}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-purple-500/30 shadow-xl"
                />
                <div
                  className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-emerald-500 text-white shadow-md"
                  title="Verified Developer Profile"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {userData.fullName}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Codolio Verified
                  </span>
                </div>
                <p className="text-slate-400 text-sm mt-0.5">
                  @{userData.username || "priyanshu"} • {userData.collegeName || "Software Engineer"}
                </p>
                <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-xl leading-relaxed">
                  {userData.bio}
                </p>

                {/* Social Badges */}
                <div className="flex items-center gap-3 mt-4 text-slate-400 text-sm">
                  {userData.socialLinks?.github && (
                    <a
                      href={userData.socialLinks.github}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-slate-800 hover:text-white hover:bg-slate-700 transition-colors"
                      title="GitHub"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {userData.socialLinks?.linkedin && (
                    <a
                      href={userData.socialLinks.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-slate-800 hover:text-blue-400 hover:bg-slate-700 transition-colors"
                      title="LinkedIn"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {userData.socialLinks?.twitter && (
                    <a
                      href={userData.socialLinks.twitter}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-slate-800 hover:text-cyan-400 hover:bg-slate-700 transition-colors"
                      title="Twitter"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* C-Score Rating Card Right */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 sm:gap-6 lg:gap-3 bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <Flame className="w-7 h-7 text-white" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Codolio C-Score</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white">{userData.cScore || 842}</span>
                    <span className="text-xs text-slate-400">/ 1000</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {userData.cScoreRank || "Master Coder"}
                </span>
                <span className="text-xs font-semibold text-emerald-400">
                  Top {100 - (userData.cScorePercentile || 96.8)}% globally
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full pt-1">
                <button
                  onClick={copyShareLink}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Card</span>
                </button>
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-md shadow-purple-600/20"
                  title="Sync Real Platform Stats"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Live Handle Switcher Bar */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Explore stats for any handle live (e.g. <strong>tourist</strong>, <strong>neal_wu</strong>, or yours):</span>
            </div>
            <form onSubmit={handleQuickLookup} className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Codeforces handle..."
                  value={customHandle}
                  onChange={(e) => setCustomHandle(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 w-44 sm:w-56"
                />
              </div>
              <button
                type="submit"
                disabled={searchLoading}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold transition-all shadow-sm"
              >
                {searchLoading ? "Loading..." : "Inspect"}
              </button>
            </form>
          </div>
        </div>

        {/* Global Key Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#0F172A] p-5 rounded-2xl border border-slate-800 shadow-lg">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Questions</p>
            <p className="text-3xl font-extrabold text-white mt-1">{totalQuestions}</p>
            <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
              <span className="text-emerald-400 font-bold">{lcStats.submissionStats?.easy || 235}E</span>
              <span>•</span>
              <span className="text-amber-400 font-bold">{lcStats.submissionStats?.medium || 328}M</span>
              <span>•</span>
              <span className="text-rose-400 font-bold">{lcStats.submissionStats?.hard || 79}H</span>
            </div>
          </div>

          <div className="bg-[#0F172A] p-5 rounded-2xl border border-slate-800 shadow-lg">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Contests Attended</p>
            <p className="text-3xl font-extrabold text-white mt-1">{totalContests}</p>
            <p className="text-xs text-purple-400 font-medium mt-2">
              {lcStats.attendedContestsCount || 42} LeetCode • {cfStats.totalContests || 38} CF
            </p>
          </div>

          <div className="bg-[#0F172A] p-5 rounded-2xl border border-slate-800 shadow-lg">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Current Streak</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-3xl font-extrabold text-amber-400">🔥 42</span>
              <span className="text-xs text-slate-400 font-semibold">Days</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">Longest: <strong className="text-white">68 Days</strong></p>
          </div>

          <div className="bg-[#0F172A] p-5 rounded-2xl border border-slate-800 shadow-lg">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Curated Sheets</p>
            <p className="text-3xl font-extrabold text-indigo-400 mt-1">2 Sheets</p>
            <Link to="/sheets" className="text-xs text-purple-400 hover:text-purple-300 font-medium mt-2 inline-flex items-center gap-1">
              <span>View Progress</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Platform Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* LeetCode Card */}
          <div className="bg-[#0F172A] rounded-2xl border border-slate-800 p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-bold text-amber-400">
                    LC
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">LeetCode</h3>
                    <p className="text-xs text-slate-400">@{lcStats.username || "priyanshu_codes"}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Knight (Top {lcStats.topPercentage || 5.4}%)
                </span>
              </div>

              {/* Mini Donut Chart & Breakdown */}
              <div className="flex items-center justify-between gap-4 py-3">
                <div className="w-24 h-24 relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        innerRadius={28}
                        outerRadius={40}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute text-center">
                    <span className="text-xs font-bold text-white">{lcStats.totalProblemsSolved || 642}</span>
                  </div>
                </div>

                <div className="flex-1 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-400 font-semibold">Easy:</span>
                    <strong className="text-white">{lcStats.submissionStats?.easy || 235}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-amber-400 font-semibold">Medium:</span>
                    <strong className="text-white">{lcStats.submissionStats?.medium || 328}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-rose-400 font-semibold">Hard:</span>
                    <strong className="text-white">{lcStats.submissionStats?.hard || 79}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 text-xs flex justify-between items-center">
              <div>
                <span className="text-slate-400">Contest Rating:</span>
                <span className="ml-1.5 font-bold text-white">{lcStats.contestRating || 1892}</span>
              </div>
              <a
                href={`https://leetcode.com/${lcStats.username || "priyanshu_codes"}`}
                target="_blank"
                rel="noreferrer"
                className="text-amber-400 hover:text-amber-300 font-semibold inline-flex items-center gap-1"
              >
                <span>View Profile</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Codeforces Card */}
          <div className="bg-[#0F172A] rounded-2xl border border-slate-800 p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-bold text-blue-400">
                    CF
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Codeforces</h3>
                    <p className="text-xs text-slate-400">@{cfStats.handle || "priyanshu_01"}</p>
                  </div>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${cfRankBadge.color}`}>
                  {cfRankBadge.title}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 py-3 text-xs">
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1">Current Rating</span>
                  <span className="text-xl font-black text-white">{cfStats.rating || 1542}</span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1">Max Rating</span>
                  <span className="text-xl font-black text-purple-400">{cfStats.maxRating || 1620}</span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1">Problems Solved</span>
                  <span className="text-xl font-black text-emerald-400">{cfStats.problemsSolved || 486}</span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1">Total Contests</span>
                  <span className="text-xl font-black text-cyan-400">{cfStats.totalContests || 38}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 text-xs flex justify-between items-center">
              <span className="text-slate-400">Rank: <strong className="text-white capitalize">{cfStats.rank || "specialist"}</strong></span>
              <a
                href={`https://codeforces.com/profile/${cfStats.handle || "priyanshu_01"}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1"
              >
                <span>View Profile</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* GitHub & Dev Activity Card */}
          <div className="bg-[#0F172A] rounded-2xl border border-slate-800 p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white">
                    <Github className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">GitHub</h3>
                    <p className="text-xs text-slate-400">@{ghStats.username || "PRIYANSHUMNNIT01"}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  Dev Activity
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 py-3 text-xs">
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1">Public Repos</span>
                  <span className="text-xl font-black text-white">{ghStats.publicRepos || 24}</span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1">Stars Earned</span>
                  <span className="text-xl font-black text-amber-400">{ghStats.stars || 42}</span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1">Followers</span>
                  <span className="text-xl font-black text-emerald-400">{ghStats.followers || 86}</span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1">Contributions</span>
                  <span className="text-xl font-black text-indigo-400">{ghStats.contributionsLastYear || 418}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 text-xs flex justify-between items-center">
              <span className="text-slate-400">Status: <strong className="text-emerald-400">Active</strong></span>
              <a
                href={`https://github.com/${ghStats.username || "PRIYANSHUMNNIT01"}`}
                target="_blank"
                rel="noreferrer"
                className="text-purple-400 hover:text-purple-300 font-semibold inline-flex items-center gap-1"
              >
                <span>View Repos</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Rating Progression Graph Section */}
        <div className="bg-[#0F172A] rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <span>Contest Rating Progression</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Visualizing rating trajectory across Codeforces and LeetCode contests
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-purple-400">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                Codeforces
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            {ratingData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ratingData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="date" stroke="#64748B" fontSize={12} tickLine={false} />
                  <YAxis domain={["auto", "auto"]} stroke="#64748B" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0F172A",
                      borderColor: "#334155",
                      borderRadius: "12px",
                      color: "#F8FAFC",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)"
                    }}
                    labelStyle={{ fontWeight: "bold", color: "#A855F7" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="rating"
                    stroke="#A855F7"
                    strokeWidth={3}
                    dot={{ fill: "#A855F7", r: 4, strokeWidth: 2, stroke: "#0F172A" }}
                    activeDot={{ r: 6, fill: "#C084FC" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                No rating history available for this handle yet.
              </div>
            )}
          </div>
        </div>

        {/* Activity Heatmap Section (Codolio Style) */}
        <div className="bg-[#0F172A] rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-400" />
                <span>Submissions & Problem Solving Heatmap</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                418 total submissions in the last 6 months
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Less</span>
              <span className="w-3 h-3 rounded bg-slate-800"></span>
              <span className="w-3 h-3 rounded bg-emerald-900/60"></span>
              <span className="w-3 h-3 rounded bg-emerald-700"></span>
              <span className="w-3 h-3 rounded bg-emerald-500"></span>
              <span className="w-3 h-3 rounded bg-emerald-400"></span>
              <span>More</span>
            </div>
          </div>

          <div className="overflow-x-auto pb-2">
            <div className="flex gap-1.5 min-w-[700px]">
              {heatmapWeeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-1.5">
                  {week.map((intensity, dIdx) => {
                    const colors = [
                      "bg-slate-800/80 hover:ring-1 hover:ring-slate-500",
                      "bg-emerald-950/80 hover:ring-1 hover:ring-emerald-600",
                      "bg-emerald-800 hover:ring-1 hover:ring-emerald-500",
                      "bg-emerald-600 hover:ring-1 hover:ring-emerald-400",
                      "bg-emerald-400 hover:ring-1 hover:ring-emerald-300"
                    ];
                    return (
                      <div
                        key={dIdx}
                        className={`w-3.5 h-3.5 rounded-sm transition-all cursor-pointer ${colors[intensity]}`}
                        title={`${intensity > 0 ? intensity * 2 + 1 : 0} problems solved`}
                      ></div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;

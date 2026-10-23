import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import {
  fetchCurrentUser,
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
  Sparkles,
  TrendingUp,
  RefreshCw,
  Search,
  BookOpen,
  User,
  Layers,
  BarChart3
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";

function Profile() {
  const [userData, setUserData] = useState(DEFAULT_DEMO_USER);
  const [loading, setLoading] = useState(false);
  const [searchHandle, setSearchHandle] = useState("");
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
      toast.success("Profile statistics synced!", { id: toastId });
    } catch (e) {
      toast.error("Failed to sync some platforms.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleLookup = async (handleToSearch) => {
    const handle = (handleToSearch || searchHandle).trim();
    if (!handle) return;

    setSearchLoading(true);
    const toastId = toast.loading(`Fetching live profile for "${handle}"...`);
    try {
      const [liveCF, liveGH] = await Promise.all([
        fetchLiveCodeforcesUser(handle),
        fetchLiveGithubUser(handle)
      ]);

      if (!liveCF && !liveGH) {
        toast.error(`No public coder found for "${handle}".`, { id: toastId });
        return;
      }

      const updated = {
        ...userData,
        fullName: liveGH?.name || liveCF?.handle || handle,
        username: handle,
        avatar: liveCF?.avatar || liveGH?.avatar || userData.avatar,
        bio: liveGH?.bio || `Competitive programmer • Rating: ${liveCF?.rating || 1500} • Rank: ${liveCF?.rank || "Coder"}`,
        profileStats: {
          ...userData.profileStats,
          codeforces: liveCF ? { ...userData.profileStats.codeforces, ...liveCF } : userData.profileStats.codeforces,
          github: liveGH ? { ...userData.profileStats.github, ...liveGH } : userData.profileStats.github
        }
      };

      setUserData(updated);
      saveStoredProfile(updated);
      toast.success(`Loaded profile for ${handle}! 🚀`, { id: toastId });
    } catch (err) {
      toast.error("Error fetching live profile.", { id: toastId });
    } finally {
      setSearchLoading(false);
      setSearchHandle("");
    }
  };

  const handleResetToDefault = () => {
    setUserData(DEFAULT_DEMO_USER);
    saveStoredProfile(DEFAULT_DEMO_USER);
    toast.success("Reset to default profile!");
  };

  // Helper title mapping
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

  // Total Coding Questions Calculation
  const lcSolved = lcStats.totalProblemsSolved || 642;
  const cfSolved = cfStats.problemsSolved || 486;
  const ccSolved = (ccStats.contests ? ccStats.contests * 3 : 66);
  const totalQuestions = lcSolved + cfSolved + ccSolved;

  const lcEasy = lcStats.submissionStats?.easy || 235;
  const lcMed = lcStats.submissionStats?.medium || 328;
  const lcHard = lcStats.submissionStats?.hard || 79;

  const totalContests = (lcStats.attendedContestsCount || 42) + (cfStats.totalContests || 38) + (ccStats.contests || 22);

  // Pie chart data for difficulty
  const pieData = [
    { name: "Easy", value: lcEasy, color: "#10B981" },
    { name: "Medium", value: lcMed, color: "#F59E0B" },
    { name: "Hard", value: lcHard, color: "#F43F5E" }
  ];

  // Contest Rating History Data
  const ratingData = (cfStats.ratingHistory || []).map((entry) => ({
    name: entry.contestName,
    rating: entry.rating,
    date: new Date(entry.timestamp).toLocaleDateString("en-US", { month: "short", year: "2-digit" })
  }));

  // Activity Heatmap (24 weeks x 7 days)
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
        {/* Top Profile Viewer & Handle Switcher */}
        <div className="relative rounded-3xl bg-gradient-to-b from-[#111827] to-[#0B0F19] border border-slate-800 p-6 sm:p-8 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

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
                  title="Active Profile"
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
                    Coding Profile
                  </span>
                </div>
                <p className="text-slate-400 text-sm mt-0.5">
                  @{userData.username || "priyanshu"} • {userData.collegeName || "Software Engineer"}
                </p>
                <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-xl leading-relaxed">
                  {userData.bio}
                </p>

                {/* Social Links */}
                <div className="flex items-center gap-2.5 mt-4 text-slate-400 text-sm">
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
                  <button
                    onClick={handleRefresh}
                    disabled={loading}
                    className="ml-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/30 text-xs font-semibold transition-all"
                    title="Sync Live Stats"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                    <span>Sync Live</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Viewer / Switcher Right */}
            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 backdrop-blur-md min-w-[300px]">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                View Different Coding Profiles
              </span>
              <p className="text-xs text-slate-400 mb-3">
                Inspect any coder's live stats across platforms:
              </p>

              {/* Quick Handle Search Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLookup(searchHandle);
                }}
                className="flex items-center gap-2 mb-3"
              >
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Enter Codeforces or GitHub handle..."
                    value={searchHandle}
                    onChange={(e) => setSearchHandle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={searchLoading}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-md transition-all"
                >
                  {searchLoading ? "..." : "View"}
                </button>
              </form>

              {/* Preset buttons */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] text-slate-500 font-semibold mr-1">Presets:</span>
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-purple-300 transition-colors"
                >
                  My Profile
                </button>
                <button
                  type="button"
                  onClick={() => handleLookup("tourist")}
                  className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-300 transition-colors"
                >
                  tourist
                </button>
                <button
                  type="button"
                  onClick={() => handleLookup("Benq")}
                  className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-300 transition-colors"
                >
                  Benq
                </button>
                <button
                  type="button"
                  onClick={() => handleLookup("neal_wu")}
                  className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-300 transition-colors"
                >
                  neal_wu
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 1. TOTAL NUMBER OF CODING QUESTIONS (PROMINENT SECTION) */}
        <div className="bg-[#0F172A] rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-emerald-400" />
                <h2 className="text-xl font-bold text-white tracking-tight">Total Coding Questions Solved</h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Aggregated problem counts across LeetCode, Codeforces, and CodeChef
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                {totalQuestions.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Solved</span>
            </div>
          </div>

          {/* Breakdown by Platform */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider block">LeetCode</span>
                <span className="text-2xl font-black text-white mt-1 block">{lcSolved}</span>
                <span className="text-[11px] text-slate-400">Easy: {lcEasy} • Med: {lcMed} • Hard: {lcHard}</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-bold text-amber-400">
                LC
              </div>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-blue-400 font-semibold uppercase tracking-wider block">Codeforces</span>
                <span className="text-2xl font-black text-white mt-1 block">{cfSolved}</span>
                <span className="text-[11px] text-slate-400">Practice & In-Contest Solved</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-bold text-blue-400">
                CF
              </div>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-orange-400 font-semibold uppercase tracking-wider block">CodeChef</span>
                <span className="text-2xl font-black text-white mt-1 block">{ccSolved}</span>
                <span className="text-[11px] text-slate-400">Stars: {ccStats.stars || "3★"}</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center font-bold text-orange-400">
                CC
              </div>
            </div>
          </div>

          {/* Difficulty Visual Progress Bar */}
          <div>
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="font-semibold text-slate-400">LeetCode Difficulty Ratio</span>
              <div className="flex items-center gap-3">
                <span className="text-emerald-400 font-bold">● Easy ({lcEasy})</span>
                <span className="text-amber-400 font-bold">● Medium ({lcMed})</span>
                <span className="text-rose-400 font-bold">● Hard ({lcHard})</span>
              </div>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-3 flex overflow-hidden p-0.5 border border-slate-800">
              <div
                className="bg-emerald-500 h-full rounded-l-full"
                style={{ width: `${(lcEasy / (lcSolved || 1)) * 100}%` }}
                title={`Easy: ${lcEasy}`}
              ></div>
              <div
                className="bg-amber-500 h-full"
                style={{ width: `${(lcMed / (lcSolved || 1)) * 100}%` }}
                title={`Medium: ${lcMed}`}
              ></div>
              <div
                className="bg-rose-500 h-full rounded-r-full"
                style={{ width: `${(lcHard / (lcSolved || 1)) * 100}%` }}
                title={`Hard: ${lcHard}`}
              ></div>
            </div>
          </div>
        </div>

        {/* 2. GRAPH OF CODING CONTEST */}
        <div className="bg-[#0F172A] rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-bold text-white tracking-tight">Coding Contest Rating Graph</h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Visualizing rating progression across official contest rounds over time
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                <span className="text-slate-400">Current Rating:</span>
                <span className="font-black text-white">{cfStats.rating || 1542}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                <span className="text-slate-400">Peak Rating:</span>
                <span className="font-black text-purple-400">{cfStats.maxRating || 1620}</span>
              </div>
              <span className={`px-2.5 py-1 rounded-lg border font-bold text-xs ${cfRankBadge.color}`}>
                {cfRankBadge.title}
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

        {/* 3. HEATMAP OF ACTIVITY & SUBMISSIONS */}
        <div className="bg-[#0F172A] rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-400" />
                <h2 className="text-xl font-bold text-white tracking-tight">Coding Submissions Heatmap</h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                418 total submissions in the last 24 weeks • Active daily consistency
              </p>
            </div>

            {/* Streak & Consistency Badges */}
            <div className="flex items-center gap-4 text-xs">
              <div className="bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-1.5 font-bold text-amber-400">
                <Flame className="w-4 h-4 fill-amber-400/20" />
                <span>Current Streak: 42 Days</span>
              </div>
              <div className="bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300">
                Longest: <strong className="text-white">68 Days</strong>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                <span>Less</span>
                <span className="w-3 h-3 rounded bg-slate-800"></span>
                <span className="w-3 h-3 rounded bg-emerald-900/60"></span>
                <span className="w-3 h-3 rounded bg-emerald-700"></span>
                <span className="w-3 h-3 rounded bg-emerald-500"></span>
                <span className="w-3 h-3 rounded bg-emerald-400"></span>
                <span>More</span>
              </div>
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

        {/* 4. PLATFORM CARDS GRID (LeetCode, Codeforces, GitHub, CodeChef) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* LeetCode Card */}
          <div className="bg-[#0F172A] rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-bold text-amber-400 text-xs">
                    LC
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">LeetCode</h3>
                    <p className="text-[11px] text-slate-400 truncate">@{lcStats.username || "priyanshu_codes"}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Knight
                </span>
              </div>

              <div className="space-y-2 py-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Total Solved:</span>
                  <strong className="text-white font-bold">{lcSolved}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Contest Rating:</span>
                  <strong className="text-amber-400 font-bold">{lcStats.contestRating || 1892}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Contests Attended:</span>
                  <strong className="text-white">{lcStats.attendedContestsCount || 42}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Top Percentage:</span>
                  <strong className="text-emerald-400">{lcStats.topPercentage || 5.4}%</strong>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 text-xs text-right">
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
          <div className="bg-[#0F172A] rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-bold text-blue-400 text-xs">
                    CF
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Codeforces</h3>
                    <p className="text-[11px] text-slate-400 truncate">@{cfStats.handle || "priyanshu_01"}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${cfRankBadge.color}`}>
                  {cfRankBadge.title}
                </span>
              </div>

              <div className="space-y-2 py-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Current Rating:</span>
                  <strong className="text-blue-400 font-bold">{cfStats.rating || 1542}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Max Rating:</span>
                  <strong className="text-purple-400 font-bold">{cfStats.maxRating || 1620}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Problems Solved:</span>
                  <strong className="text-white">{cfSolved}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Contests:</span>
                  <strong className="text-cyan-400">{cfStats.totalContests || 38}</strong>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 text-xs text-right">
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

          {/* GitHub Card */}
          <div className="bg-[#0F172A] rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-xs">
                    <Github className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">GitHub</h3>
                    <p className="text-[11px] text-slate-400 truncate">@{ghStats.username || "PRIYANSHUMNNIT01"}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  Open Source
                </span>
              </div>

              <div className="space-y-2 py-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Public Repos:</span>
                  <strong className="text-white font-bold">{ghStats.publicRepos || 24}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Stars Earned:</span>
                  <strong className="text-amber-400 font-bold">{ghStats.stars || 42}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Followers:</span>
                  <strong className="text-emerald-400">{ghStats.followers || 86}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Contributions:</span>
                  <strong className="text-indigo-400">{ghStats.contributionsLastYear || 418}</strong>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 text-xs text-right">
              <a
                href={`https://github.com/${ghStats.username || "PRIYANSHUMNNIT01"}`}
                target="_blank"
                rel="noreferrer"
                className="text-purple-400 hover:text-purple-300 font-semibold inline-flex items-center gap-1"
              >
                <span>View GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* CodeChef Card */}
          <div className="bg-[#0F172A] rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center font-bold text-orange-400 text-xs">
                    CC
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">CodeChef</h3>
                    <p className="text-[11px] text-slate-400 truncate">@{ccStats.handle || "priyanshu_mnnit"}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  {ccStats.stars || "3★"}
                </span>
              </div>

              <div className="space-y-2 py-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Contest Rating:</span>
                  <strong className="text-orange-400 font-bold">{ccStats.rating || 1765}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Stars Level:</span>
                  <strong className="text-amber-400 font-bold">{ccStats.stars || "3★"}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Global Rank:</span>
                  <strong className="text-white">{ccStats.globalRank || 5210}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Contests:</span>
                  <strong className="text-cyan-400">{ccStats.contests || 22}</strong>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 text-xs text-right">
              <a
                href="https://www.codechef.com"
                target="_blank"
                rel="noreferrer"
                className="text-orange-400 hover:text-orange-300 font-semibold inline-flex items-center gap-1"
              >
                <span>View Profile</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;

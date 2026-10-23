import React, { useState, useEffect } from "react";
import { fetchCurrentUser, updateProfile, getStoredProfile, saveStoredProfile } from "../services/api";
import Header from "../components/Header";
import toast, { Toaster } from "react-hot-toast";
import { User, Building2, FileText, Image, ArrowLeft, Check, Sparkles, Github, Linkedin, Twitter } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

function EditProfile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    bio: "",
    collegeName: "",
    github: "",
    linkedin: "",
    twitter: "",
    avatar: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = getStoredProfile();
    setForm({
      fullName: user.fullName || "",
      bio: user.bio || "",
      collegeName: user.collegeName || "",
      github: user.socialLinks?.github || "",
      linkedin: user.socialLinks?.linkedin || "",
      twitter: user.socialLinks?.twitter || "",
      avatar: user.avatar || ""
    });
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const current = getStoredProfile();
    const updated = {
      ...current,
      fullName: form.fullName,
      bio: form.bio,
      collegeName: form.collegeName,
      avatar: form.avatar || current.avatar,
      socialLinks: {
        github: form.github,
        linkedin: form.linkedin,
        twitter: form.twitter
      }
    };

    saveStoredProfile(updated);
    toast.success("Profile updated successfully! ✨");
    setTimeout(() => navigate("/profile"), 700);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-white pb-16">
      <Toaster position="top-right" />
      <Header />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
          <div>
            <Link
              to="/profile"
              className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-semibold mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Portfolio</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Edit Developer Profile</h1>
          </div>
        </div>

        <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">College / Organization</label>
              <div className="relative">
                <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  name="collegeName"
                  value={form.collegeName}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Professional Bio</label>
              <div className="relative">
                <textarea
                  name="bio"
                  rows={3}
                  value={form.bio}
                  onChange={handleChange}
                  placeholder="Tell recruiters and peers about your skills, focus areas, and achievements..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                ></textarea>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Avatar Image URL</label>
              <div className="relative">
                <Image className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="url"
                  name="avatar"
                  value={form.avatar}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Social Profile Links
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="relative">
                  <Github className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="url"
                    name="github"
                    value={form.github}
                    onChange={handleChange}
                    placeholder="GitHub URL"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="relative">
                  <Linkedin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="url"
                    name="linkedin"
                    value={form.linkedin}
                    onChange={handleChange}
                    placeholder="LinkedIn URL"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="relative">
                  <Twitter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="url"
                    name="twitter"
                    value={form.twitter}
                    onChange={handleChange}
                    placeholder="Twitter URL"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="flex-1 py-3 px-4 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/25 transition-all"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default EditProfile;

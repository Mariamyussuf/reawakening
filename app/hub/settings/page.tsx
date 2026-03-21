"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ToggleMap = Record<string, boolean>;

interface UserData {
    name: string;
    email: string;
    phone?: string;
    campus?: string;
    bio?: string;
    notifications?: ToggleMap;
    privacy?: ToggleMap;
}

const defaultNotifications = {
    dailyVerse: true,
    eventReminders: true,
    prayerRequests: false,
    weeklyDigest: true,
};

const defaultPrivacy = {
    showProfile: true,
    showActivity: true,
    allowMessages: true,
};

export default function SettingsPage() {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [profileForm, setProfileForm] = useState({ name: "", email: "", phone: "", campus: "", bio: "" });
    const [notifications, setNotifications] = useState(defaultNotifications);
    const [privacy, setPrivacy] = useState(defaultPrivacy);
    const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    const [deletePassword, setDeletePassword] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        void fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/user");
            const payload = await response.json().catch(() => null);
            if (!response.ok) throw new Error(payload?.error || "Failed to fetch user data");
            const user = payload?.data?.user ?? payload?.user;
            if (!user) throw new Error("User data was not returned");
            setUserData(user);
            setProfileForm({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                campus: user.campus || "",
                bio: user.bio || "",
            });
            setNotifications(user.notifications || defaultNotifications);
            setPrivacy(user.privacy || defaultPrivacy);
        } catch (err: any) {
            setError(err.message || "Failed to load user data");
        } finally {
            setLoading(false);
        }
    };

    const saveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            setError("");
            setSuccess("");
            const response = await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(profileForm),
            });
            const payload = await response.json().catch(() => null);
            if (!response.ok) throw new Error(payload?.error || "Failed to update profile");
            setSuccess("Profile updated successfully.");
            await fetchUserData();
        } catch (err: any) {
            setError(err.message || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    const savePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            setError("");
            setSuccess("");
            if (passwordForm.newPassword !== passwordForm.confirmPassword) throw new Error("New passwords do not match");
            if (passwordForm.newPassword.length < 6) throw new Error("New password must be at least 6 characters");
            const response = await fetch("/api/user/password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword,
                }),
            });
            const payload = await response.json().catch(() => null);
            if (!response.ok) throw new Error(payload?.error || "Failed to change password");
            setSuccess("Password changed successfully.");
            setShowPasswordModal(false);
            setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err: any) {
            setError(err.message || "Failed to change password");
        } finally {
            setSaving(false);
        }
    };

    const updateToggles = async (field: "notifications" | "privacy", nextState: ToggleMap, rollback: ToggleMap) => {
        try {
            await fetch("/api/user/preferences", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ [field]: nextState }),
            });
        } catch {
            setError(`Failed to update ${field}`);
            if (field === "notifications") setNotifications(rollback as typeof defaultNotifications);
            if (field === "privacy") setPrivacy(rollback as typeof defaultPrivacy);
        }
    };

    const toggleNotification = (key: keyof typeof defaultNotifications) => {
        const previous = notifications;
        const nextState = { ...notifications, [key]: !notifications[key] };
        setNotifications(nextState);
        void updateToggles("notifications", nextState, previous);
    };

    const togglePrivacy = (key: keyof typeof defaultPrivacy) => {
        const previous = privacy;
        const nextState = { ...privacy, [key]: !privacy[key] };
        setPrivacy(nextState);
        void updateToggles("privacy", nextState, previous);
    };

    const deleteAccount = async () => {
        if (!deletePassword) {
            setError("Please enter your password to confirm deletion");
            return;
        }
        try {
            setSaving(true);
            const response = await fetch("/api/user/account", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: deletePassword }),
            });
            const payload = await response.json().catch(() => null);
            if (!response.ok) throw new Error(payload?.error || "Failed to delete account");
            window.location.href = "/";
        } catch (err: any) {
            setError(err.message || "Failed to delete account");
            setSaving(false);
        }
    };

    const renderToggle = (active: boolean) => (
        <span className={`inline-flex h-6 w-11 items-center rounded-full ${active ? "bg-orange-600" : "bg-slate-300"}`}>
            <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${active ? "translate-x-6" : "translate-x-1"}`} />
        </span>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-5xl font-bold text-orange-600 mb-4">Settings</div>
                    <p className="text-slate-700 font-semibold">Loading settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
            <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200">
                <div className="container-custom py-4 flex items-center justify-between">
                    <Link href="/hub" className="flex items-center space-x-2 text-slate-600 hover:text-slate-800">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span className="font-medium">Back to Hub</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
                    <div className="w-20" />
                </div>
            </header>

            <main className="container-custom py-8 max-w-4xl space-y-6">
                {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>}
                {success && <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">{success}</div>}

                <section className="card">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Profile Settings</h2>
                    <form onSubmit={saveProfile} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input className="w-full px-4 py-2 border border-slate-300 rounded-lg" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} placeholder="Full Name" required />
                            <input className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-100 text-slate-500" value={profileForm.email} disabled placeholder="Email Address" />
                            <input className="w-full px-4 py-2 border border-slate-300 rounded-lg" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} placeholder="Phone Number" />
                            <input className="w-full px-4 py-2 border border-slate-300 rounded-lg" value={profileForm.campus} onChange={(e) => setProfileForm({ ...profileForm, campus: e.target.value })} placeholder="Campus or Location" />
                        </div>
                        <textarea className="w-full px-4 py-2 border border-slate-300 rounded-lg" rows={4} maxLength={500} value={profileForm.bio} onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })} placeholder="Tell us about yourself..." />
                        <div className="text-xs text-slate-500">{profileForm.bio.length}/500 characters</div>
                        <div className="flex justify-end">
                            <button type="submit" disabled={saving} className="px-6 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50">
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </section>

                <section className="card">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Notification Preferences</h2>
                    <div className="space-y-4">
                        {Object.entries(notifications).map(([key, value]) => (
                            <button key={key} type="button" onClick={() => toggleNotification(key as keyof typeof defaultNotifications)} className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-lg text-left">
                                <div>
                                    <p className="font-medium text-slate-800">{key}</p>
                                </div>
                                {renderToggle(value)}
                            </button>
                        ))}
                    </div>
                </section>

                <section className="card">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Privacy Settings</h2>
                    <div className="space-y-4">
                        {Object.entries(privacy).map(([key, value]) => (
                            <button key={key} type="button" onClick={() => togglePrivacy(key as keyof typeof defaultPrivacy)} className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-lg text-left">
                                <div>
                                    <p className="font-medium text-slate-800">{key}</p>
                                </div>
                                {renderToggle(value)}
                            </button>
                        ))}
                    </div>
                </section>

                <section className="card">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Account Security</h2>
                    <div className="space-y-4">
                        <button type="button" onClick={() => setShowPasswordModal(true)} className="w-full p-4 bg-slate-50 rounded-lg text-left hover:bg-slate-100">
                            Change Password
                        </button>
                    </div>
                </section>

                <section className="card border-2 border-red-200 bg-red-50/50">
                    <h2 className="text-2xl font-bold text-red-800 mb-6">Danger Zone</h2>
                    <button type="button" onClick={() => setShowDeleteModal(true)} className="w-full p-4 bg-white border-2 border-red-300 rounded-lg text-left hover:bg-red-50">
                        Delete Account
                    </button>
                </section>

                {showPasswordModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg max-w-md w-full p-6">
                            <h3 className="text-2xl font-bold text-slate-800 mb-4">Change Password</h3>
                            <form onSubmit={savePassword} className="space-y-4">
                                <input type="password" className="w-full px-4 py-2 border border-slate-300 rounded-lg" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} placeholder="Current Password" required />
                                <input type="password" className="w-full px-4 py-2 border border-slate-300 rounded-lg" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} placeholder="New Password" required minLength={6} />
                                <input type="password" className="w-full px-4 py-2 border border-slate-300 rounded-lg" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} placeholder="Confirm New Password" required minLength={6} />
                                <div className="flex gap-3 justify-end">
                                    <button type="button" onClick={() => setShowPasswordModal(false)} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg">Cancel</button>
                                    <button type="submit" disabled={saving} className="px-4 py-2 bg-orange-600 text-white rounded-lg disabled:opacity-50">{saving ? "Changing..." : "Change Password"}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg max-w-md w-full p-6 border-2 border-red-200">
                            <h3 className="text-2xl font-bold text-red-800 mb-4">Delete Account</h3>
                            <p className="text-slate-700 mb-4">This action cannot be undone.</p>
                            <input type="password" className="w-full px-4 py-2 border border-red-300 rounded-lg mb-4" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} placeholder="Enter your password" required />
                            <div className="flex gap-3 justify-end">
                                <button type="button" onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg">Cancel</button>
                                <button type="button" onClick={deleteAccount} disabled={saving || !deletePassword} className="px-4 py-2 bg-red-600 text-white rounded-lg disabled:opacity-50">
                                    {saving ? "Deleting..." : "Delete Account"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

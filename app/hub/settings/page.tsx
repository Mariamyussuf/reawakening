"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface UserData {
    name: string;
    email: string;
    phone?: string;
    campus?: string;
    bio?: string;
    avatar?: string;
    notifications?: {
        dailyVerse: boolean;
        eventReminders: boolean;
        prayerRequests: boolean;
        weeklyDigest: boolean;
    };
    privacy?: {
        showProfile: boolean;
        showActivity: boolean;
        allowMessages: boolean;
    };
}

export default function SettingsPage() {
    const { data: session } = useSession();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [profileForm, setProfileForm] = useState({
        name: "",
        email: "",
        phone: "",
        campus: "",
        bio: "",
    });

    const [notifications, setNotifications] = useState({
        dailyVerse: true,
        eventReminders: true,
        prayerRequests: false,
        weeklyDigest: true,
    });

    const [privacy, setPrivacy] = useState({
        showProfile: true,
        showActivity: true,
        allowMessages: true,
    });

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [deletePassword, setDeletePassword] = useState("");

    // Fetch user data on mount
    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/user");
            if (!response.ok) throw new Error("Failed to fetch user data");
            const data = await response.json();
            const user = data.user;

            setUserData(user);
            setProfileForm({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                campus: user.campus || "",
                bio: user.bio || "",
            });
            setNotifications(user.notifications || {
                dailyVerse: true,
                eventReminders: true,
                prayerRequests: false,
                weeklyDigest: true,
            });
            setPrivacy(user.privacy || {
                showProfile: true,
                showActivity: true,
                allowMessages: true,
            });
        } catch (err: any) {
            setError(err.message || "Failed to load user data");
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
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

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to update profile");
            }

            setSuccess("Profile updated successfully!");
            await fetchUserData();
        } catch (err: any) {
            setError(err.message || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            setError("");
            setSuccess("");

            if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                throw new Error("New passwords do not match");
            }

            if (passwordForm.newPassword.length < 6) {
                throw new Error("New password must be at least 6 characters");
            }

            const response = await fetch("/api/user/password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to change password");
            }

            setSuccess("Password changed successfully!");
            setShowPasswordModal(false);
            setPasswordForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (err: any) {
            setError(err.message || "Failed to change password");
        } finally {
            setSaving(false);
        }
    };

    const handleNotificationToggle = async (key: string, value: boolean) => {
        const updated = { ...notifications, [key]: value };
        setNotifications(updated);

        try {
            await fetch("/api/user/preferences", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notifications: updated }),
            });
        } catch (err: any) {
            setError("Failed to update notification preferences");
            setNotifications(notifications); // Revert on error
        }
    };

    const handlePrivacyToggle = async (key: string, value: boolean) => {
        const updated = { ...privacy, [key]: value };
        setPrivacy(updated);

        try {
            await fetch("/api/user/preferences", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ privacy: updated }),
            });
        } catch (err: any) {
            setError("Failed to update privacy settings");
            setPrivacy(privacy); // Revert on error
        }
    };

    const handleDeleteAccount = async () => {
        if (!deletePassword) {
            setError("Please enter your password to confirm deletion");
            return;
        }

        try {
            setSaving(true);
            setError("");

            const response = await fetch("/api/user/account", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: deletePassword }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to delete account");
            }

            // Redirect to home after account deletion
            window.location.href = "/";
        } catch (err: any) {
            setError(err.message || "Failed to delete account");
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">⚙️</div>
                    <p className="text-slate-700 font-semibold">Loading settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
            {/* Header */}
            <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200">
                <div className="container-custom py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/hub" className="flex items-center space-x-2 text-slate-600 hover:text-slate-800">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span className="font-medium">Back to Hub</span>
                        </Link>
                        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
                        <div className="w-20"></div>
                    </div>
                </div>
            </header>

            <main className="container-custom py-8 max-w-4xl">
                {/* Error/Success Messages */}
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                        {success}
                    </div>
                )}

                {/* Profile Settings */}
                <div className="card mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Profile Settings</h2>

                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                                {userData?.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div className="flex-1">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors mr-2"
                                >
                                    Change Photo
                                </button>
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-300 transition-colors"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={profileForm.name}
                                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={profileForm.email}
                                    disabled
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed"
                                />
                                <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={profileForm.phone}
                                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                    placeholder="+1 (555) 000-0000"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Campus/Location
                                </label>
                                <input
                                    type="text"
                                    value={profileForm.campus}
                                    onChange={(e) => setProfileForm({ ...profileForm, campus: e.target.value })}
                                    placeholder="Main Campus"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Bio
                            </label>
                            <textarea
                                rows={4}
                                value={profileForm.bio}
                                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                                placeholder="Tell us about yourself..."
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                maxLength={500}
                            />
                            <p className="text-xs text-slate-500 mt-1">{profileForm.bio.length}/500 characters</p>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Notification Settings */}
                <div className="card mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Notification Preferences</h2>

                    <div className="space-y-4">
                        {Object.entries(notifications).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-slate-800">
                                        {key === 'dailyVerse' && 'Daily Verse Reminders'}
                                        {key === 'eventReminders' && 'Event Reminders'}
                                        {key === 'prayerRequests' && 'Prayer Request Updates'}
                                        {key === 'weeklyDigest' && 'Weekly Digest Email'}
                                    </p>
                                    <p className="text-sm text-slate-600">
                                        {key === 'dailyVerse' && 'Get notified about your daily Bible verse'}
                                        {key === 'eventReminders' && 'Receive reminders for upcoming events'}
                                        {key === 'prayerRequests' && 'Updates on prayer requests you\'re following'}
                                        {key === 'weeklyDigest' && 'Weekly summary of community activity'}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleNotificationToggle(key, !value)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? 'bg-green-600' : 'bg-slate-300'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Privacy Settings */}
                <div className="card mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Privacy Settings</h2>

                    <div className="space-y-4">
                        {Object.entries(privacy).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-slate-800">
                                        {key === 'showProfile' && 'Public Profile'}
                                        {key === 'showActivity' && 'Show Activity'}
                                        {key === 'allowMessages' && 'Allow Direct Messages'}
                                    </p>
                                    <p className="text-sm text-slate-600">
                                        {key === 'showProfile' && 'Make your profile visible to other members'}
                                        {key === 'showActivity' && 'Let others see your recent activity'}
                                        {key === 'allowMessages' && 'Allow other members to message you'}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handlePrivacyToggle(key, !value)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? 'bg-green-600' : 'bg-slate-300'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Account Security */}
                <div className="card mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Account Security</h2>

                    <div className="space-y-4">
                        <button
                            type="button"
                            onClick={() => setShowPasswordModal(true)}
                            className="w-full p-4 bg-slate-50 rounded-lg text-left hover:bg-slate-100 transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-slate-800">Change Password</p>
                                    <p className="text-sm text-slate-600">Update your account password</p>
                                </div>
                                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </button>

                        <button className="w-full p-4 bg-slate-50 rounded-lg text-left hover:bg-slate-100 transition-colors">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-slate-800">Two-Factor Authentication</p>
                                    <p className="text-sm text-slate-600">Add an extra layer of security</p>
                                </div>
                                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </button>

                        <button className="w-full p-4 bg-slate-50 rounded-lg text-left hover:bg-slate-100 transition-colors">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-slate-800">Connected Devices</p>
                                    <p className="text-sm text-slate-600">Manage devices with access to your account</p>
                                </div>
                                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="card border-2 border-red-200 bg-red-50/50">
                    <h2 className="text-2xl font-bold text-red-800 mb-6">Danger Zone</h2>

                    <div className="space-y-4">
                        <button className="w-full p-4 bg-white border-2 border-red-200 rounded-lg text-left hover:bg-red-50 transition-colors">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-red-800">Deactivate Account</p>
                                    <p className="text-sm text-red-600">Temporarily disable your account</p>
                                </div>
                                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowDeleteModal(true)}
                            className="w-full p-4 bg-white border-2 border-red-300 rounded-lg text-left hover:bg-red-50 transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-red-900">Delete Account</p>
                                    <p className="text-sm text-red-700">Permanently delete your account and all data</p>
                                </div>
                                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Password Change Modal */}
                {showPasswordModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg max-w-md w-full p-6">
                            <h3 className="text-2xl font-bold text-slate-800 mb-4">Change Password</h3>
                            <form onSubmit={handlePasswordChange} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordForm.currentPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordForm.newPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordForm.confirmPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <div className="flex gap-3 justify-end">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowPasswordModal(false);
                                            setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                                            setError("");
                                        }}
                                        className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                                    >
                                        {saving ? "Changing..." : "Change Password"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Delete Account Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg max-w-md w-full p-6 border-2 border-red-200">
                            <h3 className="text-2xl font-bold text-red-800 mb-4">Delete Account</h3>
                            <p className="text-slate-700 mb-4">
                                This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                            </p>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Enter your password to confirm
                                    </label>
                                    <input
                                        type="password"
                                        value={deletePassword}
                                        onChange={(e) => setDeletePassword(e.target.value)}
                                        className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder="Your password"
                                        required
                                    />
                                </div>
                                <div className="flex gap-3 justify-end">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowDeleteModal(false);
                                            setDeletePassword("");
                                            setError("");
                                        }}
                                        className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleDeleteAccount}
                                        disabled={saving || !deletePassword}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                                    >
                                        {saving ? "Deleting..." : "Delete Account"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                    </div>
                </div>
            </main>
        </div>
    );
}

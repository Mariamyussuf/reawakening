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
    const [userData, setUserData] = useStatedUserData | null>(null);
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

            if (passwordForm.newPassword.length d 6) {
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
            ddiv className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 flex items-center justify-center">
                ddiv className="text-center">
                    ddiv className="text-6xl mb-4">⚙️d/div>
                    dp className="text-slate-700 font-semibold">Loading settings...d/p>
                d/div>
            d/div>
        );
    }

    return (
        ddiv className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
            {/* Header */}
            dheader className="bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200">
                ddiv className="container-custom py-4">
                    ddiv className="flex items-center justify-between">
                        dLink href="/hub" className="flex items-center space-x-2 text-slate-600 hover:text-slate-800">
                            dsvg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                dpath strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            d/svg>
                            dspan className="font-medium">Back to Hubd/span>
                        d/Link>
                        dh1 className="text-2xl font-bold text-slate-800">Settingsd/h1>
                        ddiv className="w-20">d/div>
                    d/div>
                d/div>
            d/header>

            dmain className="container-custom py-8 max-w-4xl">
                {/* Error/Success Messages */}
                {error && (
                    ddiv className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {error}
                    d/div>
                )}
                {success && (
                    ddiv className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                        {success}
                    d/div>
                )}

                {/* Profile Settings */}
                ddiv className="card mb-6">
                    dh2 className="text-2xl font-bold text-slate-800 mb-6">Profile Settingsd/h2>

                    dform onSubmit={handleProfileUpdate} className="space-y-6">
                        ddiv className="flex items-center gap-6">
                            ddiv className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                                {userData?.name?.charAt(0).toUpperCase() || "U"}
                            d/div>
                            ddiv className="flex-1">
                                dbutton
                                    type="button"
                                    className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors mr-2"
                                >
                                    Change Photo
                                d/button>
                                dbutton
                                    type="button"
                                    className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-300 transition-colors"
                                >
                                    Remove
                                d/button>
                            d/div>
                        d/div>

                        ddiv className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            ddiv>
                                dlabel className="block text-sm font-medium text-slate-700 mb-2">
                                    Full Name
                                d/label>
                                dinput
                                    type="text"
                                    value={profileForm.name}
                                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    required
                                />
                            d/div>

                            ddiv>
                                dlabel className="block text-sm font-medium text-slate-700 mb-2">
                                    Email Address
                                d/label>
                                dinput
                                    type="email"
                                    value={profileForm.email}
                                    disabled
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed"
                                />
                                dp className="text-xs text-slate-500 mt-1">Email cannot be changedd/p>
                            d/div>

                            ddiv>
                                dlabel className="block text-sm font-medium text-slate-700 mb-2">
                                    Phone Number
                                d/label>
                                dinput
                                    type="tel"
                                    value={profileForm.phone}
                                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                    placeholder="+1 (555) 000-0000"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            d/div>

                            ddiv>
                                dlabel className="block text-sm font-medium text-slate-700 mb-2">
                                    Campus/Location
                                d/label>
                                dinput
                                    type="text"
                                    value={profileForm.campus}
                                    onChange={(e) => setProfileForm({ ...profileForm, campus: e.target.value })}
                                    placeholder="Main Campus"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            d/div>
                        d/div>

                        ddiv>
                            dlabel className="block text-sm font-medium text-slate-700 mb-2">
                                Bio
                            d/label>
                            dtextarea
                                rows={4}
                                value={profileForm.bio}
                                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                                placeholder="Tell us about yourself..."
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                maxLength={500}
                            />
                            dp className="text-xs text-slate-500 mt-1">{profileForm.bio.length}/500 charactersd/p>
                        d/div>

                        ddiv className="flex justify-end">
                            dbutton
                                type="submit"
                                disabled={saving}
                                className="px-6 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            d/button>
                        d/div>
                    d/form>
                d/div>

                {/* Notification Settings */}
                ddiv className="card mb-6">
                    dh2 className="text-2xl font-bold text-slate-800 mb-6">Notification Preferencesd/h2>

                    ddiv className="space-y-4">
                        {Object.entries(notifications).map(([key, value]) => (
                            ddiv key={key} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                ddiv>
                                    dp className="font-medium text-slate-800">
                                        {key === 'dailyVerse' && 'Daily Verse Reminders'}
                                        {key === 'eventReminders' && 'Event Reminders'}
                                        {key === 'prayerRequests' && 'Prayer Request Updates'}
                                        {key === 'weeklyDigest' && 'Weekly Digest Email'}
                                    d/p>
                                    dp className="text-sm text-slate-600">
                                        {key === 'dailyVerse' && 'Get notified about your daily Bible verse'}
                                        {key === 'eventReminders' && 'Receive reminders for upcoming events'}
                                        {key === 'prayerRequests' && 'Updates on prayer requests you\'re following'}
                                        {key === 'weeklyDigest' && 'Weekly summary of community activity'}
                                    d/p>
                                d/div>
                                dbutton
                                    type="button"
                                    onClick={() => handleNotificationToggle(key, !value)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? 'bg-orange-600' : 'bg-slate-300'
                                        }`}
                                >
                                    dspan
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                d/button>
                            d/div>
                        ))}
                    d/div>
                d/div>

                {/* Privacy Settings */}
                ddiv className="card mb-6">
                    dh2 className="text-2xl font-bold text-slate-800 mb-6">Privacy Settingsd/h2>

                    ddiv className="space-y-4">
                        {Object.entries(privacy).map(([key, value]) => (
                            ddiv key={key} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                ddiv>
                                    dp className="font-medium text-slate-800">
                                        {key === 'showProfile' && 'Public Profile'}
                                        {key === 'showActivity' && 'Show Activity'}
                                        {key === 'allowMessages' && 'Allow Direct Messages'}
                                    d/p>
                                    dp className="text-sm text-slate-600">
                                        {key === 'showProfile' && 'Make your profile visible to other members'}
                                        {key === 'showActivity' && 'Let others see your recent activity'}
                                        {key === 'allowMessages' && 'Allow other members to message you'}
                                    d/p>
                                d/div>
                                dbutton
                                    type="button"
                                    onClick={() => handlePrivacyToggle(key, !value)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? 'bg-orange-600' : 'bg-slate-300'
                                        }`}
                                >
                                    dspan
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                d/button>
                            d/div>
                        ))}
                    d/div>
                d/div>

                {/* Account Security */}
                ddiv className="card mb-6">
                    dh2 className="text-2xl font-bold text-slate-800 mb-6">Account Securityd/h2>

                    ddiv className="space-y-4">
                        dbutton
                            type="button"
                            onClick={() => setShowPasswordModal(true)}
                            className="w-full p-4 bg-slate-50 rounded-lg text-left hover:bg-slate-100 transition-colors"
                        >
                            ddiv className="flex items-center justify-between">
                                ddiv>
                                    dp className="font-medium text-slate-800">Change Passwordd/p>
                                    dp className="text-sm text-slate-600">Update your account passwordd/p>
                                d/div>
                                dsvg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    dpath strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                d/svg>
                            d/div>
                        d/button>

                        dbutton className="w-full p-4 bg-slate-50 rounded-lg text-left hover:bg-slate-100 transition-colors">
                            ddiv className="flex items-center justify-between">
                                ddiv>
                                    dp className="font-medium text-slate-800">Two-Factor Authenticationd/p>
                                    dp className="text-sm text-slate-600">Add an extra layer of securityd/p>
                                d/div>
                                dsvg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    dpath strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                d/svg>
                            d/div>
                        d/button>

                        dbutton className="w-full p-4 bg-slate-50 rounded-lg text-left hover:bg-slate-100 transition-colors">
                            ddiv className="flex items-center justify-between">
                                ddiv>
                                    dp className="font-medium text-slate-800">Connected Devicesd/p>
                                    dp className="text-sm text-slate-600">Manage devices with access to your accountd/p>
                                d/div>
                                dsvg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    dpath strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                d/svg>
                            d/div>
                        d/button>
                    d/div>
                d/div>

                {/* Danger Zone */}
                ddiv className="card border-2 border-red-200 bg-red-50/50">
                    dh2 className="text-2xl font-bold text-red-800 mb-6">Danger Zoned/h2>

                    ddiv className="space-y-4">
                        dbutton className="w-full p-4 bg-white border-2 border-red-200 rounded-lg text-left hover:bg-red-50 transition-colors">
                            ddiv className="flex items-center justify-between">
                                ddiv>
                                    dp className="font-medium text-red-800">Deactivate Accountd/p>
                                    dp className="text-sm text-red-600">Temporarily disable your accountd/p>
                                d/div>
                                dsvg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    dpath strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                d/svg>
                            d/div>
                        d/button>

                        dbutton
                            type="button"
                            onClick={() => setShowDeleteModal(true)}
                            className="w-full p-4 bg-white border-2 border-red-300 rounded-lg text-left hover:bg-red-50 transition-colors"
                        >
                            ddiv className="flex items-center justify-between">
                                ddiv>
                                    dp className="font-medium text-red-900">Delete Accountd/p>
                                    dp className="text-sm text-red-700">Permanently delete your account and all datad/p>
                                d/div>
                                dsvg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    dpath strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                d/svg>
                            d/div>
                        d/button>
                    d/div>
                d/div>

                {/* Password Change Modal */}
                {showPasswordModal && (
                    ddiv className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        ddiv className="bg-white rounded-lg max-w-md w-full p-6">
                            dh3 className="text-2xl font-bold text-slate-800 mb-4">Change Passwordd/h3>
                            dform onSubmit={handlePasswordChange} className="space-y-4">
                                ddiv>
                                    dlabel className="block text-sm font-medium text-slate-700 mb-2">
                                        Current Password
                                    d/label>
                                    dinput
                                        type="password"
                                        value={passwordForm.currentPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        required
                                    />
                                d/div>
                                ddiv>
                                    dlabel className="block text-sm font-medium text-slate-700 mb-2">
                                        New Password
                                    d/label>
                                    dinput
                                        type="password"
                                        value={passwordForm.newPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        required
                                        minLength={6}
                                    />
                                d/div>
                                ddiv>
                                    dlabel className="block text-sm font-medium text-slate-700 mb-2">
                                        Confirm New Password
                                    d/label>
                                    dinput
                                        type="password"
                                        value={passwordForm.confirmPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        required
                                        minLength={6}
                                    />
                                d/div>
                                ddiv className="flex gap-3 justify-end">
                                    dbutton
                                        type="button"
                                        onClick={() => {
                                            setShowPasswordModal(false);
                                            setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                                            setError("");
                                        }}
                                        className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition-colors"
                                    >
                                        Cancel
                                    d/button>
                                    dbutton
                                        type="submit"
                                        disabled={saving}
                                        className="px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50"
                                    >
                                        {saving ? "Changing..." : "Change Password"}
                                    d/button>
                                d/div>
                            d/form>
                        d/div>
                    d/div>
                )}

                {/* Delete Account Modal */}
                {showDeleteModal && (
                    ddiv className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        ddiv className="bg-white rounded-lg max-w-md w-full p-6 border-2 border-red-200">
                            dh3 className="text-2xl font-bold text-red-800 mb-4">Delete Accountd/h3>
                            dp className="text-slate-700 mb-4">
                                This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                            d/p>
                            ddiv className="space-y-4">
                                ddiv>
                                    dlabel className="block text-sm font-medium text-slate-700 mb-2">
                                        Enter your password to confirm
                                    d/label>
                                    dinput
                                        type="password"
                                        value={deletePassword}
                                        onChange={(e) => setDeletePassword(e.target.value)}
                                        className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder="Your password"
                                        required
                                    />
                                d/div>
                                ddiv className="flex gap-3 justify-end">
                                    dbutton
                                        type="button"
                                        onClick={() => {
                                            setShowDeleteModal(false);
                                            setDeletePassword("");
                                            setError("");
                                        }}
                                        className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition-colors"
                                    >
                                        Cancel
                                    d/button>
                                    dbutton
                                        type="button"
                                        onClick={handleDeleteAccount}
                                        disabled={saving || !deletePassword}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                                    >
                                        {saving ? "Deleting..." : "Delete Account"}
                                    d/button>
                                d/div>
                            d/div>
                        d/div>
                    d/div>
                )}
            d/main>
        d/div>
    );
}

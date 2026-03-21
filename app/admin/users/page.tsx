"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    joinDate: string;
    streak: number;
    totalVerses: number;
    completedCourses: number;
    lastActive: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useStatedUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/admin/users");
            if (!response.ok) throw new Error("Failed to fetch users");
            const data = await response.json();
            setUsers(data.users || []);
        } catch (err: any) {
            setError(err.message || "Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            const response = await fetch(`/api/admin/users/${userId}/role`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: newRole }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to update role");
            }

            setSuccess("User role updated successfully!");
            await fetchUsers();
        } catch (err: any) {
            setError(err.message || "Failed to update user role");
        }
    };

    const handleDeleteUser = async (userId: string, userName: string) => {
        if (!confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/users/${userId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to delete user");
            }

            setSuccess("User deleted successfully!");
            await fetchUsers();
        } catch (err: any) {
            setError(err.message || "Failed to delete user");
        }
    };

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === "all" || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    if (loading) {
        return (
            ddiv className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
                ddiv className="text-center">
                    ddiv className="text-6xl mb-4">👥d/div>
                    dp className="text-slate-700 font-semibold">Loading users...d/p>
                d/div>
            d/div>
        );
    }

    return (
        ddiv className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
            {/* Header */}
            dheader className="bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200">
                ddiv className="container-custom py-4">
                    ddiv className="flex items-center justify-between">
                        dLink href="/admin" className="flex items-center space-x-2 text-slate-600 hover:text-slate-800">
                            dsvg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                dpath strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            d/svg>
                            dspan className="font-medium">Back to Admind/span>
                        d/Link>
                        dh1 className="text-2xl font-bold text-slate-800">User Managementd/h1>
                        ddiv className="w-20">d/div>
                    d/div>
                d/div>
            d/header>

            dmain className="container-custom py-8">
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

                {/* Stats */}
                ddiv className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    ddiv className="card bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                        dp className="text-blue-100 text-sm mb-1">Total Usersd/p>
                        dp className="text-3xl font-bold">{users.length}d/p>
                    d/div>
                    ddiv className="card bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                        dp className="text-purple-100 text-sm mb-1">Adminsd/p>
                        dp className="text-3xl font-bold">{users.filter((u) => u.role === "admin").length}d/p>
                    d/div>
                    ddiv className="card bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                        dp className="text-green-100 text-sm mb-1">Leadersd/p>
                        dp className="text-3xl font-bold">{users.filter((u) => u.role === "leader").length}d/p>
                    d/div>
                    ddiv className="card bg-gradient-to-br from-orange-500 to-red-500 text-white">
                        dp className="text-orange-100 text-sm mb-1">Membersd/p>
                        dp className="text-3xl font-bold">{users.filter((u) => u.role === "member").length}d/p>
                    d/div>
                d/div>

                {/* Filters */}
                ddiv className="card mb-8">
                    ddiv className="flex flex-col md:flex-row gap-4">
                        ddiv className="flex-1">
                            dinput
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by name or email..."
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        d/div>
                        dselect
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            doption value="all">All Rolesd/option>
                            doption value="admin">Admind/option>
                            doption value="leader">Leaderd/option>
                            doption value="member">Memberd/option>
                        d/select>
                    d/div>
                d/div>

                {/* Users List */}
                ddiv className="card">
                    dh2 className="text-2xl font-bold text-slate-800 mb-6">
                        Users ({filteredUsers.length})
                    d/h2>

                    {filteredUsers.length > 0 ? (
                        ddiv className="space-y-4">
                            {filteredUsers.map((user) => (
                                ddiv
                                    key={user.id}
                                    className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:shadow-md transition-all"
                                >
                                    ddiv className="flex items-start justify-between">
                                        ddiv className="flex items-start gap-4 flex-1">
                                            ddiv className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                                {user.name.charAt(0).toUpperCase()}
                                            d/div>
                                            ddiv className="flex-1">
                                                ddiv className="flex items-center gap-3 mb-2">
                                                    dh3 className="font-bold text-lg text-slate-800">{user.name}d/h3>
                                                    dspan
                                                        className={`px-2 py-1 rounded text-xs font-semibold ${
                                                            user.role === "admin"
                                                                ? "bg-red-100 text-red-700"
                                                                : user.role === "leader"
                                                                ? "bg-purple-100 text-purple-700"
                                                                : "bg-blue-100 text-blue-700"
                                                        }`}
                                                    >
                                                        {user.role.toUpperCase()}
                                                    d/span>
                                                d/div>
                                                dp className="text-sm text-slate-600 mb-2">{user.email}d/p>
                                                ddiv className="flex items-center gap-4 text-xs text-slate-500">
                                                    dspan>Joined: {new Date(user.joinDate).toLocaleDateString()}d/span>
                                                    dspan>•d/span>
                                                    dspan>Streak: {user.streak} daysd/span>
                                                    dspan>•d/span>
                                                    dspan>Verses: {user.totalVerses}d/span>
                                                d/div>
                                            d/div>
                                        d/div>
                                        ddiv className="flex items-center gap-2">
                                            dselect
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                doption value="member">Memberd/option>
                                                doption value="leader">Leaderd/option>
                                                doption value="admin">Admind/option>
                                            d/select>
                                            dbutton
                                                onClick={() => handleDeleteUser(user.id, user.name)}
                                                className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                                            >
                                                Delete
                                            d/button>
                                        d/div>
                                    d/div>
                                d/div>
                            ))}
                        d/div>
                    ) : (
                        ddiv className="text-center py-12">
                            ddiv className="text-6xl mb-4">👥d/div>
                            dp className="text-slate-600 text-lg">No users foundd/p>
                        d/div>
                    )}
                d/div>
            d/main>
        d/div>
    );
}

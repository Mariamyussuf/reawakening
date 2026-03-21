"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    joinDate: string;
    streak: number;
    totalVerses: number;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    useEffect(() => {
        void fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/admin/users");
            const payload = await response.json().catch(() => null);
            if (!response.ok) {
                throw new Error(payload?.error || "Failed to fetch users");
            }
            setUsers(payload?.data?.users || payload?.users || []);
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
            const payload = await response.json().catch(() => null);
            if (!response.ok) {
                throw new Error(payload?.error || "Failed to update role");
            }
            setSuccess("User role updated successfully.");
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
            const response = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
            const payload = await response.json().catch(() => null);
            if (!response.ok) {
                throw new Error(payload?.error || "Failed to delete user");
            }
            setSuccess("User deleted successfully.");
            await fetchUsers();
        } catch (err: any) {
            setError(err.message || "Failed to delete user");
        }
    };

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === "all" || user.role.toLowerCase() === roleFilter;
        return matchesSearch && matchesRole;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-5xl font-bold text-blue-600 mb-4">Users</div>
                    <p className="text-slate-700 font-semibold">Loading users...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
            <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200">
                <div className="container-custom py-4 flex items-center justify-between">
                    <Link href="/admin" className="flex items-center space-x-2 text-slate-600 hover:text-slate-800">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span className="font-medium">Back to Admin</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
                    <div className="w-20" />
                </div>
            </header>

            <main className="container-custom py-8 space-y-6">
                {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>}
                {success && <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">{success}</div>}

                <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="card bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                        <p className="text-blue-100 text-sm mb-1">Total Users</p>
                        <p className="text-3xl font-bold">{users.length}</p>
                    </div>
                    <div className="card bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                        <p className="text-purple-100 text-sm mb-1">Admins</p>
                        <p className="text-3xl font-bold">{users.filter((u) => u.role.toLowerCase() === "admin").length}</p>
                    </div>
                    <div className="card bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                        <p className="text-green-100 text-sm mb-1">Leaders</p>
                        <p className="text-3xl font-bold">{users.filter((u) => u.role.toLowerCase() === "leader").length}</p>
                    </div>
                    <div className="card bg-gradient-to-br from-orange-500 to-red-500 text-white">
                        <p className="text-orange-100 text-sm mb-1">Members</p>
                        <p className="text-3xl font-bold">{users.filter((u) => u.role.toLowerCase() === "member").length}</p>
                    </div>
                </section>

                <section className="card">
                    <div className="flex flex-col md:flex-row gap-4">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name or email..."
                            className="w-full md:flex-1 px-4 py-3 border border-slate-300 rounded-lg"
                        />
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="px-4 py-3 border border-slate-300 rounded-lg"
                        >
                            <option value="all">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="leader">Leader</option>
                            <option value="member">Member</option>
                        </select>
                    </div>
                </section>

                <section className="card">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Users ({filteredUsers.length})</h2>
                    {filteredUsers.length > 0 ? (
                        <div className="space-y-4">
                            {filteredUsers.map((user) => (
                                <div key={user.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:shadow-md transition-all">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="font-bold text-lg text-slate-800">{user.name}</h3>
                                                    <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-700">
                                                        {user.role.toUpperCase()}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-600 mb-2">{user.email}</p>
                                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                                    <span>Joined: {new Date(user.joinDate).toLocaleDateString()}</span>
                                                    <span>Streak: {user.streak} days</span>
                                                    <span>Verses: {user.totalVerses}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <select
                                                value={user.role.toLowerCase()}
                                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                            >
                                                <option value="member">Member</option>
                                                <option value="leader">Leader</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                            <button
                                                onClick={() => handleDeleteUser(user.id, user.name)}
                                                className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-5xl font-bold text-slate-500 mb-4">Users</div>
                            <p className="text-slate-600 text-lg">No users found</p>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

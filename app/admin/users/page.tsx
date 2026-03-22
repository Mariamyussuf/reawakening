"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    joinDate: string;
    streak: number;
    totalVerses: number;
}

function getDisplayName(user: User) {
    return user.name?.trim() || user.email.split("@")[0] || "Member";
}

function getRoleBadgeClass(role: string) {
    switch (role.toLowerCase()) {
        case "admin":
            return "bg-deep text-cream border border-deep";
        case "leader":
            return "bg-gold/15 text-gold-dark border border-gold/30";
        default:
            return "bg-cream text-deep/75 border border-mid/20";
    }
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

    useEffect(() => {
        if (!error) {
            return;
        }

        const timer = setTimeout(() => setError(""), 5000);
        return () => clearTimeout(timer);
    }, [error]);

    useEffect(() => {
        if (!success) {
            return;
        }

        const timer = setTimeout(() => setSuccess(""), 4000);
        return () => clearTimeout(timer);
    }, [success]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch("/api/admin/users", {
                cache: "no-store",
            });
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
            setError("");
            setSuccess("");

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
            setError("");
            setSuccess("");

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

    const filteredUsers = useMemo(
        () =>
            users.filter((user) => {
                const name = getDisplayName(user);
                const matchesSearch =
                    name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesRole = roleFilter === "all" || user.role.toLowerCase() === roleFilter;
                return matchesSearch && matchesRole;
            }),
        [roleFilter, searchQuery, users]
    );

    const adminCount = users.filter((user) => user.role.toLowerCase() === "admin").length;
    const leaderCount = users.filter((user) => user.role.toLowerCase() === "leader").length;
    const memberCount = users.filter((user) => user.role.toLowerCase() === "member").length;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cream px-6">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-4" />
                    <p className="font-display text-lg text-deep/70">Loading users...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream font-body">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 rounded-2xl border border-gold/20 bg-warm-white overflow-hidden">
                            <Image
                                src="/images/logo.png"
                                alt="Reawakening"
                                fill
                                className="object-contain p-2"
                                sizes="48px"
                            />
                        </div>
                        <div>
                            <p className="eyebrow mb-1">Admin Workspace</p>
                            <h1 className="font-display text-3xl text-deep">User management</h1>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button onClick={() => void fetchUsers()} className="btn-outline" type="button">
                            Refresh
                        </button>
                        <Link href="/admin" className="btn-primary">
                            Back to Admin
                        </Link>
                    </div>
                </div>

                <div className="bg-warm-white border border-mid/20 rounded-3xl p-6 sm:p-8 mb-8 shadow-sm">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                        <div className="max-w-2xl">
                            <p className="text-xs text-deep/50 tracking-wide uppercase mb-2">People and Roles</p>
                            <h2 className="font-display text-2xl sm:text-4xl text-deep mb-3">
                                Serve the community with clarity
                            </h2>
                            <p className="text-deep/70 leading-relaxed">
                                Review access levels, support ministry leaders, and keep membership records organized in one place.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-deep p-5 min-w-[220px]">
                            <p className="text-[10px] tracking-[0.2em] uppercase text-gold/70 mb-2">Active Filters</p>
                            <p className="font-display text-xl text-cream">
                                {filteredUsers.length} visible
                            </p>
                            <p className="text-sm text-cream/60 mt-1">
                                {roleFilter === "all" ? "All roles" : `${roleFilter} accounts`}
                            </p>
                            <p className="text-xs text-cream/50 mt-3">
                                Search: {searchQuery.trim() || "none"}
                            </p>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-700">
                        {success}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                    {[
                        {
                            label: "Community",
                            value: `${users.length}`,
                            detail: "Total registered accounts",
                        },
                        {
                            label: "Administrators",
                            value: `${adminCount}`,
                            detail: "Full access to platform settings",
                        },
                        {
                            label: "Leaders",
                            value: `${leaderCount}`,
                            detail: "Ministry team and content access",
                        },
                        {
                            label: "Members",
                            value: `${memberCount}`,
                            detail: "Standard community accounts",
                        },
                    ].map((card, index) => (
                        <div
                            key={card.label}
                            className={`rounded-2xl border p-5 shadow-sm ${
                                index === 1
                                    ? "bg-deep border-deep text-cream"
                                    : index === 2
                                        ? "bg-gold/15 border-gold/30 text-deep"
                                        : "bg-warm-white border-mid/20 text-deep"
                            }`}
                        >
                            <p className={`text-xs tracking-wide uppercase mb-2 ${
                                index === 1 ? "text-gold/75" : "text-deep/50"
                            }`}>
                                {card.label}
                            </p>
                            <p className="font-display text-3xl mb-2">{card.value}</p>
                            <p className={`text-sm leading-relaxed ${
                                index === 1 ? "text-cream/70" : "text-deep/70"
                            }`}>
                                {card.detail}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="bg-warm-white border border-mid/20 rounded-3xl p-6 shadow-sm mb-8">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <label className="flex-1">
                            <span className="block text-xs uppercase tracking-[0.18em] text-deep/45 mb-2">
                                Search users
                            </span>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(event) => setSearchQuery(event.target.value)}
                                placeholder="Search by name or email"
                                className="w-full rounded-2xl border border-mid/20 bg-cream px-4 py-3 text-deep placeholder:text-deep/35 focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20"
                            />
                        </label>

                        <label className="lg:w-64">
                            <span className="block text-xs uppercase tracking-[0.18em] text-deep/45 mb-2">
                                Filter by role
                            </span>
                            <select
                                value={roleFilter}
                                onChange={(event) => setRoleFilter(event.target.value)}
                                className="w-full rounded-2xl border border-mid/20 bg-cream px-4 py-3 text-deep focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20"
                            >
                                <option value="all">All Roles</option>
                                <option value="admin">Admin</option>
                                <option value="leader">Leader</option>
                                <option value="member">Member</option>
                            </select>
                        </label>
                    </div>
                </div>

                <div className="bg-warm-white border border-mid/20 rounded-3xl p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
                        <div>
                            <p className="eyebrow mb-2">Directory</p>
                            <h2 className="font-display text-2xl text-deep">
                                People in the workspace
                            </h2>
                        </div>
                        <p className="text-sm text-deep/55">
                            Showing {filteredUsers.length} of {users.length} users
                        </p>
                    </div>

                    {filteredUsers.length > 0 ? (
                        <div className="space-y-4">
                            {filteredUsers.map((user) => {
                                const displayName = getDisplayName(user);

                                return (
                                    <div
                                        key={user.id}
                                        className="rounded-2xl border border-mid/20 bg-cream p-5 hover:border-gold/35 hover:shadow-lift transition-all"
                                    >
                                        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
                                            <div className="flex items-start gap-4 min-w-0 flex-1">
                                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-deep text-lg font-semibold text-cream">
                                                    {displayName.charAt(0).toUpperCase()}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-wrap items-center gap-3 mb-2">
                                                        <h3 className="font-display text-xl text-deep break-words">
                                                            {displayName}
                                                        </h3>
                                                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${getRoleBadgeClass(user.role)}`}>
                                                            {user.role}
                                                        </span>
                                                    </div>

                                                    <p className="text-sm text-deep/65 break-all mb-3">{user.email}</p>

                                                    <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-deep/55">
                                                        <span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
                                                        <span>{user.streak} day streak</span>
                                                        <span>{user.totalVerses} verses saved</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:flex-row gap-3 xl:justify-end">
                                                <select
                                                    value={user.role.toLowerCase()}
                                                    onChange={(event) => handleRoleChange(user.id, event.target.value)}
                                                    className="min-w-[150px] rounded-2xl border border-mid/20 bg-warm-white px-4 py-3 text-sm text-deep focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20"
                                                >
                                                    <option value="member">Member</option>
                                                    <option value="leader">Leader</option>
                                                    <option value="admin">Admin</option>
                                                </select>

                                                <button
                                                    onClick={() => handleDeleteUser(user.id, displayName)}
                                                    className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 transition-colors hover:bg-red-100"
                                                    type="button"
                                                >
                                                    Delete User
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-mid/30 bg-cream px-6 py-16 text-center">
                            <p className="eyebrow mb-3">No Results</p>
                            <h3 className="font-display text-2xl text-deep mb-2">No users matched your filters</h3>
                            <p className="text-deep/65 max-w-xl mx-auto leading-relaxed">
                                Try adjusting the role filter or search term to bring more of the community into view.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

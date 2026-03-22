import AdminModulePlaceholder from "@/components/admin/AdminModulePlaceholder";

export default function AdminVersesPage() {
    return (
        <AdminModulePlaceholder
            eyebrow="Scripture Flow"
            title="Daily Verses"
            description="Manage daily scripture highlights and keep the Bible-focused experience fresh across the member journey."
            highlights={[
                "Schedule and rotate daily verse highlights for the community.",
                "Curate featured passages for seasonal campaigns and conference weeks.",
                "Review how scripture content supports devotionals and Bible study flow.",
            ]}
            primaryAction={{
                href: "/daily-verse",
                label: "Open Daily Verse Page",
            }}
            secondaryAction={{
                href: "/hub/bible",
                label: "Open Bible Hub",
            }}
            note="This page now exists so the admin dashboard route is no longer broken."
        />
    );
}

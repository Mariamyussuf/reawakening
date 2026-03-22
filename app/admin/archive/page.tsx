import AdminModulePlaceholder from "@/components/admin/AdminModulePlaceholder";

export default function AdminArchivePage() {
    return (
        <AdminModulePlaceholder
            eyebrow="Past Records"
            title="Past Archive"
            description="Preserve records from previous meetings, conferences, and ministry seasons in a place the leadership team can revisit."
            highlights={[
                "Organize past conference summaries, devotionals, and supporting materials.",
                "Keep ministry history easy to browse for future planning and storytelling.",
                "Prepare archived content for public-facing highlights when needed.",
            ]}
            primaryAction={{
                href: "/archive",
                label: "Open Public Archive",
            }}
            secondaryAction={{
                href: "/admin",
                label: "Return to Admin Dashboard",
            }}
            note="This section is ready for deeper archive tooling when you want it."
        />
    );
}

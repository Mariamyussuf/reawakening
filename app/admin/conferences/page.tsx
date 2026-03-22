import AdminModulePlaceholder from "@/components/admin/AdminModulePlaceholder";

export default function AdminConferencesPage() {
    return (
        <AdminModulePlaceholder
            eyebrow="Conference Operations"
            title="Conferences"
            description="Coordinate conference plans, track registration flow, and keep event information aligned with the public conference page."
            highlights={[
                "Publish the next conference date, venue, and registration status.",
                "Track attendance, volunteer roles, and speaker details.",
                "Connect conference updates with archive records after each event.",
            ]}
            primaryAction={{
                href: "/conference",
                label: "Open Public Conference Page",
            }}
            secondaryAction={{
                href: "/archive",
                label: "View Conference Archive",
            }}
            note="You can expand this into full conference CRUD next."
        />
    );
}

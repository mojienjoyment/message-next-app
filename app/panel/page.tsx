import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Prevent build-time prerendering so cookie is read fresh per request
export const dynamic = 'force-dynamic';

export default async function PanelPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    // 1. If no token exists, redirect to login immediately
    if (!token) {
        redirect("/");
    }

    // 2. Fetch user data from the internal Flask API using the token
    // We use the internal 127.0.0.1:5001 URL to bypass proxy overhead during SSR
    const res = await fetch("http://127.0.0.1:5001/user/me", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        cache: "no-store" // Ensure we always get fresh data
    });

    // 3. If the token is invalid, expired, or API fails, redirect to login
    if (!res.ok) {
        redirect("/");
    }

    const data = await res.json();
    const user = data.user;

    // 4. Server Action to handle secure logout
    const handleLogout = async () => {
        "use server";
        const { cookies } = await import("next/headers");
        const store = await cookies();
        store.delete("auth_token");
        redirect("/");
    };

    return (
        <>
            <h1>Dashboard</h1>
            <p className="welcome-text">Welcome, {user.username}!</p>

            {/* User Information Card */}
            <div style={{
                textAlign: "left",
                background: "#f9fafb",
                padding: "24px",
                borderRadius: "12px",
                marginBottom: "24px",
                border: "1px solid #e5e7eb"
            }}>
                <p style={{ margin: "12px 0", color: "#1f2937" }}>
                    <strong style={{ color: "#4f46e5", minWidth: "120px", display: "inline-block" }}>Username:</strong>
                    {user.username}
                </p>
                <p style={{ margin: "12px 0", color: "#1f2937" }}>
                    <strong style={{ color: "#4f46e5", minWidth: "120px", display: "inline-block" }}>Email:</strong>
                    {user.email}
                </p>
                <p style={{ margin: "12px 0", color: "#6b7280", fontSize: "0.85rem" }}>
                    <strong style={{ minWidth: "120px", display: "inline-block" }}>Member since:</strong>
                    {user.created_at}
                </p>
                <p style={{ margin: "12px 0", color: "#6b7280", fontSize: "0.85rem" }}>
                    <strong style={{ minWidth: "120px", display: "inline-block" }}>Last updated:</strong>
                    {user.updated_at}
                </p>
            </div>

            <form action={handleLogout}>
                <button type="submit" className="logout-btn">
                    Logout
                </button>
            </form>
        </>
    );
}
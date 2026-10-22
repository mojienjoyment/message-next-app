import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Prevent build-time prerendering so cookie is read fresh per request
export const dynamic = 'force-dynamic';

export default async function PanelPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
        redirect("/");
    }

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
            <p className="welcome-text">Welcome, Admin!</p>
            <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: 24 }}>
                You are securely authenticated with a PyJWT token.
            </p>

            <form action={handleLogout}>
                <button type="submit" className="logout-btn">
                    Logout
                </button>
            </form>
        </>
    );
}
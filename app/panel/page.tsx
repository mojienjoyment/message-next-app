import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Standard Next.js way to prevent build-time prerendering
// This ensures the cookie is read fresh on every request
export const dynamic = 'force-dynamic';

export default async function PanelPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  // If no token, instantly redirect back to login
  if (!token) {
    redirect("/");
  }

  // Server Action to handle secure logout
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
        You are securely authenticated.
      </p>

      <form action={handleLogout}>
        <button type="submit" className="logout-btn">
          Logout
        </button>
      </form>
    </>
  );
}
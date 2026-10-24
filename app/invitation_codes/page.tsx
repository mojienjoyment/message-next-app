import Link from "next/link";

export default function InvitationCodesPage() {
    return (
        <div className="wide-container" style={{ textAlign: "center" }}>
            <h1>Invitation Codes</h1>
            <p>invitation page</p>
            <Link href="/panel" className="btn-primary">← Back to Panel</Link>
        </div>
    );
}
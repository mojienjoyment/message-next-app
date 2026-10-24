import Link from "next/link";

export default function ServerPage() {
    return (
        <div className="wide-container" style={{ textAlign: 'center' }}>
            <h1>Server Page</h1>
            <p>server page</p>
            <Link href="/panel" className="btn-primary">← Back to Panel</Link>
        </div>
    );
}
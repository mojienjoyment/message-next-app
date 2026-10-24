import Link from "next/link";

export default function StatisticsPage() {
    return (
        <div className="wide-container" style={{ textAlign: 'center' }}>
            <h1>Statistics Page</h1>
            <p>statistics page</p>
            <Link href="/panel" className="btn-primary">← Back to Panel</Link>
        </div>
    );
}
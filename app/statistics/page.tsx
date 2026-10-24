import Link from "next/link";

export default function StatisticsPage() {
    return (
        <>
            <h1>Statistics Page</h1>
            <p>statistics page</p>
            <Link className="back" href="/panel">back to panel</Link>
        </>
    );
}
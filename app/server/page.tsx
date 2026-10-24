import Link from "next/link";

export default function ServerPage() {
    return (
        <>
            <h1>Server Page</h1>
            <p>server page</p>
            <Link className="back" href="/panel">back to panel</Link>
        </>
    );
}
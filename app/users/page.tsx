import Link from "next/link";

export default function UsersPage() {
    return (
        <>
            <h1>Users Page</h1>
            <p>users page</p>
            <Link className="back" href="/panel">back to panel</Link>
        </>
    );
}
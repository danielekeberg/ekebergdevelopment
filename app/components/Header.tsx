'use client';
import Link from "next/link";

export default function Header() {

    const signout = () => {
        localStorage.clear();
        window.location.reload();
    }

    return(
        <div className="flex bg-[#131313] items-center justify-between font-bold px-[15%] py-5 border-b border-neutral-800 mb-10">
            <nav className="grid grid-cols-3 gap-2 text-sm text-neutral-500">
                {[
                    { id: "overview", label: "Overview", icon: "/dashboard.svg", url: "../" },
                    { id: "notes", label: "Client Notes", icon: "/notes.svg", url: "../client-notes" },
                    { id: "projects", label: "Projects", icon: "/projects.svg", url: "../projects" }
                ].map((item) => (
                    <Link
                        key={item.id}
                        href={item.url}
                        className="w-full text-left"
                    >
                        <div className={`flex gap-2 py-2 px-4 cursor-pointer hover:bg-neutral-800 hover:text-[#eae8e0] items-center rounded-xl w-full`}>
                            <img src={item.icon} className="hidden md:block h-5 w-5" alt={item.label} />
                            <p>{item.label}</p>
                        </div>
                    </Link>
                ))}                
            </nav>
            <button onClick={signout} className="gap-2 hover:bg-neutral-800 hover:text-[#eae8e0] py-2 px-4 rounded-xl cursor-pointer text-neutral-500 hidden md:flex">
                <img src="/logout.svg" className="h-5 w-5" />
                <p>Logout</p>
            </button>
        </div>
    )
}
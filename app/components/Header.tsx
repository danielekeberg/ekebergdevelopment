'use client';
import { useLocation } from "react-router-dom";
import Link from "next/link";

export default function Header() {

    const signout = () => {
        localStorage.clear();
        window.location.reload();
    }

    return(
        <div className="flex bg-[#131313] items-center justify-between font-bold px-5 md:px-[15%] py-5 border-b border-neutral-800 mb-10">
            <div className="flex items-center gap-5">
                <h1 className="text-xl hidden md:block">EkebergDevelopment</h1>
            <nav className="grid grid-cols-3 gap-2 items-center text-sm text-neutral-500">
                {[
                    { id: "overview", label: "Overview", icon: "/dashboard.svg", url: "../" },
                    { id: "notes", label: "Client Notes", icon: "/notes.svg", url: "../client-notes" },
                    { id: "projects", label: "Projects", icon: "/projects.svg", url: "../projects" }
                ].map((item) => (
                    <Link
                        key={item.id}
                        href={item.url}
                        className="w-full text-center md:text-left"
                    >
                        <div className={`flex gap-2 py-2 px-4 cursor-pointer hover:bg-neutral-800 hover:text-[#eae8e0] items-center rounded-xl w-full`}>
                            <img src={item.icon} className="hidden md:block h-5 w-5" alt={item.label} />
                            <p>{item.label}</p>
                        </div>
                    </Link>
                ))}                
            </nav>
            </div>
            <button onClick={signout} className="gap-2 hover:bg-neutral-800 hover:text-[#eae8e0] py-2 px-4 rounded-xl cursor-pointer text-neutral-500 hidden md:flex">
                <img src="/logout.svg" className="h-5 w-5" />
                <p>Logout</p>
            </button>
        </div>
    )
}
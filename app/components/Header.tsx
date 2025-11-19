'use client';
import { useState } from "react";

export default function Header() {
    const [isActive, setIsActive] = useState("overview");
    return(
        <div className="flex bg-[#131313] items-center justify-between font-bold px-[15%] py-5 border-b border-neutral-800 mb-10">
            <nav className="grid grid-cols-3 gap-2 text-sm text-neutral-500">
                {[
                    { id: "overview", label: "Overview", icon: "/dashboard.svg" },
                    { id: "notes", label: "Client Notes", icon: "/notes.svg" },
                    { id: "projects", label: "Projects", icon: "/projects.svg" }
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setIsActive(item.id)}
                        className="w-full text-left"
                    >
                        <div className={`flex gap-2 py-2 px-4 cursor-pointer hover:bg-neutral-800 hover:text-[#eae8e0] items-center rounded-xl w-full ${isActive === item.id ? 'bg-neutral-800 text-[#eae8e0]' : ''}`}>
                            <img src={item.icon} className="h-5 w-5" alt={item.label} />
                            <p>{item.label}</p>
                        </div>
                    </button>
                ))}                
            </nav>
            <button className="flex gap-2 text-neutral-500">
                <img src="/dashboard.svg" className="h-5 w-5" />
                <p>Logout</p>
            </button>
        </div>
    )
}
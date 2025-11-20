'use client';
import { useState } from "react";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const successToken = process.env.NEXT_PUBLIC_TEST;
    if(!successToken) {
        return;
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await fetch("api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            });

            const contentType = res.headers.get("content-type") || "";
            let data: any = null;

            if (contentType.includes("application/json")) {
                data = await res.json();
            } else {
                const text = await res.text();
                console.error("Non-JSON response from /api/login:", text);
                throw new Error("Server returned non-JSON response");
            }
            if(!res.ok) {
                console.error(data.error)
                return;
            }
            const tokenToStore = data.token || successToken;
            if(tokenToStore) {
                localStorage.setItem("token", tokenToStore);
            }
            window.location.reload();
        } catch(err) {
            console.error(err);
        }
    }
    return(
        <div className="h-screen w-full flex flex-col justify-center items-center">
            <h1 className="text-[#eae8e0] text-3xl mb-1 font-bold">Welcome back</h1>
            <p className="text-neutral-500 mb-10">Sign in to access your dashboard</p>
            <div className="bg-[#131313] m-2 w-full md:w-125 p-10 rounded-xl shadow-xl border border-neutral-500/20 relative text-neutral-500 text-sm">
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <label>Email</label>
                        <input onChange={(e) => setUsername(e.target.value)} type="text" placeholder="you@example.com" className="border border-neutral-800 text-sm rounded-md p-2 bg-[#111111] focus:outline-neutral-800" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>Password</label>
                        <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="border border-neutral-800 text-sm rounded-md p-2 bg-[#111111] focus:outline-neutral-800" />
                    </div>
                    <div>
                        <button type="submit" className="bg-[#eae8e0] text-[#131313] font-bold w-full py-2 rounded-md cursor-pointer hover:bg-[#]e5e3d9">Sign in</button>
                    </div>
                    
                </form>
                {error && (
                    <p className="absolute bottom-5 right-[30%] translate-[50%] w-full">Wrong username or password</p>
                )}
            </div>
        </div>
    )
}
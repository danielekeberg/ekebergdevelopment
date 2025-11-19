'use client';
import { hashPassword, verifyPassword } from "@/app/actions/auth";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const success = process.env.NEXT_PUBLIC_TEST;
    if(!success) {
        return;
    }
    const onSubmit = async () => {
        const { data, error} = await supabase
            .from("user")
            .select("*")
        if(error) {
            console.error("Error signing in:", error);
            return;
        }
        const hash = await hashPassword(password)
        const verify = await verifyPassword(data[0]?.password, password)
        if(verify && data[0].username === username) {
            localStorage.setItem("token", success)
            window.location.reload();
        } else {
            setError(true);
        }
    }
    return(
        <div className="h-screen w-full flex flex-col justify-center items-center">
            <div className="bg-neutral-200 m-2 w-100 p-10 rounded-xl shadow-xl border border-neutral-500/20 relative">
                <form action={onSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <label>Username</label>
                        <input onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Username" className="border border-black rounded-md p-2 bg-neutral-300/50" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>Password</label>
                        <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="border border-black rounded-md p-2 bg-neutral-300/50" />
                    </div>
                    <div>
                        <button type="submit" className="bg-blue-500 text-white font-bold w-full py-2 rounded-md cursor-pointer hover:bg-blue-500/80">Login</button>
                    </div>
                    
                </form>
                {error && (
                    <p className="absolute bottom-5 right-[30%] translate-[50%] w-full">Wrong username or password</p>
                )}
            </div>
        </div>
    )
}
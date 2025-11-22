'use client';
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import Spinner from "@/app/components/Loader";

type Note = {
    id: number;
    title: string;
    text: string;
    created_at: string;
    status: string;
    location: string;
}

export default function Notes() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [location, setLocation] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [sortBy, setSortBy] = useState("standard")
    const [includeAccepted, setIncludeAccepted] = useState(false);
    const [includeDeclined, setIncludeDeclined] = useState(false);

    const statuses = useMemo(() => {
        const s = ["pending"]
        if(includeAccepted) s.push("accepted");
        if(includeDeclined) s.push("declined");
        return s;
    }, [includeAccepted, includeDeclined])

    const toggleNotes = () => {
        setIsOpen((prev) => !prev)
    }

    const addNote = async (e:any) => {
        e.preventDefault();
        const { data, error } = await supabase
            .from("notes")
            .insert({
                title,
                location,
                text,
            })
            .select()
            .single()
        setNotes((prev) => [data as Note, ...prev])
        toggleNotes();
    }

    useEffect(() => {
        let isMounted = true;
        async function fetchNotes() {
            setLoading(true);
            const statuses = ["pending"]
            if(includeDeclined) statuses.push("declined");
            if(includeAccepted) statuses.push("accepted");
            const { data, error } = await supabase
                .from("notes")
                .select("*")
                .in("status", statuses)

            if(!isMounted) return;
            const notes = (data || []) as Note[];
            const sorted = notes.toSorted((a, b) => b.id - a.id);
            setNotes(sorted);

            if(error) {
                console.error("Error fetching notes:", error);
                setLoading(false);
                return;
            }
        }
        fetchNotes();
        setLoading(false);
        return () => {
            isMounted = false;
        }
    }, [statuses])

    const sorted = [...notes].sort((a:any, b:any) => {
        switch (sortBy) {
            case 'standard':
                return a.title.localeCompare(b.title);
            case 'location':
                return a.location.localeCompare(b.location);
            case 'status':
                return a.status.localeCompare(b.status);
            default:
                return 0;
        }
    })

    const deleteNote = async (id: number) => {
        const { error } = await supabase
            .from("notes")
            .delete()
            .eq("id", id);
        if(error) {
            console.error("Feil ved sletting:", error);
        } else {
            console.log("Slettet OK");
            setNotes(prev => prev.filter(c => c.id !== id));
        }
    }

    const addClient = async (title: string) => {
        const { data, error } = await supabase
            .from("clients")
            .insert({
                title: title,
                status: "active",
            })
            .select()
            .single();
        if(error) {
            console.error("Error adding client:", error);
            return;
        }
    }

    const accept = async (id: number, title: string) => {
        const { data, error } = await supabase
            .from("notes")
            .update({ status: "accepted" })
            .eq("id", id)
            .select()
            .single();
        if(error) throw error;
        setNotes(prev => prev.filter(c => c.id !== id));
        setNotes(prev => [data as Note, ...prev])
        addClient(title);
    }

    const decline = async (id: number) => {
        const { data, error } = await supabase
            .from("notes")
            .update({ status: "declined" })
            .eq("id", id)
            .select()
            .single();
        if(error) throw error;
        setNotes(prev => prev.filter(c => c.id !== id));
        setNotes(prev => [data as Note, ...prev])
    }

    const regret = async (id: number) => {
        const { data, error } = await supabase
            .from("notes")
            .update({ status: "pending" })
            .eq("id", id)
            .select()
            .single();
        if(error) throw error;
        setNotes(prev => prev.filter(c => c.id !== id));
        setNotes(prev => [data as Note, ...prev])
    }
    return(
        <div className="px-5 md:px-[15%]">
            <div className="flex justify-between items-center">
                <div className="mb-5">
                    <h1 className="text-2xl font-bold mb-2">Client Notes</h1>
                    <p className="text-sm text-neutral-500">Track potential clients and company details</p>
                </div>
                <div>
                    <button onClick={toggleNotes} className="bg-[#eae8e0] py-2 px-5 rounded-xl hidden md:flex gap-2 text-[#131313] font-bold cursor-pointer hover:bg-[#e5e3d9] items-center">
                        <img src="/add.svg" className="h-5 w-5" />
                        <p>Add Note</p>
                    </button>
                </div>
            </div>
            {isOpen && (
                <div className="bg-[#131313] p-7 border-neutral-800 border mb-10 rounded-xl">
                    <form onSubmit={addNote} className="grid grid-cols-1 gap-5 mt-5">
                        <div className="grid grid-cols-2 gap-5">
                            <div className="flex flex-col">
                                <label className="text-neutral-500 mb-2 font-bold">Client Name*</label>
                                <input type="text" className="border border-neutral-800 p-3 rounded-xl focus:outline-neutral-500" onChange={(e) => setTitle(e.target.value)} id="title" />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-neutral-500 mb-2 font-bold">Adress</label>
                                <input type="text" className="border border-neutral-800 p-3 rounded-xl focus:outline-neutral-500" onChange={(e) => setLocation(e.target.value)} id="title" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-neutral-500 mb-2 font-bold">Notes</label>
                            <textarea className="border border-neutral-800 p-3 rounded-xl focus:outline-neutral-500 resize-none" onChange={(e) => setPhone(e.target.value)} id="title" />
                        </div>
                        <div className="flex gap-2 mt-5">
                            <button type="submit" className="py-2 px-3 rounded-xl font-bold bg-[#eae8e0] text-[#131313] cursor-pointer hover:bg-[#e5e3d9] border-neutral-300 border transition duration-300">Save Note</button>
                            <button onClick={toggleNotes} className="py-2 px-3 rounded-xl font-bold bg-[#131313] text-[#eae8e0] cursor-pointer hover:bg-[#151515] border-neutral-800 border transition duration-300">Cancel</button>
                        </div>
                    </form>
                    
                </div>
            )}
            {loading && (
                <Spinner />
            )}
            <div className="bg-[#131313] border border-neutral-800 rounded-xl mb-10">
                <div className="flex justify-between p-7 border-b border-neutral-800">
                    <div>
                        <h3 className="text-xl font-bold">All Notes</h3>
                        <p className="text-sm text-neutral-500">Manage and monitor possible clients</p>
                    </div>
                    <div className="flex gap-2 items-end">
                        <div className="gap-5 hidden md:flex">
                            <div className="flex gap-2 cursor-pointer">
                                <input type="checkbox" id="accepted" className="w-5 h-5 appearance-none 
                                        border border-gray-400 rounded 
                                        checked:bg-[#eae8e0]
                                        checked:border-[#eae8e0]
                                        transition cursor-pointer"
                                    checked={includeAccepted} onChange={(e) => setIncludeAccepted(e.target.checked)} />
                                <label htmlFor="accepted" className="cursor-pointer">Accepted</label>
                            </div>
                            <div className="flex gap-2 cursor-pointer">
                                <input type="checkbox" id="declined" className="w-5 h-5 appearance-none 
                                        border border-gray-400 rounded 
                                        checked:bg-[#eae8e0]
                                        checked:border-[#eae8e0]
                                        transition cursor-pointer"
                                    checked={includeDeclined} onChange={(e) => setIncludeDeclined(e.target.checked)} />
                                <label htmlFor="declined" className="cursor-pointer">Declined</label>
                            </div>
                        </div>
                    </div>
                </div>
                <table className="min-w-full text-left text-sm text-neutral-500">
                    <thead>
                        <tr className="grid grid-cols-3 md:grid-cols-4">
                            <th className={`px-7 py-4 ${sortBy === "standard" ? "text-[#eae8e0] font-bold" : ""}`} onClick={() => { setSortBy("standard")}}>Client</th>
                            <th className={`px-7 py-4 ${sortBy === "location" ? "text-[#eae8e0] font-bold" : ""}`} onClick={() => { setSortBy("location")}}>Location</th>
                            <th className={`px-7 py-4 ${sortBy === "status" ? "text-[#eae8e0] font-bold" : ""} text-right hidden md:block`} onClick={() => { setSortBy("status")}}>Status</th>
                            <th className="px-7 py-4 text-right">Respond</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sorted.map((note) => (
                            <tr key={note.id} className="grid grid-cols-3 md:grid-cols-4 hover:bg-[#161616] border-t border-neutral-800">
                                <td className={`px-7 py-4 font-bold ${sortBy === "standard" ? "text-[#eae8e0]" : ""} overflow-hidden`}>{note.title}</td>
                                <td className={`px-7 py-4 ${sortBy === "location" ? "text-[#eae8e0]" : ""}`}>{note.location ? note.location : 'No location'}</td>
                                <td className={`px-7 py-4 ${sortBy === "status" ? "text-[#eae8e0]" : ""} text-right ${note.status} hidden md:block ${note.status === "declined" ? 'text-red-900' : ''} ${note.status === "accepted" ? 'text-green-900' : ''}`}>{note.status}</td>
                                <td className={`text-right flex gap-2 justify-end`}>
                                    {note.status === "pending" ?
                                        <>
                                            <button className="cursor-pointer px-3 py-4 hover:text-[#eae8e0] transition duration-300" onClick={() => { accept(note.id, note.title)}}>Yes</button>
                                            <button className="cursor-pointer px-3 py-4 hover:text-[#eae8e0] transition duration-300" onClick={() => { decline(note.id)}}>No</button>
                                        </>
                                    :
                                        <button className="cursor-pointer px-7 py-4 hover:text-[#eae8e0] transition duration-300" onClick={() => { regret(note.id)}}>Change</button>
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
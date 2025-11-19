'use client';
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Spinner from "@/app/components/Loader";

type Note = {
    id: number;
    title: string;
    text: string;
    created_at: string;
    status: string;
}

export default function Notes() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [company, setCompany] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const toggleNotes = () => {
        setIsOpen((prev) => !prev)
    }

    const addNote = async (e:any) => {
        e.preventDefault();
        const { data, error } = await supabase
            .from("notes")
            .insert({
                title,
                text,
            })
            .select()
            .single()
        setNotes((prev) => [data as Note, ...prev])
        toggleNotes();
    }

    useEffect(() => {
        async function fetchNotes() {
            setLoading(true);
            const { data, error } = await supabase
                .from("notes")
                .select("*");

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
    }, [])

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

    const accept = async (id: number) => {
        const { data, error } = await supabase
            .from("notes")
            .update({ status: "accepted" })
            .eq("id", id)
            .select()
            .single();
        if(error) throw error;
        setNotes(prev => prev.filter(c => c.id !== id));
        setNotes(prev => [data as Note, ...prev])
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
            <div className="flex justify-between">
                <div className="mb-5">
                    <h1 className="text-2xl font-bold mb-2">Overview</h1>
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
                                <label className="text-neutral-500 mb-2 font-bold">Company</label>
                                <input type="text" className="border border-neutral-800 p-3 rounded-xl focus:outline-neutral-500" onChange={(e) => setCompany(e.target.value)} id="title" />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-neutral-500 mb-2 font-bold">Email</label>
                                <input type="text" className="border border-neutral-800 p-3 rounded-xl focus:outline-neutral-500" onChange={(e) => setEmail(e.target.value)} id="title" />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-neutral-500 mb-2 font-bold">Phone</label>
                                <input type="text" className="border border-neutral-800 p-3 rounded-xl focus:outline-neutral-500" onChange={(e) => setPhone(e.target.value)} id="title" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-neutral-500 mb-2 font-bold">Notes</label>
                            <textarea className="border border-neutral-800 p-3 rounded-xl focus:outline-neutral-500 resize-none" onChange={(e) => setPhone(e.target.value)} id="title" />
                        </div>
                        <div className="flex gap-2 mt-5">
                            <button type="submit" className="py-2 px-3 rounded-xl font-bold bg-[#eae8e0] text-[#131313] cursor-pointer hover:bg-[#e5e3d9] border-neutral-300 border transition duration-300">Save Note</button>
                            <button className="py-2 px-3 rounded-xl font-bold bg-[#131313] text-[#eae8e0] cursor-pointer hover:bg-[#151515] border-neutral-800 border transition duration-300">Cancel</button>
                        </div>
                    </form>
                    
                </div>
            )}
            {loading && (
                <Spinner />
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-10">
                {notes.map((note) => (
                    <div key={note.id} className="bg-[#131313] border border-neutral-800 p-5 rounded-xl hover:shadow-[0_2px_15px_rgba(255,255,255,0.2)] transition duration-200">
                        <div className="w-full min-h-30">
                            <h1 className="text-xl font-bold">{note.title}</h1>
                            <div className="text-neutral-500 grid grid-cols-1 gap-2">
                                <p>{note.text}</p>
                                <p>{new Date(note.created_at).toLocaleDateString("no-NO")}</p>
                            </div>
                        </div>
                        {note.status === "pending" ?
                            <div className="grid grid-cols-2 gap-2 mt-5 text-white font-bold">
                                <button onClick={() => { accept(note.id) }} className="bg-[#eae8e0] text-[#131313] border border-[#eae8e0] py-2 px-5 rounded-xl cursor-pointer hover:bg-[#e5e3d9]">Yes</button>
                                <button onClick={() => { decline(note.id) }} className="bg-[#111111] border border-neutral-800 py-2 px-5 rounded-xl cursor-pointer hover:bg-[#131313]">No</button>
                            </div>
                            :
                            <div>
                                <button onClick={() => { regret(note.id)} } className={`text-center w-full mt-5 ${note.status === "accepted" ? "bg-green-800" : "bg-red-900"} text-white py-2 rounded-full font-bold`}>{note.status}</button>
                            </div>
                        }
                    </div>
                ))}
            </div>
        </div>
    )
}
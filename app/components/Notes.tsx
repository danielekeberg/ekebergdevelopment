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
        <>
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold">Notes</h1>
                    <p className="text-neutral-600">Capture your thoughts and ideas</p>
                </div>
                <button onClick={toggleNotes} className="bg-blue-500 py-2 px-5 rounded-full flex gap-2 text-white font-bold cursor-pointer hover:bg-blue-500/80 items-center">
                    <img src="/add.svg" className="h-5 w-5" />
                    <p>New Note</p>
                </button>
            </div>
            {isOpen && (
                <>
                    <form onSubmit={addNote} className="grid grid-cols-1 gap-5 mt-5">
                        <input type="text" className="border border-neutral-300 p-3 rounded-full focus:outline-blue-500" onChange={(e) => setTitle(e.target.value)} placeholder="Note title..." id="title" />
                        <textarea className="border border-neutral-300 p-3 rounded-xl focus:outline-blue-500 resize-none" onChange={(e) => setText(e.target.value)} placeholder="Write your note..." id="text" />
                        <div className="flex gap-2 mt-5">
                            <button type="submit" className="py-2 px-3 rounded-full font-bold bg-blue-500 text-white cursor-pointer hover:bg-blue-500/80 border-neutral-300 border transition duration-300">Save Note</button>
                            <button className="py-2 px-3 rounded-full font-bold bg-white cursor-pointer hover:bg-blue-500 border-neutral-300 hover:text-white border transition duration-300">Cancel</button>
                        </div>
                    </form>
                    
                </>
            )}
            {loading && (
                <Spinner />
            )}
            <div className="md:p-5 mt-10 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-10">
                {notes.map((note) => (
                    <div key={note.id} className="bg-white p-5 rounded-xl shadow">
                        <div className="w-full min-h-30">
                            <h1 className="text-xl font-bold">{note.title}</h1>
                            <div className="text-neutral-600 grid grid-cols-1 gap-2">
                                <p>{note.text}</p>
                                <p>{new Date(note.created_at).toLocaleDateString("no-NO")}</p>
                            </div>
                        </div>
                        {note.status === "pending" ?
                            <div className="grid grid-cols-2 gap-2 mt-5 text-white font-bold">
                                <button onClick={() => { accept(note.id) }} className="bg-blue-500 py-2 px-5 rounded-xl cursor-pointer hover:bg-blue-500/80">Yes</button>
                                <button onClick={() => { decline(note.id) }} className="bg-red-900 py-2 px-5 rounded-xl cursor-pointer hover:bg-red-900/80">No</button>
                            </div>
                            :
                            <div>
                                <button onClick={() => { regret(note.id)} } className={`text-center w-full mt-5 ${note.status === "accepted" ? "bg-green-800" : "bg-red-900"} text-white py-2 rounded-full font-bold`}>{note.status}</button>
                            </div>
                        }
                    </div>
                ))}
            </div>
        </>
    )
}
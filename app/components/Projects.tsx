'use client';
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

type Project = {
    id: number;
    title: string;
    note: string;
    url: string;
    created_at: string;
}

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([])
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [note, setNote] = useState("");
    const [client, setClient] = useState("");

    useEffect(() => {
        async function fetchProjects() {
            const { data, error } = await supabase
                .from("projects")
                .select("*");
            if(error) {
                console.error("Error fetching projects:", error)
                return;
            }
            if(data) {
                const project = (data || []) as Project[];
                const sorted = [...project].sort((a, b) => a.title.localeCompare(b.title))
                setProjects(sorted);
            }
        }
        fetchProjects();
    },[])

    
    const toggleNewProject = () => {
        setIsOpen(prev => !prev)
    }

    const addProject = async (e:any) => {
        e.preventDefault()
        const { data, error } = await supabase
            .from("projects")
            .insert({
                title,
                url,
                note
            })
            .select()
            .single()
        if(error) {
            console.error("Error adding project:", error);
            return;
        }
        setProjects(prev => [data as Project, ...prev])
        toggleNewProject();
    }

    

    return(
        <div className="px-5 md:px-[15%]">
            <div className="flex justify-between items-center mb-5">
                <div className="mb-5">
                    <h1 className="text-2xl font-bold mb-2">Projects</h1>
                    <p className="text-sm text-neutral-500">Showcase your previous work and achievements</p>
                </div>
                <button onClick={toggleNewProject} className="bg-[#eae8e0] py-2 px-5 rounded-xl hidden md:flex gap-2 text-[#131313] font-bold cursor-pointer hover:bg-[#e5e3d9] items-center">
                        <img src="/add.svg" className="h-5 w-5" />
                        <p>Add Note</p>
                    </button>
            </div>
            {isOpen && (
                <div className="bg-[#131313] p-7 border-neutral-800 border mb-10 rounded-xl">
                    <form onSubmit={addProject} className="grid grid-cols-1 gap-5 mt-5">
                        <div className="grid grid-cols-2 gap-5">
                            <div className="flex flex-col">
                                <label className="text-neutral-500 mb-2 font-bold">Project Title*</label>
                                <input type="text" className="border border-neutral-800 p-3 rounded-xl focus:outline-neutral-500" onChange={(e) => setTitle(e.target.value)} id="title" />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-neutral-500 mb-2 font-bold">Project URL*</label>
                                <input type="text" className="border border-neutral-800 p-3 rounded-xl focus:outline-neutral-500" onChange={(e) => setUrl(e.target.value)} id="title" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-neutral-500 mb-2 font-bold">Description</label>
                            <textarea className="border border-neutral-800 p-3 rounded-xl focus:outline-neutral-500 resize-none" onChange={(e) => setNote(e.target.value)} id="title" />
                        </div>
                        <div className="flex gap-2 mt-5">
                            <button type="submit" className="py-2 px-3 rounded-xl font-bold bg-[#eae8e0] text-[#131313] cursor-pointer hover:bg-[#e5e3d9] border-neutral-300 border transition duration-300">Save Note</button>
                            <button className="py-2 px-3 rounded-xl font-bold bg-[#131313] text-[#eae8e0] cursor-pointer hover:bg-[#151515] border-neutral-800 border transition duration-300">Cancel</button>
                        </div>
                    </form>
                    
                </div>
            )}
            <div className="bg-[#131313] border border-neutral-800 rounded-xl">
                    <div className="p-7 border-b border-neutral-800">
                        <h3 className="text-xl font-bold">All Clients</h3>
                        <p className="text-sm text-neutral-500">Manage and monitor your current clients</p>
                    </div>
                    <table className="min-w-full text-left text-sm text-neutral-500">
                        <thead>
                            <tr className="grid grid-cols-1 md:grid-cols-3">
                                <th className="px-7 py-4">Title</th>
                                <th className="px-7 py-4 hidden md:block">Date</th>
                                <th className="px-7 py-4 hidden md:block">Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((project) => (
                                <tr key={project.id} className="grid grid-cols-1 md:grid-cols-3 hover:bg-[#161616] border-t border-neutral-800">
                                    <td className="text-[#eae8e0] font-bold px-7 py-4"><Link target="_blank" href={project.url}>{project.title}</Link></td>
                                    <td className="px-7 py-4 hidden md:block">{new Date(project.created_at).toLocaleDateString()}</td>
                                    <td className="px-7 py-4 hidden md:block">{project.note}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
        </div>
    )
}
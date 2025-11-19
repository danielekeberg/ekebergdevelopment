'use client';
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

type Project = {
    id: number;
    title: string;
    note: string;
    url: string;
}

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([])
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");

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
                setProjects(project);
                console.log("Projects from supabase:", data)
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
                url
            })
            .select()
            .single()
        setProjects(prev => [data as Project, ...prev])
        toggleNewProject();
    }

    return(
        <div>
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold">Projects</h1>
                    <p className="text-neutral-600">Track your ongoing work</p>
                </div>
                <button onClick={toggleNewProject} className="hidden md:flex bg-blue-500 py-2 px-5 rounded-full gap-2 text-white font-bold cursor-pointer hover:bg-blue-500/80 items-center">
                    <img src="/add.svg" className="h-5 w-5" />
                    <p>New Project</p>
                </button>
            </div>
            {isOpen && (
                <>
                    <form onSubmit={addProject} className="grid grid-cols-1 gap-5 mt-5">
                        <input type="text" className="border border-neutral-300 p-3 rounded-full focus:outline-blue-500" onChange={(e) => setTitle(e.target.value)} placeholder="Project title..." id="title" />
                        <input type="text" className="border border-neutral-300 p-3 rounded-full focus:outline-blue-500" onChange={(e) => setUrl(e.target.value)} placeholder="Project url..." id="text" />
                        <div className="flex gap-2 mt-5">
                            <button type="submit" className="py-2 px-3 rounded-full font-bold bg-blue-500 text-white cursor-pointer hover:bg-blue-500/80 border-neutral-300 border transition duration-300">Save Project</button>
                            <button onClick={toggleNewProject} className="py-2 px-3 rounded-full font-bold bg-white cursor-pointer hover:bg-blue-500 border-neutral-300 hover:text-white border transition duration-300">Cancel</button>
                        </div>
                    </form>
                    
                </>
            )}
            <div className="md:p-5 mt-10 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-10">
                {projects.map((project) => (
                    <Link href={project.url} target="_blank"  key={project.id} className="bg-white p-5 rounded-xl shadow">
                        <h1 className="text-xl font-bold">{project.title}</h1>
                        <p className="text-sm text-neutral-600">{project.note}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}
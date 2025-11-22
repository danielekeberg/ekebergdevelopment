'use client';
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useParams } from "next/navigation";

type Client = {
    id: number;
    title: string;
    email: string;
    projects: number;
    status: string;
    maintenance: boolean;
    pages: 2;
    created_at: string;
    revenue: number;
    org: number;
    phone: number;
    owner: string;
}

export default function Projects() {
    const [client, setClient] = useState<Client[]>([]);
    const params = useParams();
    const { id } = params;

    useEffect(() => {
        async function fetchProjects() {
            const { data, error } = await supabase
                .from("clients")
                .select("*")
                .eq("id", id)

            if(error) {
                console.error("Error fetching projects:", error)
                return;
            }
            if(data) {
                const client = (data || []) as Client[];
                setClient(client);
                console.log("Client from supabase:", data)
            }
        }
        fetchProjects();
    },[])

    const formatNumber = (value:number) => {
        return new Intl.NumberFormat("no-NO").format(value);
    }

    return(
        <div className="px-5 md:px-[15%]">
            <div className="flex justify-between items-center mb-5">
                <Link href="../"  className="flex gap-2 mb-10 py-2 px-5 hover:bg-neutral-800 rounded-xl items-center">
                    <img src="/arrow-left.svg" className="h-5 w-5" />
                    <p className="text-sm font-bold">Back to Dashboard</p>
                </Link>
            </div>
            {client && (
                <div key={client[0]?.id}>
                    <div className="mb-5">
                        <h1 className="text-2xl font-bold mb-2">{client[0]?.title}</h1>
                        <p className={`${client[0]?.status} text-sm`}>{client[0]?.status}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="bg-[#131313] p-7 text-[#eae8e0] border-neutral-800 border mb-10 rounded-xl">
                            <h1 className="mb-5 text-xl font-bold">Contact Information</h1>
                            <div className="mb-2">
                                <p className="text-neutral-500 text-sm">Email</p>
                                <p>{client[0]?.email}</p>
                            </div>
                            <div className="mb-2">
                                <p className="text-neutral-500 text-sm">Phone</p>
                                <p>{client[0]?.phone}</p>
                            </div>
                            <div className="mb-2">
                                <p className="text-neutral-500 text-sm">Owner</p>
                                <p>{client[0]?.owner}</p>
                            </div>
                        </div>
                        <div className="bg-[#131313] p-7 text-[#eae8e0] border-neutral-800 border mb-10 rounded-xl">
                            <h1 className="mb-5 text-xl font-bold">Activity</h1>
                            <div className="mb-2">
                                <p className="text-neutral-500 text-sm">Total Revenue</p>
                                <p className="text-2xl font-bold">kr {formatNumber(client[0]?.revenue)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
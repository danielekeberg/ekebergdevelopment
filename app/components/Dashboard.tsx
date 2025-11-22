'use client';
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Spinner from "@/app/components/Loader";
import Link from "next/link";

type Client = {
  id: number;
  title: string | null;
  email: string | null;
  projects: number | null;
  status: string | null;
  maintenance: string | null;
  pages: number | null;
  created_at: string;
  revenue: number;
};

type Stats = {
    totalClients: number;
    activeProjects: number;
    totalRevenue: number;
    maintenanceClients: number;
    newThisMonth: number;
}

export default function Dashboard() {
    const [clients, setClients] = useState<Client[]>([]);
    const [stats, setStats] = useState<Stats>({
        totalClients: 0,
        activeProjects: 0,
        totalRevenue: 0,
        maintenanceClients: 0,
        newThisMonth: 0,
    })
    const [newClients, setNewClients] = useState(0);
    const [pendingClients, setPendingClients] = useState(0);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from("clients")
                .select("*")
            if(error) {
                console.error("Feil ved henting av clients:", error);
                setLoading(false);
                return;
            }

            const clients = (data || []) as Client[];

            const totalClients = clients.length;
            const activeProjects = clients
                .filter((c) => c.status === "active")
                .reduce((sum, c) => sum + (c.projects || 0), 0);
            const totalRevenue = clients.reduce((sum, c) => sum + (c.revenue || 0), 0);
            const maintenanceClients = clients.filter((c) => {
                if(typeof c.maintenance === "boolean") {
                    return c.maintenance;
                }
                if(typeof c.maintenance === "string") {
                    return ["yes", "true", "active", "1"].includes(c.maintenance.toLowerCase());
                }
                return false;
            }).length;
            const now = new Date();
            const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
            const newThisMonth = clients.filter((c) => { return new Date(c.created_at) >= firstDayOfMonth}).length;

            setStats({
                totalClients,
                activeProjects,
                totalRevenue,
                maintenanceClients,
                newThisMonth,
            });
        };

        const fetchNewClients = async () => {
            const { data, error } = await supabase
                .from("notes")
                .select("status")
                .eq('status', 'accepted')
            if(error) {
                console.error("Error fetching new clients:", error);
                return;
            }
            const newStats = data.length
            setNewClients(newStats);
        }
        fetchNewClients();

        const fetchPendingClients = async () => {
            const { data, error } = await supabase
                .from("notes")
                .select("status")
                .eq('status', 'pending')
            if(error) {
                console.error("Error fetching new clients:", error);
                return;
            }
            const newStats = data.length
            setPendingClients(newStats);
        }
        fetchPendingClients();

        const fetchRecent = async () => {
            const { data, error } = await supabase
                .from("clients")
                .select("*")
                .order("created_at", {ascending: false})
                .limit(9);
            if(error) {
                console.error("Error fetching recent clietns:", error);
                return;
            }
            setClients(data);
        }
        fetchRecent();
        fetchStats();
        setLoading(false);
        
    },[])

    const formatNumber = (value:number) => {
        return new Intl.NumberFormat("no-NO").format(value);
    }

    return(
        <div className="px-5 md:px-[15%]">
            <div className="mb-5">
                <h1 className="text-2xl font-bold mb-2">Overview</h1>
                <p className="text-sm text-neutral-500">Monitor your business metrics and client activity</p>
            </div>
            <div className="flex flex-col gap-10">
                {loading && (
                    <Spinner />
                )}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-8">
                    <div className="border border-neutral-500/30 p-5 rounded-xl bg-[#131313] hover:shadow-[0_2px_15px_rgba(255,255,255,0.2)] transition duration-200">
                        <div className="flex justify-between items-center">
                            <p className="text-neutral-500 mb-3 text-sm font-bold">Total Revenue</p>
                            <img src="/pricing.svg" className="h-10 w-10 bg-[#181818] rounded-xl p-2" />
                        </div>
                        <h1 className="text-4xl font-bold">kr {formatNumber(stats.totalRevenue)}</h1>
                        <p className="text-sm text-neutral-600 mt-2 font-bold">Year to date</p>
                    </div>
                    <div className="border border-neutral-500/30 p-5 rounded-xl bg-[#131313] hover:shadow-[0_2px_15px_rgba(255,255,255,0.2)] transition duration-200">
                        <div className="flex justify-between items-center">
                            <p className="text-neutral-500 mb-3 text-sm font-bold">Total Clients</p>
                            <img src="/users.svg" className="h-10 w-10 bg-[#181818] rounded-xl p-2" />
                        </div>
                        <h1 className="text-4xl font-bold">{formatNumber(stats.totalClients)}</h1>
                        <p className="text-sm text-neutral-600 mt-2 font-bold">+{stats.newThisMonth} this month</p>
                    </div>
                    <div className="border border-neutral-500/30 p-5 rounded-xl bg-[#131313] hover:shadow-[0_2px_15px_rgba(255,255,255,0.2)] transition duration-200">
                        <div className="flex justify-between items-center">
                            <p className="text-neutral-500 mb-3 text-sm font-bold">Maintenance Clients</p>
                            <img src="/maintenance.svg" className="h-10 w-10 bg-[#181818] rounded-xl p-2" />
                        </div>
                        <h1 className="text-4xl font-bold">{formatNumber(stats.maintenanceClients)}</h1>
                        <p className="text-sm text-neutral-600 mt-2 font-bold">Recurring revenue</p>
                    </div>
                    <div className="border border-neutral-500/30 p-5 rounded-xl bg-[#131313] hover:shadow-[0_2px_15px_rgba(255,255,255,0.2)] transition duration-200">
                        <div className="flex justify-between items-center">
                            <p className="text-neutral-500 mb-3 text-sm font-bold">Pending Clients</p>
                            <img src="/add-user.svg" className="h-10 w-10 bg-[#181818] rounded-xl p-2" />
                        </div>
                        <h1 className="text-4xl font-bold">{formatNumber(pendingClients)}</h1>
                        <p className="text-sm text-neutral-600 mt-2 font-bold">{formatNumber(newClients)} new accepted clients</p>
                    </div>
                </div>
                <div className="bg-[#131313] border border-neutral-800 rounded-xl">
                    <div className="p-7 border-b border-neutral-800">
                        <h3 className="text-xl font-bold">All Clients</h3>
                        <p className="text-sm text-neutral-500">Manage and monitor your current clients</p>
                    </div>
                    <table className="min-w-full text-left text-sm text-neutral-500">
                        <thead>
                            <tr className="grid grid-cols-2 md:grid-cols-5">
                                <th className="px-7 py-4">Client</th>
                                <th className="px-7 py-4 hidden md:block">Email</th>
                                <th className="px-7 py-4 hidden md:block">Status</th>
                                <th className="px-7 py-4 hidden md:block text-right">Maintenance</th>
                                <th className="px-7 py-4 text-right">Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map((client) => (
                                <tr key={client.id} className="grid grid-cols-2 md:grid-cols-5 hover:bg-[#161616] border-t border-neutral-800">
                                    <td className="text-[#eae8e0] font-bold px-7 py-4"><Link href={`../client/${client.id}`}>{client.title}</Link></td>
                                    <td className="px-7 py-4 hidden md:block">{client.email}</td>
                                    <td className={`px-7 py-4 ${client.status} hidden md:block font-bold`}>{client.status?.toUpperCase()}</td>
                                    <td className={`px-7 py-4 ${client.maintenance ? 'text-[#eae8e0] font-bold' : ''} hidden md:block text-right`}>{client.maintenance}</td>
                                    <td className="text-[#eae8e0] font-bold px-7 py-4 text-right">kr {formatNumber(client.revenue)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
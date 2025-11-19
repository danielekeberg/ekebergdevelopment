'use client';
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Spinner from "@/app/components/Loader";

type Client = {
  id: number;
  name: string | null;
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
        <div className="flex flex-col gap-10">
            {loading && (
                <div className="h-[90vh] flex justify-center items-center">
                    <Spinner />
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-8">
                <div className="border border-neutral-500/30 p-5 rounded-xl bg-white shadow">
                    <div className="flex justify-between items-center">
                        <p className="text-neutral-600 font-bold">Total Clients</p>
                        <img src="users-b.svg" className="h-6 w-6" />
                    </div>
                    <h1 className="text-4xl font-bold">{formatNumber(stats.totalClients)}</h1>
                    <p className="text-sm text-neutral-600">+{stats.newThisMonth} this month</p>
                </div>
                <div className="border border-neutral-500/30 p-5 rounded-xl bg-white shadow">
                    <div className="flex justify-between items-center">
                        <p className="text-neutral-600 font-bold">Active Projects</p>
                        <img src="folder.svg" className="h-6 w-6" />
                    </div>
                    <h1 className="text-4xl font-bold">{formatNumber(stats.activeProjects)}</h1>
                    <p className="text-sm text-neutral-600">Across all clients</p>
                </div>
                <div className="border border-neutral-500/30 p-5 rounded-xl bg-white shadow">
                    <div className="flex justify-between items-center">
                        <p className="text-neutral-600 font-bold">Total Revenue</p>
                        <img src="pricing-b.svg" className="h-6 w-6" />
                    </div>
                    <h1 className="text-4xl font-bold">kr {formatNumber(stats.totalRevenue)}</h1>
                    <p className="text-sm text-neutral-600">Year to date</p>
                </div>
                <div className="border border-neutral-500/30 p-5 rounded-xl bg-white shadow">
                    <div className="flex justify-between items-center">
                        <p className="text-neutral-600 font-bold">Maintenance Clients</p>
                        <img src="maintenance-b.svg" className="h-6 w-6" />
                    </div>
                    <h1 className="text-4xl font-bold">{formatNumber(stats.maintenanceClients)}</h1>
                    <p className="text-sm text-neutral-600">Recurring revenue</p>
                </div>
            </div>
            <div>
                <h1 className="text-4xl font-bold mb-5">Recent Clients</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {clients.map((client) => (
                        <div key={client.id} className="border flex justify-between items-center group bg-white shadow-sm hover:shadow-md transition-shadow duration-300 border-neutral-500/30 p-5 rounded-xl cursor-pointer">
                            <div>
                                <div className="flex gap-5 items-center">
                                    <p className="text-2xl font-bold group-hover:text-blue-500 transition duration-150">{client.name}</p>
                                    <p className={`hidden md:block px-2 rounded-full text-sm ${client.status}`}>{client.status}</p>
                                </div>
                                <p className="text-neutral-700">{client.email}</p>
                                <div className="flex gap-5 items-center mt-5 text-neutral-700">
                                    <p>{client.projects} project{client.projects !== 1 ? "s" : ""}</p>
                                    <p className="text-blue-500 text-xl font-bold">kr {formatNumber(client.revenue)}</p>
                                </div>
                            </div>
                            <div>
                                <img src="/arrow.svg" className="h-8 w-8 hover:bg-blue-500 p-2 rounded-full" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
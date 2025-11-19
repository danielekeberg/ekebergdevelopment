'use client';
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Spinner from "@/app/components/Loader";

type Client = {
    id: number;
    name: string;
    email: string | null;
    projects: number | null;
    status: string | null;
    maintenance: string | null;
    pages: number | null;
    created_at: string;
    revenue: number;
};

export default function Clients() {
    const [clients, setClients] = useState<Client[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState("");
    const [owner, setOwner] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [pages, setPages] = useState("");
    const [status, setStatus] = useState("");
    const [projects, setProjects] = useState("");
    const [maintenance, setMaintenance] = useState("");
    const [revenue, setRevenue] = useState("");
    const [org, setOrg] = useState("");


    const toggleAdd = () => {
        setIsOpen((prev) => !prev)
    }

    useEffect(() => {
        const fetchClients = async () => {
            setLoading(true)
            const { data, error } = await supabase
                .from("clients")
                .select("*");

            if(error) {
                console.error("Error fetching clients:", error);
                setLoading(false);
                return;
            }

            const clients = (data || []) as Client[];
            const sorted = clients.toSorted((a, b) => a.name.localeCompare(b.name))
            setClients(sorted);
        }
        fetchClients()
        setLoading(false);
    }, [])

    const addClient = async (e:any) => {
        e.preventDefault();
        if(!name.trim()) return;

        const {data, error} = await supabase
            .from("clients")
            .insert({ 
                name,
                owner,
                phone,
                org,
                email,
                projects: 2,
                status: "active",
                maintenance: "true",
                pages,
                revenue,
             })
            .select()
            .single()
        if(error) {
            console.error("Feil ved lagring:", error);
            return;
        }
        setClients(prev => [data as Client, ...prev]);
    }

    const formatNumber = (value:number) => {
        return new Intl.NumberFormat("no-NO").format(value);
    }

    return(
        <>
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold">Clients</h1>
                    <p className="text-neutral-600">Manage your client relationships</p>
                </div>
                <button onClick={toggleAdd} className="bg-blue-500 py-2 px-5 rounded-full flex gap-2 text-white font-bold cursor-pointer hover:bg-blue-500/80 items-center">
                    <img src="/add.svg" className="h-5 w-5" />
                    <p>New Client</p>
                </button>
            </div>
            {isOpen && (
                <>
                    <form onSubmit={addClient} className="p-10 flex flex-col gap-5">
                        <div className="flex flex-col">
                                <label>Business Name</label>
                                <input type="text" placeholder="Business Name" id="name" onChange={(e) => setName(e.target.value)} className="w-full border border-neutral-500/50 rounded-md p-2" />
                            </div>
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div className="flex flex-col">
                                <label>Owner Name</label>
                                <input type="text" placeholder="Owner Name" id="owner" onChange={(e) => setOwner(e.target.value)} className="w-full border border-neutral-500/50 rounded-md p-2" />
                            </div>
                            <div className="flex flex-col">
                                <label>Phone Number</label>
                                <input type="number" placeholder="Phone number" id="phone" onChange={(e) => setPhone(e.target.value)} className="w-full border border-neutral-500/50 rounded-md p-2" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div className="flex flex-col">
                                <label>Email</label>
                                <input type="email" placeholder="Email" id="email" onChange={(e) => setEmail(e.target.value)} className="w-full border border-neutral-500/50 rounded-md p-2" />
                            </div>
                            <div className="flex flex-col">
                                <label>Pages</label>
                                <input type="number" placeholder="Pages" id="pages" onChange={(e) => setPages(e.target.value)} className="w-full border border-neutral-500/50 rounded-md p-2" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div className="flex flex-col">
                                <label>Revenue</label>
                                <input type="number" placeholder="Revenue" id="revenue" onChange={(e) => setRevenue(e.target.value)} className="w-full border border-neutral-500/50 rounded-md p-2" />
                            </div>
                            <div className="flex flex-col">
                                <label>Org. Nr.</label>
                                <input type="number" placeholder="Org. Nr." id="org" onChange={(e) => setOrg(e.target.value)} className="w-full border border-neutral-500/50 rounded-md p-2" />
                            </div>
                        </div>
                        <div>
                            <select>
                                <option>Active</option>
                                <option>Completed</option>
                            </select>
                        </div>
                        <div className="flex gap-2 mt-5">
                            <button type="submit" className="py-2 px-3 rounded-full font-bold bg-blue-500 text-white cursor-pointer hover:bg-blue-500/80 border-neutral-300 border transition duration-300">Save Client </button>
                            <button onClick={toggleAdd} className="py-2 px-3 rounded-full font-bold bg-white cursor-pointer hover:bg-blue-500 border-neutral-300 hover:text-white border transition duration-300">Cancel</button>
                        </div>
                    </form>
                    
                </>
            )}
            {loading && (
                <Spinner />
            )}
            <div className="mt-10 grid grid-cols-3 gap-3">
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
                    </div>
                ))}
            </div>
        </>
    )
}
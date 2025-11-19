'use client';
import { useState, useEffect } from "react";
import Dashboard from "@/app/components/Dashboard";
import Notes from "@/app/components/Notes";
import Clients from "@/app/components/Clients";
import Projects from "@/app/components/Projects";
import Pricing from "@/app/components/Pricing";
import Login from "@/app/components/Login";

export default function Home() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [active, setIsActive] = useState("dashboard");
  const [loggedIn, setLoggedIn] = useState(false);

  const success = process.env.NEXT_PUBLIC_TEST;
  if(!success) {
      return;
  }

  const signout = () => {
    localStorage.clear();
    window.location.reload();
  }

  useEffect(() => {
    if(localStorage.getItem("token") === success) {
      setLoggedIn(true);
    }
  }, [])
  
  const toggleAside = () => {
    setIsOpen((prev) => !prev)
  }
  return (
    <div className="flex">
      {loggedIn ?
      <>
      <aside
        className={`bg-slate-900 text-white p-3 fixed flex flex-col items-start overflow-hidden left-0 z-[999] h-screen
        ${isOpen ? 'w-80' : 'w-20 md:w-20'}
        transition-[width] duration-300 ease-in-out text-[#e0e0e0]`}
      >
        <div className="flex flex-col items-center justify-between w-full overflow-hidden mb-6">
          <h1
            className={`font-bold whitespace-nowrap
            transition-all duration-300 text-xl
            ${isOpen ? 'opacity-100' : 'text-base opacity-0'}`}
          >
            EkebergDevelopment
          </h1>
          <p
            className={`whitespace-nowrap
            transition-all duration-300 text-sm
            ${isOpen ? 'opacity-50' : 'text-base opacity-0'}`}
          >
            Org.nr. 936 587 070
          </p>
        </div>

        <nav className="grid grid-cols-1 gap-2 text-sm w-full">
          {[
            { id: "dashboard", label: "Dashboard", icon: "/dashboard.svg" },
            { id: "clients", label: "Clients", icon: "/users.svg" },
            { id: "projects", label: "Projects", icon: "/projects.svg" },
            { id: "pricing", label: "Pricing", icon: "/pricing.svg" },
            { id: "maintenance", label: "Maintenance", icon: "/maintenance.svg" },
            { id: "notes", label: "Notes", icon: "/notes.svg" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setIsActive(item.id)}
              className="w-full text-left"
            >
              <div
                className={`flex gap-2 py-2 px-4 cursor-pointer hover:bg-[#141f38] hover:border-[#1b294b]
                items-center border rounded-full w-full
                ${
                  active === item.id
                    ? 'border-[#1b294b] bg-[#141f38] font-bold'
                    : 'border-transparent'
                }`}
              >
                <img src={item.icon} className="h-5 w-5" alt={item.label} />
                <p
                  className={`transition-all duration-200
                  ${
                    active === item.id
                      ? 'text-[#3c83f6]'
                      : 'text-[#e0e0e0]'
                  }
                  ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3 pointer-events-none'}
                  `}
                >
                  {item.label}
                </p>
              </div>
            </button>
          ))}
        </nav>
      </aside>

      <main
        className={`
          w-full
          ${isOpen ? 'ml-80' : 'ml-20'}
          transition-[margin] duration-300 ease-in-out
        `}
      >
        <div className="flex items-center border-b border-neutral-900/10 py-3 px-5 justify-between">
          <div className="flex justify-between w-full">
            <button onClick={toggleAside} className="cursor-pointer ml-5">
              <img src="/sidebar.svg" className="h-5 w-5" />
            </button>
            <button onClick={signout} className="cursor-pointer ml-5">
              <img src="/sidebar.svg" className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-2 md:p-10 ">
          {active === "dashboard" ?
          <Dashboard />
          :
          null}
          {active === "notes" ?
          <Notes />
          :
          null}
          {active === "clients" ?
          <Clients />
          :
          null}
          {active === "projects" ?
          <Projects />
          :
          null}
          {active === "pricing" ?
          <Pricing />
          :
          null}
        </div>
      </main>
      </>
    :
      <>
      <Login />
      </>}
    </div>
  );
}

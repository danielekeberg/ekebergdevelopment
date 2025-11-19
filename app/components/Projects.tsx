export default function Projects() {
    return(
        <>
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold">Projects</h1>
                    <p className="text-neutral-600">Track your ongoing work</p>
                </div>
                <button className="bg-blue-500 py-2 px-5 rounded-full flex gap-2 text-white font-bold cursor-pointer hover:bg-blue-500/80 items-center">
                    <img src="/add.svg" className="h-5 w-5" />
                    <p>New Project</p>
                </button>
            </div>
        </>
    )
}
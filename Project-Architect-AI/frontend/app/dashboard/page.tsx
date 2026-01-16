export default function Dashboard() {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">Project Architect AI</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border p-4 rounded-lg">AI Planning Chat</div>
                <div className="border p-4 rounded-lg">Architecture Visualization</div>
            </div>
        </div>
    );
}
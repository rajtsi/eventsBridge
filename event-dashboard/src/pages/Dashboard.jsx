import { useState } from "react";
import Stats from "../components/Stats";
import EventForm from "../components/EventForm";

export default function Dashboard() {
    const [range, setRange] = useState("1h");

    const handleRefresh = () => {
        window.dispatchEvent(new Event("dataChanged"));
    };

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Dashboard</h1>

                <div className="flex items-center gap-3">

                    {/* RANGE */}
                    <select
                        value={range}
                        onChange={(e) => setRange(e.target.value)}
                        className="border px-3 py-2 rounded-lg shadow-sm"
                    >
                        <option value="1h">1 Hour</option>
                        <option value="24h">24 Hours</option>
                        <option value="7d">7 Days</option>
                    </select>

                    {/* REFRESH */}
                    <button
                        onClick={handleRefresh}
                        className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-lg shadow-sm flex items-center gap-1"
                    >
                        ⟳ Refresh
                    </button>
                </div>
            </div>

            {/* STATS */}
            <Stats range={range} />

            {/* EVENT FORM */}
            <div className="bg-white p-6 rounded-2xl shadow">
                <EventForm />
            </div>
        </div>
    );
}
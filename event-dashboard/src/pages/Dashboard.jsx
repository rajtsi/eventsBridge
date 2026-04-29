import { useState } from "react";
import Stats from "../components/Stats";
import EventForm from "../components/EventForm";

export default function Dashboard() {
    const [range, setRange] = useState("1h");

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Dashboard</h1>

                <select
                    value={range}
                    onChange={(e) => setRange(e.target.value)}
                    className="border px-3 py-2 rounded-lg shadow-sm"
                >
                    <option value="1h">1 Hour</option>
                    <option value="24h">24 Hours</option>
                    <option value="7d">7 Days</option>
                </select>
            </div>

            <Stats range={range} />

            <div className="bg-white p-6 rounded-2xl shadow">
                <EventForm />
            </div>
        </div>
    );
}
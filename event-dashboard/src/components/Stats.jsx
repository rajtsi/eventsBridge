import { useEffect, useState } from "react";
import API from "../api/api";

const getRange = (range) => {
    const now = new Date();
    let from;

    if (range === "1h") from = new Date(now - 60 * 60 * 1000);
    if (range === "24h") from = new Date(now - 24 * 60 * 60 * 1000);
    if (range === "7d") from = new Date(now - 7 * 24 * 60 * 60 * 1000);

    return { from, to: now };
};

export default function Stats({ range }) {
    const [events, setEvents] = useState([]);

    const fetchData = async () => {
        const { from, to } = getRange(range);

        const res = await API.get("/events", {
            params: { from, to }
        });

        setEvents(res.data.events || []);
    };

    useEffect(() => {
        fetchData();
    }, [range]);

    return (
        <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl shadow">
                <p className="text-gray-500">Total Events</p>
                <p className="text-2xl font-bold">{events.length}</p>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow">
                <p className="text-gray-500">Success</p>
                <p className="text-2xl font-bold text-green-600">
                    {events.filter(e => e.status === "success").length}
                </p>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow">
                <p className="text-gray-500">Failed</p>
                <p className="text-2xl font-bold text-red-600">
                    {events.filter(e => e.status === "failed").length}
                </p>
            </div>
        </div>
    );
}
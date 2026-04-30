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

export default function EventList({ range }) {
    const [events, setEvents] = useState([]);

    const fetchEvents = async () => {
        const { from, to } = getRange(range);

        const res = await API.get("/events", {
            params: { from, to, page: 1, limit: 10 }
        });

        setEvents(res.data.events || []);
    };

    useEffect(() => {
        fetchEvents();
    }, [range]);

    return (
        <div className="border p-4">
            <h2 className="font-bold mb-2">Recent Events</h2>

            {events.map((e) => (
                <div key={e.id}>
                    {e.type} - {new Date(e.createdAt).toLocaleString()}
                </div>
            ))}
        </div>
    );
}
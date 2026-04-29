import { useEffect, useState } from "react";
import API from "../api/api";

export default function EventsPage() {
    const [events, setEvents] = useState([]);
    const [page, setPage] = useState(1);

    const fetchEvents = async () => {
        const res = await API.get("/events", {
            params: { page, limit: 10 }
        });

        setEvents(res.data.events);
    };

    useEffect(() => {
        fetchEvents();
    }, [page]);

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Events</h1>

            <div className="bg-white rounded-2xl shadow divide-y">
                {events.map((e) => (
                    <div key={e.id} className="p-4 flex justify-between">
                        <div>
                            <p className="font-medium">{e.type}</p>
                            <p className="text-sm text-gray-500">
                                {new Date(e.createdAt).toLocaleString()}
                            </p>
                        </div>

                        <span className="text-xs px-2 py-1 rounded bg-gray-200">
                            {e.status || "created"}
                        </span>
                    </div>
                ))}
            </div>

            <div className="flex gap-2">
                <button
                    onClick={() => setPage(p => p - 1)}
                    disabled={page === 1}
                    className="px-3 py-1 bg-gray-300 rounded"
                >
                    Prev
                </button>

                <button
                    onClick={() => setPage(p => p + 1)}
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
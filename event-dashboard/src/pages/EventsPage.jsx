import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

const getRange = (range) => {
    const now = new Date();
    let from;

    if (range === "5m") from = new Date(now - 5 * 60 * 1000);
    if (range === "1h") from = new Date(now - 60 * 60 * 1000);
    if (range === "24h") from = new Date(now - 24 * 60 * 60 * 1000);
    if (range === "7d") from = new Date(now - 7 * 24 * 60 * 60 * 1000);

    return { from, to: now };
};

export default function EventsPage() {
    const [events, setEvents] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [range, setRange] = useState("1h");
    const navigate = useNavigate();
    const limit = 10;

    const fetchEvents = async () => {
        const { from, to } = getRange(range);

        const res = await API.get("/events", {
            params: {
                from,
                to,
                page,
                limit
            }
        });

        setEvents(res.data.events || []);
        setTotal(res.data.total || 0);
    };

    useEffect(() => {
        fetchEvents();
    }, [page, range]);

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="space-y-4">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Events</h1>

                {/* RANGE SELECTOR */}
                <select
                    value={range}
                    onChange={(e) => {
                        setPage(1); // reset page on range change
                        setRange(e.target.value);
                    }}
                    className="border px-3 py-2 rounded-lg shadow-sm"
                >
                    <option value="5m">Last 5 min</option>
                    <option value="1h">Last 1 hour</option>
                    <option value="24h">Last 24 hours</option>
                    <option value="7d">Last 7 days</option>
                </select>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-2xl shadow overflow-hidden">
                {events.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">
                        <p className="text-lg font-medium">
                            No events found
                        </p>
                        <p className="text-sm">
                            Try changing the time range
                        </p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 text-left">
                            <tr>
                                <th className="p-3">Type</th>
                                <th className="p-3">Created</th>
                                <th className="p-3">Event ID</th>
                                <th className="p-3">Watch Linked Deliveries</th>
                            </tr>
                        </thead>

                        <tbody>
                            {events.map((e) => (
                                <tr key={e.id} className="border-t hover:bg-gray-50">
                                    <td className="p-3 font-medium">{e.type}</td>

                                    <td className="p-3 text-gray-600">
                                        {new Date(e.createdAt).toLocaleString()}
                                    </td>

                                    <td className="p-3 text-xs text-gray-400">
                                        {e.id}
                                    </td>

                                    <td className="p-3">
                                        <button
                                            onClick={() => navigate(`/events/${e.id}`)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* PAGINATION */}
            {events.length > 0 && (
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                        Page {page} of {totalPages || 1}
                    </span>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage((p) => p - 1)}
                            disabled={page === 1}
                            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                        >
                            Prev
                        </button>

                        <button
                            onClick={() => setPage((p) => p + 1)}
                            disabled={page >= totalPages}
                            className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
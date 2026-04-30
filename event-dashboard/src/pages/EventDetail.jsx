import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";

export default function EventDetail() {
    const { id } = useParams();

    const [event, setEvent] = useState(null);
    const [deliveries, setDeliveries] = useState([]);

    const fetchData = async () => {
        const eventRes = await API.get(`/events/${id}`);
        setEvent(eventRes.data);

        const delRes = await API.get("/deliveries", {
            params: { eventId: id }
        });

        setDeliveries(delRes.data.rows || []);
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    return (
        <div className="space-y-6">

            {/* EVENT INFO */}
            <div className="bg-white p-4 rounded shadow">
                <h2 className="font-bold text-lg">Event Details</h2>

                {event && (
                    <div className="mt-2 text-sm">
                        <p><b>Type:</b> {event.type}</p>
                        <p><b>ID:</b> {event.id}</p>
                        <p><b>Created:</b> {new Date(event.createdAt).toLocaleString()}</p>
                    </div>
                )}
            </div>

            {/* DELIVERIES TABLE */}
            <div className="bg-white rounded shadow overflow-hidden">
                <h2 className="font-bold p-4 border-b">Deliveries</h2>

                {deliveries.length === 0 ? (
                    <div className="p-6 text-gray-500 text-center">
                        No deliveries found for this event
                    </div>
                ) : (
                    <table className="w-full text-sm table-fixed">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 text-left w-1/4">Delivery ID</th>
                                <th className="p-3 text-left w-1/6">Status</th>
                                <th className="p-3 text-left w-1/6">Attempts</th>
                                <th className="p-3 text-left">Error</th>
                            </tr>
                        </thead>

                        <tbody>
                            {deliveries.map((d) => (
                                <tr key={d.id} className="border-t hover:bg-gray-50">
                                    <td className="p-3 text-xs text-gray-600 truncate">
                                        {d.id}
                                    </td>

                                    <td className="p-3">
                                        <span
                                            className={`px-2 py-1 rounded text-xs ${d.status === "success"
                                                    ? "bg-green-100 text-green-600"
                                                    : d.status === "failed"
                                                        ? "bg-red-100 text-red-600"
                                                        : "bg-gray-200 text-gray-600"
                                                }`}
                                        >
                                            {d.status}
                                        </span>
                                    </td>

                                    <td className="p-3">{d.attemptCount}</td>

                                    <td className="p-3 text-xs text-red-500 truncate">
                                        {d.response?.error || "-"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
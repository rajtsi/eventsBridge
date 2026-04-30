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

export default function DeliveriesPage() {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [range, setRange] = useState("1h");

    const limit = 10;

    const fetchData = async () => {
        const { from, to } = getRange(range);

        const res = await API.get("/deliveries", {
            params: {
                page,
                limit,
                from,
                to
            }
        });

        setData(res.data.rows || []);
        setTotal(res.data.count || 0);
    };

    useEffect(() => {
        fetchData();
    }, [page, range]);

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="space-y-4">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Deliveries</h1>

                <select
                    value={range}
                    onChange={(e) => {
                        setPage(1);
                        setRange(e.target.value);
                    }}
                    className="border px-3 py-2 rounded-lg shadow-sm"
                >
                    <option value="1h">Last 1 hour</option>
                    <option value="24h">Last 24 hours</option>
                    <option value="7d">Last 7 days</option>
                </select>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-2xl shadow overflow-hidden">
                {data.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">
                        <p className="text-lg font-medium">
                            No deliveries found
                        </p>
                        <p className="text-sm">
                            Try changing the time range
                        </p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 text-left">
                            <tr>
                                <th className="p-3">Delivery ID</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Attempts</th>
                                <th className="p-3">Created</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.map((d) => (
                                <tr key={d.id} className="border-t hover:bg-gray-50">
                                    <td className="p-3 text-xs text-gray-500">
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

                                    <td className="p-3 text-gray-600">
                                        {new Date(d.createdAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* PAGINATION */}
            {data.length > 0 && (
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
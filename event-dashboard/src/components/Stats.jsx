import { useEffect, useState } from "react";
import API from "../api/api";

export default function Stats({ range }) {
    const [stats, setStats] = useState({
        events: 0,
        deliveries: 0,
        success: 0,
        failed: 0
    });

    const fetchStats = async () => {
        try {
            // ✅ directly use window param
            const res = await API.get("/stats", {
                params: { window: range }
            });

            // adjust if your API wraps response differently
            setStats({
                events: res.data.totalEvents || 0,
                deliveries: res.data.totalDeliveries || 0,
                success: res.data.success || 0,
                failed: res.data.failed || 0
            });

        } catch (err) {
            console.error("Stats fetch failed", err);
        }
    };

    useEffect(() => {
        fetchStats();

        const handler = () => {
            fetchStats();
        };

        window.addEventListener("dataChanged", handler);

        return () => {
            window.removeEventListener("dataChanged", handler);
        };
    }, [range]);

    return (
        <div className="grid grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl shadow">
                <p className="text-gray-500">Total Events</p>
                <p className="text-2xl font-bold">{stats.events}</p>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow">
                <p className="text-gray-500">Total Deliveries</p>
                <p className="text-2xl font-bold">{stats.deliveries}</p>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow">
                <p className="text-gray-500">Success</p>
                <p className="text-2xl font-bold text-green-600">
                    {stats.success}
                </p>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow">
                <p className="text-gray-500">Failed</p>
                <p className="text-2xl font-bold text-red-600">
                    {stats.failed}
                </p>
            </div>
        </div>
    );
}
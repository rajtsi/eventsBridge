import { useEffect, useState } from "react";
import API from "../api/api";

export default function DLQPage() {
    const [jobs, setJobs] = useState([]);

    const fetchDLQ = async () => {
        const res = await API.get("/dlq");



        // ✅ FIX: use rows
        setJobs(res.data.rows || []);
    };

    const retry = async (id) => {
        await API.post(`/dlq/${id}/retry`);
    };

    useEffect(() => {
        fetchDLQ();

        const i = setInterval(fetchDLQ, 3000);

        return () => clearInterval(i);
    }, []);

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Dead Letter Queue</h1>

            <div className="bg-white rounded-2xl shadow divide-y">
                {jobs.length === 0 ? (
                    <div className="p-4 text-gray-500 text-center">
                        No failed jobs 🎉
                    </div>
                ) : (
                    jobs.map((j) => (
                        <div
                            key={j.id}
                            className="p-4 flex justify-between items-center"
                        >
                            <span className="text-sm">
                                {j.id}
                            </span>
                            <span>Id: {j.deliveryId}</span>


                            <button
                                onClick={() => retry(j.id)}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                            >
                                Retry
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
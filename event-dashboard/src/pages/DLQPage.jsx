import { useEffect, useState } from "react";
import API from "../api/api";
import Toast from "../components/Toast";

export default function FailedJobsPage() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const fetchDLQ = async () => {
        try {
            setLoading(true);
            const res = await API.get("/dlq");
            setJobs(res.data.rows || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const retry = async (id) => {
        try {
            await API.post(`/dlq/${id}/retry`);

            setToast({
                message: "Retry triggered successfully",
                type: "success"
            });

            // ✅ refresh after retry
            fetchDLQ();

        } catch (err) {
            setToast({
                message: err.response?.data?.error || "Retry failed",
                type: "error"
            });
        }
    };

    useEffect(() => {
        fetchDLQ();
        window.dispatchEvent(new Event("dataChanged"));
    }, []);

    return (
        <div className="space-y-4">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Failed Jobs</h1>

                <button
                    onClick={fetchDLQ}
                    className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-lg shadow-sm flex items-center gap-1"
                >
                    ⟳ Refresh
                </button>
            </div>

            {/* LIST */}
            <div className="bg-white rounded-2xl shadow divide-y">

                {loading && (
                    <div className="p-4 text-center text-gray-500">
                        Loading...
                    </div>
                )}

                {!loading && jobs.length === 0 && (
                    <div className="p-4 text-gray-500 text-center">
                        No failed jobs 🎉
                    </div>
                )}

                {!loading &&
                    jobs.map((j) => (
                        <div
                            key={j.id}
                            className="p-4 flex justify-between items-center gap-4"
                        >
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500">
                                    Job ID
                                </span>
                                <span className="text-sm font-medium">
                                    {j.id}
                                </span>
                            </div>

                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500">
                                    Delivery ID
                                </span>
                                <span className="text-sm">
                                    {j.deliveryId}
                                </span>
                            </div>

                            <div className="flex flex-col max-w-xs">
                                <span className="text-xs text-gray-500">
                                    Error
                                </span>
                                <span className="text-sm text-red-500 truncate">
                                    {j.error}
                                </span>
                            </div>

                            <button
                                onClick={() => retry(j.id)}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                            >
                                Retry
                            </button>
                        </div>
                    ))}
            </div>

            {/* TOAST */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}
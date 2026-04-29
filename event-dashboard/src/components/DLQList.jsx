import { useEffect, useState } from "react";
import API from "../api/api";

export default function DLQList() {
    const [jobs, setJobs] = useState([]);

    const fetchDLQ = async () => {
        const res = await API.get("/dlq");
        setJobs(res.data || []);
    };

    const retry = async (id) => {
        await API.post(`/dlq/retry/${id}`);
    };

    useEffect(() => {
        fetchDLQ();

        const interval = setInterval(fetchDLQ, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="border p-4">
            <h2 className="font-bold mb-2">DLQ</h2>

            {jobs.map((j) => (
                <div key={j.id}>
                    {j.id}
                    <button onClick={() => retry(j.id)}>Retry</button>
                </div>
            ))}
        </div>
    );
}
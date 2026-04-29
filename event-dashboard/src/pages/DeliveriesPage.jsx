import { useEffect, useState } from "react";
import API from "../api/api";

export default function DeliveriesPage() {
    const [data, setData] = useState([]);

    const fetchData = async () => {
        const res = await API.get("/deliveries");
        setData(res.data.rows);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Deliveries</h1>

            <div className="bg-white p-4 rounded shadow">
                {data.map((d) => (
                    <div key={d.id} className="border-b py-2">
                        <div>Status: {d.status}</div>
                        <div>Attempts: {d.attemptCount}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
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

export default function DeliveryList({ range }) {
    const [deliveries, setDeliveries] = useState([]);

    const fetchDeliveries = async () => {
        const { from, to } = getRange(range);

        const res = await API.get("/deliveries", {
            params: { from, to }
        });

        setDeliveries(res.data.rows || []);
    };

    useEffect(() => {
        fetchDeliveries();
    }, [range]);

    return (
        <div className="border p-4">
            <h2 className="font-bold mb-2">Deliveries</h2>

            {deliveries.map((d) => (
                <div key={d.id}>
                    {d.status} - attempts: {d.attemptCount}
                </div>
            ))}
        </div>
    );
}
import { useEffect } from "react";

export default function Toast({ message, type = "success", onClose }) {
    useEffect(() => {
        const t = setTimeout(onClose, 3000);
        return () => clearTimeout(t);
    }, []);

    return (
        <div
            className={`fixed top-5 right-5 px-4 py-2 rounded shadow-lg text-white ${type === "success" ? "bg-green-500" : "bg-red-500"
                }`}
        >
            {message}
        </div>
    );
}
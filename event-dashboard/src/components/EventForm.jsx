import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "./Toast";
import API from "../api/api";

export default function EventForm() {
    const [eventTypes, setEventTypes] = useState({});
    const [type, setType] = useState("");
    const [payload, setPayload] = useState({});
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const [toast, setToast] = useState(null);

    // ✅ NEW: services preview
    const [services, setServices] = useState([]);
    const [loadingServices, setLoadingServices] = useState(false);

    // ---------------- FETCH TYPES ----------------
    useEffect(() => {
        fetchTypes();
    }, []);

    const fetchTypes = async () => {
        const res = await API.get("/event-types");

        const map = {};
        res.data.forEach((e) => {
            map[e.name] = e;
        });

        setEventTypes(map);
    };

    // ---------------- FETCH SERVICES ----------------
    const fetchServices = async (eventType) => {
        if (!eventType) {
            setServices([]);
            return;
        }

        try {
            setLoadingServices(true);

            const res = await API.get("/subscriptions", {
                params: { eventType }
            });

            setServices(res.data || []);
        } catch (err) {
            console.error("Failed to fetch services", err);
        } finally {
            setLoadingServices(false);
        }
    };

    useEffect(() => {
        fetchServices(type);
    }, [type]);

    // ---------------- HANDLE INPUT ----------------
    const handleChange = (field, value) => {
        setPayload((prev) => ({
            ...prev,
            [field]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [field]: "",
        }));
    };

    // ---------------- VALIDATION ----------------
    const validate = () => {
        const newErrors = {};

        if (!type) {
            newErrors.type = "Event type is required";
            return newErrors;
        }

        const fields = eventTypes[type]?.fields || {};

        for (const key in fields) {
            const rule = fields[key];
            const value = payload[key];

            if (rule.required && (!value || value === "")) {
                newErrors[key] = "Required";
                continue;
            }

            if (value) {
                if (rule.type === "number" && isNaN(Number(value))) {
                    newErrors[key] = "Must be a number";
                }

                if (rule.type === "email") {
                    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!regex.test(value)) {
                        newErrors[key] = "Invalid email";
                    }
                }
            }
        }

        return newErrors;
    };

    // ---------------- CREATE EVENT ----------------
    const createEvent = async () => {
        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const res = await API.post("/events", {
                type,
                payload,
            });

            setToast({ message: "Event created successfully", type: "success" });

            window.dispatchEvent(new Event("dataChanged"));

            setPayload({});
            setType("");
            setErrors({});
            setServices([]);

        } catch (err) {
            setToast({
                message: err.response?.data?.error || "Failed to create event",
                type: "error"
            });
        }
    };

    const current = eventTypes[type];

    // ---------------- UI ----------------
    return (
        <div className="space-y-4">

            {/* ================= FORM ================= */}
            <div className="bg-white p-4 rounded shadow">
                <h2 className="font-bold mb-4">Create Event</h2>

                {/* EVENT TYPE */}
                <select
                    className={`border p-2 w-full mb-2 ${errors.type ? "border-red-500" : ""}`}
                    value={type}
                    onChange={(e) => {
                        setType(e.target.value);
                        setPayload({});
                        setErrors({});
                    }}
                >
                    <option value="">Select Event Type</option>
                    {Object.keys(eventTypes).map((t) => (
                        <option key={t}>{t}</option>
                    ))}
                </select>

                {errors.type && (
                    <p className="text-red-500 text-sm mb-2">{errors.type}</p>
                )}

                {/* FIELDS */}
                {current?.fields &&
                    Object.keys(current.fields).map((field) => {
                        const rule = current.fields[field];

                        return (
                            <div key={field}>
                                <input
                                    type={
                                        rule.type === "number"
                                            ? "number"
                                            : rule.type === "email"
                                                ? "email"
                                                : "text"
                                    }
                                    className={`border p-2 w-full mb-1 ${errors[field] ? "border-red-500" : ""}`}
                                    placeholder={`${field} ${rule.required ? "(required)" : "(optional)"}`}
                                    value={payload[field] || ""}
                                    onChange={(e) =>
                                        handleChange(field, e.target.value)
                                    }
                                />

                                {errors[field] && (
                                    <p className="text-red-500 text-sm mb-2">
                                        {errors[field]}
                                    </p>
                                )}
                            </div>
                        );
                    })}

                {/* BUTTON */}
                <button
                    onClick={createEvent}
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                >
                    Create Event
                </button>
            </div>

            {/* ================= SERVICE PREVIEW ================= */}
            <div className="bg-white p-4 rounded shadow">
                <h2 className="font-semibold mb-3">Subscribed Services</h2>

                {!type && (
                    <p className="text-sm text-gray-500">
                        Select event type to see services
                    </p>
                )}

                {loadingServices && (
                    <p className="text-sm text-gray-500">
                        Loading services...
                    </p>
                )}

                {!loadingServices && type && services.length === 0 && (
                    <p className="text-sm text-gray-500">
                        No active services for this event
                    </p>
                )}

                {!loadingServices && services.length > 0 && (
                    <div className="grid grid-cols-2 gap-3">
                        {services.map((s) => (
                            <div
                                key={s.id}
                                className="border rounded-lg p-3 hover:shadow-sm"
                            >
                                <p className="font-medium">
                                    {s.service.name}
                                </p>

                                <p className="text-xs text-gray-500 truncate">
                                    {s.service.baseUrl}
                                </p>

                                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded mt-1 inline-block">
                                    Active
                                </span>
                            </div>
                        ))}
                    </div>
                )}
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
            </div>
        </div>
    );
}
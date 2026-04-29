import { useEffect, useState } from "react";
import API from "../api/api";

export default function EventForm() {
    const [eventTypes, setEventTypes] = useState({});
    const [type, setType] = useState("");
    const [payload, setPayload] = useState({});
    const [errors, setErrors] = useState({}); // ✅ NEW

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

    // ---------------- HANDLE INPUT ----------------
    const handleChange = (field, value) => {
        setPayload((prev) => ({
            ...prev,
            [field]: value,
        }));

        // clear error on typing
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

            // required
            if (rule.required && (!value || value === "")) {
                newErrors[key] = "Required";
                continue;
            }

            // type validation
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
            await API.post("/events", {
                type,
                payload,
            });

            // reset
            setPayload({});
            setType("");
            setErrors({});
        } catch (err) {
            alert(err.response?.data?.error || "Error creating event");
        }
    };

    const current = eventTypes[type];

    // ---------------- UI ----------------
    return (
        <div className="bg-white p-4 rounded shadow">
            <h2 className="font-bold mb-4">Create Event</h2>

            {/* EVENT TYPE */}
            <select
                className={`border p-2 w-full mb-2 ${errors.type ? "border-red-500" : ""
                    }`}
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
                                className={`border p-2 w-full mb-1 ${errors[field] ? "border-red-500" : ""
                                    }`}
                                placeholder={`${field} ${rule.required ? "(required)" : "(optional)"
                                    }`}
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
    );
}
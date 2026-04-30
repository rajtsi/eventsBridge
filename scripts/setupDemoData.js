import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:3000",
});

// ---------------- EVENT TYPES ----------------
const eventTypes = [
    {
        name: "payment.created",
        fields: {
            amount: { type: "number", required: true },
            currency: { type: "string", required: false },
        },
    },
    {
        name: "order.created",
        fields: {
            orderId: { type: "string", required: true },
            PhoneNo: { type: "number", required: true },
            userId: { type: "string", required: false },
        },
    },
    {
        name: "user.signup",
        fields: {
            user: { type: "string", required: true },
            emailId: { type: "email", required: true },
            age: { type: "number", required: true },
            referral: { type: "string", required: false },
        },
    },
    {
        name: "payment.failed",
        fields: {
            amount: { type: "number", required: true },
            reason: { type: "string", required: true },
        },
    },
    {
        name: "order.cancelled",
        fields: {
            orderId: { type: "string", required: true },
            reason: { type: "string", required: false },
        },
    },
];

// ---------------- SERVICES ----------------
const services = [
    {
        name: "payment-service",
        baseUrl: "http://localhost:3000/webhook/payment",
        secret: "payment-secret",
    },
    {
        name: "email-service",
        baseUrl: "http://localhost:3000/webhook/email",
        secret: "email-secret",
    },
    {
        name: "analytics-service",
        baseUrl: "http://localhost:3000/webhook/analytics",
        secret: "analytics-secret",
    },
    {
        name: "notification-service",
        baseUrl: "http://localhost:3000/webhook/notification",
        secret: "notification-secret",
    },
];

// ---------------- MAIN ----------------
const run = async () => {
    try {
        console.log("🚀 START SETUP\n");

        // ---------- EVENT TYPES ----------
        console.log("📌 Creating Event Types...");
        for (const e of eventTypes) {
            try {
                const res = await API.post("/event-types", e);
                console.log(`✔ Created: ${e.name}`, res.data.id);
            } catch {
                console.log(`⚠️ Exists: ${e.name}`);
            }
        }

        // ---------- SERVICES ----------
        console.log("\n📌 Creating / Fetching Services...");
        const serviceMap = {};

        for (const s of services) {
            let service;

            try {
                const res = await API.post("/services", s);
                service = res.data.data;
                console.log(`✔ Created: ${s.name} → ${service.id}`);
            } catch {
                console.log(`⚠️ Exists, fetching: ${s.name}`);

                const all = await API.get("/services");
                const list = all.data.rows || all.data.data || all.data;

                service = list.find((x) => x.name === s.name);

                if (!service) {
                    throw new Error(`❌ Cannot resolve service: ${s.name}`);
                }

                console.log(`✔ Found: ${s.name} → ${service.id}`);
            }

            serviceMap[s.name] = service;
        }

        // ---------- SUBSCRIPTIONS ----------
        console.log("\n📌 Creating Subscriptions...");
        for (const serviceName in serviceMap) {
            const service = serviceMap[serviceName];

            for (const event of eventTypes) {
                try {
                    await API.post("/subscriptions", {
                        eventType: event.name,
                        serviceId: service.id,
                    });

                    console.log(`✔ ${event.name} → ${service.name}`);
                } catch {
                    console.log(`⚠️ Exists: ${event.name} → ${service.name}`);
                }
            }
        }

        // ---------- CLIENTS (MANUAL) ----------
        console.log("\n📌 Webhook Clients (Manual Step)");
        console.log(`
            Run this SQL in DB:

           INSERT INTO "WebhookClients" ("id", "clientId", "service", "secret", "createdAt", "updatedAt")
            VALUES
           (gen_random_uuid(), 'companyA', 'payment', 'payment-secret', NOW(), NOW()),
            (gen_random_uuid(), 'companyA', 'email', 'email-secret', NOW(), NOW()),
            (gen_random_uuid(), 'companyA', 'analytics', 'analytics-secret', NOW(), NOW()),
             (gen_random_uuid(), 'companyA', 'notification', 'notification-secret', NOW(), NOW());
            `);

        console.log("\n🎉 SETUP COMPLETE");

    } catch (err) {
        console.error("\n❌ SETUP FAILED:", err.response?.data || err.message);
    }
};

run();
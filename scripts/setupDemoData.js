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

// ---------------- CLIENTS ----------------
const clients = [
    { clientId: "companyA", service: "payment", secret: "payment-secret" },
    { clientId: "companyA", service: "email", secret: "email-secret" },
    { clientId: "companyA", service: "analytics", secret: "analytics-secret" },
    { clientId: "companyA", service: "notification", secret: "notification-secret" },
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
                console.log(`✔ Created eventType: ${e.name}`, res.data.id);
            } catch (err) {
                console.log(`⚠️ EventType exists: ${e.name}`);
            }
        }

        // ---------- SERVICES ----------
        console.log("\n📌 Creating / Fetching Services...");
        const serviceMap = {};

        for (const s of services) {
            let service = null;

            try {
                const res = await API.post("/services", s);
                service = res.data.data;   // 🔥 FIXED
                console.log(`✔ Created service: ${s.name} → ${service.id}`);
            } catch (err) {
                console.log(`⚠️ Service exists, fetching: ${s.name}`);

                const all = await API.get("/services");
                const list = all.data.rows || all.data.data || all.data;

                service = list.find((x) => x.name === s.name);

                if (!service) {
                    throw new Error(`❌ Cannot resolve service: ${s.name}`);
                }

                console.log(`✔ Found service: ${s.name} → ${service.id}`);
            }

            if (!service?.id) {
                throw new Error(`❌ Invalid service ID for ${s.name}`);
            }

            serviceMap[s.name] = service;
        }

        // ---------- SUBSCRIPTIONS ----------
        console.log("\n📌 Creating Subscriptions...");
        for (const serviceName in serviceMap) {
            const service = serviceMap[serviceName];

            for (const event of eventTypes) {
                console.log(`→ Linking ${event.name} → ${service.name} (${service.id})`);

                try {
                    await API.post("/subscriptions", {
                        eventType: event.name,
                        serviceId: service.id,
                    });

                    console.log(`✔ Subscribed: ${event.name} → ${service.name}`);
                } catch (err) {
                    console.log(
                        `⚠️ Subscription exists or failed: ${event.name} → ${service.name}`,
                        err.response?.data || err.message
                    );
                }
            }
        }

        // ---------- WEBHOOK CLIENTS ----------
        console.log("\n📌 Creating Webhook Clients...");
        for (const c of clients) {
            try {
                await API.post("/webhook-clients", c);
                console.log(`✔ Client created: ${c.clientId} (${c.service})`);
            } catch (err) {
                console.log(
                    `⚠️ Client exists: ${c.clientId} (${c.service})`
                );
            }
        }

        console.log("\n🎉 SETUP COMPLETE");
    } catch (err) {
        console.error("\n❌ SETUP FAILED:", err.response?.data || err.message);
    }
};

run();
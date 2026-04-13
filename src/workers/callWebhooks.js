import deliveryService from "../services/deliveryService.js";

async function callWebhooks(deliveries) {
    const CONCURRENCY = 5;
    const executing = new Set();

    for (const delivery of deliveries) {
        const p = deliveryService.processOneDelivery(delivery);

        executing.add(p);

        const clean = () => executing.delete(p);
        p.then(clean).catch(clean);

        if (executing.size >= CONCURRENCY) {
            console.log("Max concurrency reached, waiting...");
            await Promise.race(executing);
        }
    }

    await Promise.all(executing);
}
export default callWebhooks;
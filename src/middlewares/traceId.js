import crypto from "crypto";
import { asyncLocalStorage } from "../utils/als.js";

const traceIdMiddleWare = (req, res, next) => {
    const incomingTraceId = req.headers["x-trace-id"];
    const traceId = incomingTraceId || crypto.randomUUID();
    req.traceId = traceId;

    asyncLocalStorage.run({ traceId }, () => {
        Promise.resolve().then(next);
    });
};

export default traceIdMiddleWare;
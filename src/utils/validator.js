const isNumber = (value) => {
    return typeof value === "number" ||
        (typeof value === "string" && /^[0-9]+$/.test(value));
};

const isString = (value) => {
    return typeof value === "string";
};

const isEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

const typeValidators = {
    number: isNumber,
    string: isString,
    email: isEmail,
};

const validateType = (type, key, value) => {
    const validator = typeValidators[type];

    if (!validator) return; // ignore unknown types for now

    if (!validator(value)) {
        throw new Error(`${key} must be a ${type}`);
    }
};


const validateField = (rule, key, value) => {
    if (rule.required && (value === undefined || value === null || value === "")) {
        throw new Error(`Missing field: ${key}`);
    }

    if (value !== undefined) {
        validateType(rule.type, key, value);
    }
};


export { validateType, validateField };

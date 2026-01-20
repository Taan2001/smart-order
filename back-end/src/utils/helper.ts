// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isString = (str: any) => typeof str === "string";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isNumeric = (value: any): boolean => {
    return typeof value === "number" && Number.isFinite(value);
};

export const isValidNumber = (value: number | string) => {
    if (typeof value === "number") {
        return Number.isFinite(value);
    }

    if (typeof value === "string") {
        if (value.trim() === "") return false;
        return Number.isFinite(Number(value));
    }

    return false;
};

/**
 *
 * @param {string} phoneNumber -
 * @returns {Boolean} -
 */
export const isVietnamesePhoneNumber = (phoneNumber: string): boolean => {
    if (!phoneNumber || typeof phoneNumber !== "string" || phoneNumber.length !== 10) return false;
    return /^0[35789]\d{8}$/.test(phoneNumber);
};

export function isIntegerStringRegex(str: string): boolean {
    return /^[+-]?\d+$/.test(str.trim());
}

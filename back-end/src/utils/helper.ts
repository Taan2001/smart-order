// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isString = (str: any) => typeof str === "string";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isNumberic = (number: any) => typeof number === "number";

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

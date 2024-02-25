/**
 * 
 * @param enum_values 
 * @param value 
 * @returns value in enum type, or undefined if no match is found. Treats undefined value as empty string
 */
export const enumFromStringValue = <T>(enum_values: { [s: string]: T}, value?: string): T | undefined =>
    (Object.values(enum_values) as unknown as string[]).includes(value ?? "")
        ? value as unknown as T
        : undefined;

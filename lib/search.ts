export function normalizeCode(input: string) {
    return input.toUpperCase().replace(/[\s\-_]/g, "");
}
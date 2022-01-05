export { generateId };

// Use crypto api to generate random string of given length (in bytes)
// Note that characters are hex bytes - so string is twice as long as
// request length - but has 8 * len bits of entropy.
function generateId(bytes: number): string {
    let result = "";
    // Can't use map as it returns another Uint8Array instead of array
    // of strings.
    for (let byte of crypto.getRandomValues(new Uint8Array(bytes))) {
        result += byte.toString(16);
    }
    return result;
}

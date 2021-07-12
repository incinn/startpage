export function capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export function azStringClean(text: string): string {
    return text.replace(/[^a-zA-Z ]/gi, '');
}

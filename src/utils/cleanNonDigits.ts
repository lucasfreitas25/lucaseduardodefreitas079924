export const cleanNonDigits = (value: string | number | undefined | null) => {
    return String(value || '').replace(/\D/g, '');
};

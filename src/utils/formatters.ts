export const formatCPF = (value: string | number | undefined | null) => {
    const strValue = String(value || '');
    const numbers = strValue.replace(/\D/g, '');
    if (numbers.length <= 11) {
        return numbers
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return strValue.slice(0, 14);
};

export const formatTelefone = (value: string | number | undefined | null) => {
    const strValue = String(value || '');
    const numbers = strValue.replace(/\D/g, '');
    if (numbers.length <= 11) {
        return numbers
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2');
    }
    return strValue.slice(0, 15);
};

export const cleanNonDigits = (value: string | number | undefined | null) => {
    return String(value || '').replace(/\D/g, '');
};

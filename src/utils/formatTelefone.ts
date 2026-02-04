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

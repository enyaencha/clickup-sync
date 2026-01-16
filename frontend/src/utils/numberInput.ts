const formatNumberInput = (value: string): string => {
  if (value === '') return '';

  const raw = value.replace(/,/g, '');
  const isNegative = raw.startsWith('-');
  const cleaned = raw.replace(/[^0-9.]/g, '');
  const hasDot = cleaned.includes('.');
  const [integerPart, ...decimalParts] = cleaned.split('.');
  const decimalPart = decimalParts.join('');
  const integerDigits = integerPart.replace(/^0+(?=\d)/, '');
  const integerValue = integerDigits === '' ? '0' : integerDigits;
  const formattedInteger = Number(integerValue).toLocaleString('en-US');
  const sign = isNegative ? '-' : '';

  if (!hasDot) {
    return `${sign}${formattedInteger}`;
  }

  return `${sign}${formattedInteger}.${decimalPart}`;
};

const parseNumberInput = (value: string): number | null => {
  if (!value) return null;

  const cleaned = value.replace(/,/g, '').trim();
  if (cleaned === '' || cleaned === '-' || cleaned === '.') {
    return null;
  }

  const parsed = parseFloat(cleaned);
  return Number.isNaN(parsed) ? null : parsed;
};

export { formatNumberInput, parseNumberInput };

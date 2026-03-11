export const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    const raw = parts[0];
    const letters = raw.replace(/[^a-zA-Z]/g, "");

    if (/^[a-zA-Z]-$/.test(raw)) {
      const ch = raw[0];

      return (ch + ch).toUpperCase();
    }

    if (letters.length > 0) {
      return letters.substring(0, 2).toUpperCase();
    }

    return "XX";
  }

  const partsWithLetters = parts
    .map((p) => p.replace(/[^a-zA-Z]/g, ""))
    .filter((p) => p.length > 0);

  if (partsWithLetters.length >= 2) {
    return (partsWithLetters[0][0] + partsWithLetters[1][0]).toUpperCase();
  }

  if (partsWithLetters.length === 1) {
    return partsWithLetters[0].substring(0, 2).toUpperCase();
  }

  return "XX";
};

export const generateId = () => crypto.randomUUID();

export const formatter = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export const normalize = (s: string) => s.trim().toLowerCase();

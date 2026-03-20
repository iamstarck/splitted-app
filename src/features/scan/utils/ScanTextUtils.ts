type ParsedReceipt = {
  items: {
    name: string;
    price: number;
    raw: string;
  }[];
  subtotal?: number;
  total?: number;
  tax?: number;
  service?: number;
  date?: string;
};

export const normalizeText = (text: string) => {
  return text
    .replace(/\r/g, "")
    .replace(/[^\S\n]+/g, " ")
    .replace(/0/g, "0")
    .trim();
};

export const splitLines = (text: string) => {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
};

export const extractPrice = (line: string): number | null => {
  const matches = line.match(/\d{1,3}([.,]\d{3})*/g);
  if (!matches) return null;

  const last = matches[matches.length - 1];

  return Number(last.replace(/[.,]/g, ""));
};

const normalizeKeyword = (line: string) => {
  return line.toLowerCase().replace(/0/g, "o").replace(/1/g, "i");
};

export const classifyLine = (line: string) => {
  const l = normalizeKeyword(line);

  if (l.includes("total")) return "total";
  if (l.includes("subtotal")) return "subtotal";
  if (l.includes("tax")) return "tax";
  if (l.includes("service")) return "service";

  return "unknown";
};

export const isItemLine = (line: string) => {
  const price = extractPrice(line);
  const type = classifyLine(line);

  return price !== null && type === "unknown";
};

export const parseReceipt = (text: string) => {
  const normalized = normalizeText(text);
  const lines = splitLines(normalized);

  const result: ParsedReceipt = {
    items: [],
  };

  for (const line of lines) {
    const price = extractPrice(line);
    const type = classifyLine(line);

    if (!price) continue;

    switch (type) {
      case "total":
        result.total = price;
        break;

      case "subtotal":
        result.subtotal = price;
        break;

      case "tax":
        result.tax = price;
        break;

      case "service":
        result.service = price;
        break;

      default:
        if (isItemLine(line)) {
          result.items.push({
            name: line.replace(/\d[\d.,]*/g, "").trim(),
            price,
            raw: line,
          });
        }
    }
  }

  return result;
};

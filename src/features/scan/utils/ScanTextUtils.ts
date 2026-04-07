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
  discount?: number;
  date?: string;
};

export const normalizeText = (text: string) => {
  return text
    .replace(/\r/g, "")
    .replace(/[^\S\n]+/g, " ")
    // Fix common OCR misreads in number context
    .replace(/(?<=\d)[Oo](?=\d)/g, "0")
    .replace(/(?<=\d)[lI](?=\d)/g, "1")
    .trim();
};

export const splitLines = (text: string) => {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
};

/**
 * Extracts a price from a line.
 * Handles formats:
 *   - Indonesian: 15.000 | 15.000,00 | Rp 15.000 | Rp15.000
 *   - International: 15,000 | 15,000.00
 *   - Plain number >= 1000
 */
export const extractPrice = (line: string): number | null => {
  // Remove currency prefix (Rp, IDR, $)
  let cleaned = line.replace(/\b(Rp\.?|IDR|idr|\$)\s*/gi, "");
  // Remove parenthesized prices (cancellations/negative amounts)
  cleaned = cleaned.replace(/\([\d.,]+\)/g, "");

  // Match Indonesian format: 15.000 or 15.000,00
  const indonesianMatch = cleaned.match(
    /\b(\d{1,3}(?:\.\d{3})+)(?:,\d{1,2})?\b/,
  );
  if (indonesianMatch) {
    return parseInt(indonesianMatch[1].replace(/\./g, ""), 10);
  }

  // Match international format: 15,000 or 15,000.00
  const intlMatch = cleaned.match(
    /\b(\d{1,3}(?:,\d{3})+)(?:\.\d{1,2})?\b/,
  );
  if (intlMatch) {
    return parseInt(intlMatch[1].replace(/,/g, ""), 10);
  }

  // Match plain number >= 1000 only (to prevent matching years, times, etc.)
  const plainMatch = cleaned.match(/\b(\d{4,})\b/);
  if (plainMatch) {
    return parseInt(plainMatch[1], 10);
  }

  return null;
};

/**
 * Extracts ALL prices from a line and returns the largest one.
 * Useful for multi-column receipts: Qty | UnitPrice | Total → we want Total.
 */
const extractLargestPrice = (line: string): number | null => {
  let cleaned = line.replace(/\b(Rp\.?|IDR|idr|\$)\s*/gi, "");
  cleaned = cleaned.replace(/\([\d.,]+\)/g, "");
  const found: number[] = [];

  // Indonesian format matches
  const idMatches = cleaned.matchAll(
    /\b(\d{1,3}(?:\.\d{3})+)(?:,\d{1,2})?\b/g,
  );
  for (const m of idMatches) found.push(parseInt(m[1].replace(/\./g, ""), 10));

  // International format matches
  const intlMatches = cleaned.matchAll(
    /\b(\d{1,3}(?:,\d{3})+)(?:\.\d{1,2})?\b/g,
  );
  for (const m of intlMatches)
    found.push(parseInt(m[1].replace(/,/g, ""), 10));

  // Plain numbers
  const plainMatches = cleaned.matchAll(/\b(\d{4,})\b/g);
  for (const m of plainMatches) found.push(parseInt(m[1], 10));

  if (found.length === 0) return null;
  return Math.max(...found);
};

const KEYWORDS_ID = {
  total: ["grand total", "total belanja", "total", "ttl"],
  subtotal: ["subtotal", "sub total", "subtot", "sus total", "harga jual"],
  tax: ["tax", "pajak", "ppn", "vat", "dpp"],
  service: ["service", "servis", "layanan", "tip"],
  discount: ["discount", "diskon", "disc", "potongan", "voucher"],
};

const normalizeKeyword = (line: string) => {
  return line
    .toLowerCase()
    .replace(/0/g, "o")
    .replace(/1/g, "i")
    .replace(/5/g, "s");
};

export const classifyLine = (line: string) => {
  const l = normalizeKeyword(line);
  // Check subtotal before total (subtotal contains "total" too)
  if (KEYWORDS_ID.subtotal.some((k) => l.includes(k))) return "subtotal";
  if (KEYWORDS_ID.total.some((k) => l.includes(k))) return "total";
  if (KEYWORDS_ID.tax.some((k) => l.includes(k))) return "tax";
  if (KEYWORDS_ID.service.some((k) => l.includes(k))) return "service";
  if (KEYWORDS_ID.discount.some((k) => l.includes(k))) return "discount";
  return "unknown";
};

/**
 * Returns true if this line looks like a noise/header line that should be skipped.
 * Catches: phone numbers, dates, times, receipt IDs, separator lines, addresses, etc.
 */
const isNoiseLine = (line: string): boolean => {
  // Separator lines (====, ----,  ****)
  if (/^[=\-*]{3,}/.test(line)) return true;
  // Date patterns like 14-01-2022 or 2022/01/14 or 16.06.18
  if (/\b\d{1,2}[-\/\.]\d{1,2}[-\/\.]\d{2,4}\b/.test(line)) return true;
  // Time patterns like 08:02:00 or 10:27am
  if (/\b\d{2}:\d{2}(:\d{2})?\s*(am|pm)?\b/i.test(line)) return true;
  // Phone number patterns like (0341) or 021-7999034
  if (/\(\d{3,5}\)/.test(line)) return true;
  if (/\b\d{3}-\d{6,}\b/.test(line)) return true;
  // Lines that look like receipt IDs with letters + many numbers
  if (/^[A-Z]\d{8,}/.test(line.replace(/\s/g, ""))) return true;
  // Store ID patterns like #010002
  if (/#\d{4,}/.test(line)) return true;
  // Column header line
  const lower = line.toLowerCase();
  if (
    (lower.includes("harga") || lower.includes("qty")) &&
    lower.includes("total")
  )
    return true;

  // Payment / footer keywords
  if (
    /\b(bayar|kembal[i1]|angsuran|nota|kasir|tgl\.?|bon\s|member|selamat|kritik|saran|sms|phone|npwp|nphp|nca|reg:|csh:|rcpt|name:|receipt)\b/i.test(
      line,
    )
  )
    return true;

  // Store header / address patterns
  if (
    /\b(jl\.?|jalan|pt\.?|cv\.?|no\.?\s*\d|rt\s*\d|rw\s*\d|tower|lt\.\s*\d|kota|kel\.|kec\.)\b/i.test(
      line,
    )
  )
    return true;

  // NPWP/NPHP number patterns (xx.xxx.xxx.x-xxx.xxx)
  if (/\b\d{2}\.\d{3}\.\d{3}\.\d/i.test(line)) return true;

  // Lines with phone-number-like long digit sequences (but NOT prices like 13.000)
  if (/\d{8,}/.test(line) && !/[.,]\d{3}/.test(line)) return true;

  // Cancel lines
  if (/cancel/i.test(line)) return true;

  // Electronic payment method names
  if (
    /\b(shopeepay|tunai|non tunai|gopay|ovo|dana|debit|kredit|credit|cash)\b/i.test(
      line,
    )
  )
    return true;

  // "ITEM TERJUAL", "Total Item" lines
  if (/item\s*terjual/i.test(line)) return true;
  if (/\btotal\s*item\b/i.test(line)) return true;

  // Lines that are mostly single letters/numbers scattered (OCR noise)
  const cleanedText = line.replace(/[^a-zA-Z]/g, "");
  if (cleanedText.length <= 3 && line.length <= 5) return true;

  // Lines with pipe characters (OCR artifacts from photo edge decorations)
  // Only skip if the actual content is very short
  const noPipes = line.replace(/[|]/g, "").trim();
  if (noPipes.length <= 3) return true;

  // Address-like lines: 3 or more commas (city, district, province, zip)
  const commaCount = (line.match(/,/g) || []).length;
  if (commaCount >= 3) return true;

  return false;
};

/**
 * Returns true if a line looks like a pure item name (text-only, no price).
 * Used for multi-line receipt format: Name on one line, Price on next line.
 */
const isPureNameLine = (line: string): boolean => {
  // Has no numbers that look like a price
  const hasPrice = extractPrice(line) !== null;
  // Has at least 3 non-numeric characters
  const textOnly = line.replace(/\d/g, "").trim().length >= 3;
  return !hasPrice && textOnly && !isNoiseLine(line);
};

/**
 * Cleans item name by removing price patterns and receipt artifacts.
 */
const cleanItemName = (line: string): string => {
  return line
    .replace(/\b(Rp\.?|IDR|idr|\$)\s*/gi, "")
    // Remove Indonesian prices (15.000)
    .replace(/\b\d{1,3}(?:[.,]\d{3})+(?:[.,]\d{1,2})?\b/g, "")
    // Remove plain large numbers
    .replace(/\b\d{4,}\b/g, "")
    // Remove quantity markers (1x, x2, etc)
    .replace(/\bx\s*\d+|\d+\s*x\b/gi, "")
    // Remove percentages
    .replace(/\b\d+,\d+%\b/g, "")
    // Remove standalone single digits (qty column remnants)
    .replace(/\b\d{1,2}\b/g, "")
    // Keep only meaningful characters
    .replace(/[^a-zA-Z0-9\s\-\/&'.]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

export const isItemLine = (line: string) => {
  if (isNoiseLine(line)) return false;
  const price = extractPrice(line);
  const type = classifyLine(line);
  if (price === null || price < 1000 || type !== "unknown") return false;
  // Reject if cleaned name is too short (OCR garbage)
  const name = cleanItemName(line);
  if (name.length < 3) return false;
  // Must have at least 4 alphabetic characters for a real item name
  const alphaOnly = name.replace(/[^a-zA-Z]/g, "");
  return alphaOnly.length >= 4;
};

export const parseReceipt = (text: string) => {
  const normalized = normalizeText(text);
  const lines = splitLines(normalized);

  const result: ParsedReceipt = { items: [] };

  /**
   * Strategy:
   *  1. Skip noise/header lines
   *  2. If a line is a pure name (no price), store it as a "pending name"
   *  3. If the next line is a price line (item), combine name + price
   *  4. Handle inline items (name + price on same line)
   */
  let pendingName: string | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip irrelevant lines
    if (isNoiseLine(line)) {
      pendingName = null;
      continue;
    }

    const price = extractPrice(line);
    const type = classifyLine(line);

    // Summary lines (total, subtotal, tax, service, discount)
    if (price !== null && type !== "unknown") {
      pendingName = null;
      switch (type) {
        case "total":
          if (!result.total || price > result.total) result.total = price;
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
        case "discount":
          result.discount = (result.discount ?? 0) + price;
          break;
      }
      continue;
    }

    // Pure name line — store and wait for the price line
    if (isPureNameLine(line)) {
      pendingName = line;
      continue;
    }

    // Item line with price
    if (isItemLine(line)) {
      const rawName = pendingName ?? line;
      const name = cleanItemName(rawName);
      pendingName = null;

      if (name.length > 1) {
        // For multi-column receipts, take the LARGEST price = total column
        const priceForItem = extractLargestPrice(line) ?? price!;
        result.items.push({ name, price: priceForItem, raw: line });
      }
      continue;
    }

    // If nothing matched, clear pending name
    pendingName = null;
  }

  return result;
};

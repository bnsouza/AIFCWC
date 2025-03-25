// ------------------------------------------------------------------------------------------------

export function pascalCase(str: string) {
  if (!str) return "";
  str = removeSpecialChars(str);
  return str
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(" ")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}

// ------------------------------------------------------------------------------------------------

export function removeSpecialChars(str: string): string {
  if (!str) return "";

  // Ensures the string is properly encoded in UTF-8
  str = Buffer.from(str, "utf-8").toString("utf-8");

  // Removes control characters (ASCII 0-31 and 127-159)
  str = str.replace(/[\x00-\x1F\x7F-\x9F]/g, "");

  // Removes invalid or corrupted characters (e.g., the character "�")
  str = str.replace(/\uFFFD/g, "");

  // Normalizes the string and removes accents
  str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Replaces accented characters with their non-accented equivalents
  const map: { [key: string]: string } = {
    á: "a",
    à: "a",
    ã: "a",
    â: "a",
    ä: "a",
    Á: "A",
    À: "A",
    Ã: "A",
    Â: "A",
    Ä: "A",
    é: "e",
    è: "e",
    ê: "e",
    ë: "e",
    É: "E",
    È: "E",
    Ê: "E",
    Ë: "E",
    í: "i",
    ì: "i",
    î: "i",
    ï: "i",
    Í: "I",
    Ì: "I",
    Î: "I",
    Ï: "I",
    ó: "o",
    ò: "o",
    õ: "o",
    ô: "o",
    ö: "o",
    Ó: "O",
    Ò: "O",
    Õ: "O",
    Ô: "O",
    Ö: "O",
    ú: "u",
    ù: "u",
    û: "u",
    ü: "u",
    Ú: "U",
    Ù: "U",
    Û: "U",
    Ü: "U",
    ñ: "n",
    Ñ: "N",
    ç: "c",
    Ç: "C",
  };

  str = str.replace(/[\u00C0-\u00FF]/g, (match) => map[match] || match);

  // Replace specific encoding errors, like N�
  str = str.replace(/N\u00B0/g, "Nº"); // Corrects cases of "N�" to "Nº"
  str = str.replace(/(\d+)([^\d\s\.,-])/g, "$1$2"); // Removes other invalid or strange characters

  return str;
}

// ------------------------------------------------------------------------------------------------

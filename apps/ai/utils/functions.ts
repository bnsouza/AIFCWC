// ------------------------------------------------------------------------------------------------

export function pascalCase(str: string) {
  return str
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(" ")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}

// ------------------------------------------------------------------------------------------------

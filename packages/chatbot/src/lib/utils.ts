import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";


export function getContrast(hexColor: string) {
  // Convert hex color to RGB
  let r = parseInt(hexColor.substring(1, 3), 16);
  let g = parseInt(hexColor.substring(3, 5), 16);
  let b = parseInt(hexColor.substring(5, 7), 16);

  // Calculate relative luminance
  let luminance = 0.2126 * (r / 255) + 0.7152 * (g / 255) + 0.0722 * (b / 255);

  // Check if white or black text would have better contrast
  let textColor = luminance > 0.6 ? "#000000" : "#ffffff";

  return textColor;
}
export function isValidUUID(uuid: string) {
  const regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
}

const twMerge = extendTailwindMerge({
  prefix: "cb-",
});
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

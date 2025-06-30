import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const parseJWTPayload = <T>(token: string): T | null => {
  const [header, payload] = token.split(".");
  if (!header || !payload) {
    return null;
  }
  const decodedPayload = atob(payload);
  return JSON.parse(decodedPayload);
};

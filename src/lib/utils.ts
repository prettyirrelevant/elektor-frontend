import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSecretAndNullifier(seed: string) {
  // Simple hash function
  const hash = (str: string) => {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
    }
    return h;
  };

  // Generate secret and nullifier
  const secret = hash(`${seed}_secret`) >>> 0; // Ensure positive 32-bit integer
  const nullifier = hash(`${seed}_nullifier`) >>> 0;

  return { secret, nullifier };
}

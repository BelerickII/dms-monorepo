import { Transform } from 'class-transformer';

//Trim whitespace from CSV values
export function Trim() {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.trim();
    }
    return value; // Returns the original value if it's not a string (e.g., numbers, booleans)
  });
}
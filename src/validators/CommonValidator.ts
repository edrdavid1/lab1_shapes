import { InvalidDataError } from "../exceptions/InvalidDataError.js";

export class CommonValidator {
  static isPositiveNumber(value: number, name = 'value'): void {
    if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
      throw new InvalidDataError(`${name} must be a positive number`);
    }
  }
}

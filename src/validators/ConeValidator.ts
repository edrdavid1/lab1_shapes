import { Cone } from '../entities/Cone.js';
import { CommonValidator } from './CommonValidator.js';
import { InvalidDataError } from '../exceptions/InvalidDataError.js';

export class ConeValidator {
  static validateGeometry(cone: Cone): void {
    if (cone.radius <= 0 || cone.height <= 0) {
      throw new InvalidDataError('Радиус и высота конуса должны быть положительными');
    }
  }

  static validateResults(surfaceArea: number, volume: number): void {
    CommonValidator.isPositiveNumber(surfaceArea, 'surfaceArea');
    CommonValidator.isPositiveNumber(volume, 'volume');
  }
}

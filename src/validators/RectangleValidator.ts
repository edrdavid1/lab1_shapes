import { Rectangle } from '../entities/Rectangle.js';
import { CommonValidator } from './CommonValidator.js';
import { InvalidDataError } from '../exceptions/InvalidDataError.js';

export class RectangleValidator {
  static validateGeometry(rect: Rectangle): void {
    const width = Math.abs(rect.bottomRight.x - rect.topLeft.x);
    const height = Math.abs(rect.bottomRight.y - rect.topLeft.y);
    if (width <= 0 || height <= 0) {
      throw new InvalidDataError('Ширина и высота прямоугольника должны быть положительными');
    }
  }

  static validateResults(area: number, perimeter: number): void {
    CommonValidator.isPositiveNumber(area, 'area');
    CommonValidator.isPositiveNumber(perimeter, 'perimeter');
  }
}

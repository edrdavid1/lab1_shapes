import { Point } from './Point.js';
import { Shape } from './Shape.js';

export class Rectangle extends Shape {
  constructor(
    id: string,
    public topLeft: Point,
    public bottomRight: Point
  ) {
    super(id);
  }
}

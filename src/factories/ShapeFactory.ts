import { Shape } from "../entities/Shape.js";

export abstract class ShapeFactory {
  abstract createShape(data: string[]): Shape;
}

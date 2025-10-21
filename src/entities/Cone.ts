import { Shape } from "./Shape.js";
import { Point } from "./Point.js";

export class Cone extends Shape {
  constructor(
    id: string,
    public apex: Point,
    public baseCenter: Point,
    public radius: number,
    public height: number
  ) {
    super(id);
  }
}

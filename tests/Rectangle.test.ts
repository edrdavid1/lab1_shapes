import { Rectangle } from "../src/entities/Rectangle.js";
import { Point } from "../src/entities/Point.js";
import { RectangleService } from "../src/services/RectangleService.js";

describe("RectangleService", () => {
  const rect = new Rectangle("1", new Point(0, 0), new Point(4, 3));

  test("calculates area correctly", () => {
    expect(RectangleService.area(rect)).toBe(12);
  });

  test("calculates perimeter correctly", () => {
    expect(RectangleService.perimeter(rect)).toBe(14);
  });

  test("detects square correctly", () => {
    expect(RectangleService.isSquare(rect)).toBe(false);
  });

  test("validates rectangle geometry and extended properties", () => {
    expect(RectangleService.isValidRectangle(rect)).toBe(true);
    const square = new Rectangle("2", new Point(0, 0), new Point(3, 3));
    expect(RectangleService.isSquare(square)).toBe(true);
    expect(RectangleService.isRhombus(square)).toBe(true);
    expect(RectangleService.isTrapezoid(rect)).toBe(true);
    expect(RectangleService.isConvex(rect)).toBe(true);

    const invalidZeroArea = new Rectangle("3", new Point(1, 1), new Point(1, 5));
    expect(RectangleService.isValidRectangle(invalidZeroArea)).toBe(false);
  });
});

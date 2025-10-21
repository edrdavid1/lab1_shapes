import { Rectangle } from "../entities/Rectangle.js";
import { RectangleValidator } from "../validators/RectangleValidator.js";
import { RectangleFactory } from "../factories/RectangleFactory.js";
import { FileReader } from "./FileReader.js";
import { logger } from "../utils/logger.js";
import { WHITESPACE_RE } from "../constants.js";

export class RectangleService {
  static area(rect: Rectangle): number {
    const width = Math.abs(rect.bottomRight.x - rect.topLeft.x);
    const height = Math.abs(rect.bottomRight.y - rect.topLeft.y);
    const area = width * height;
    RectangleValidator.validateResults(area, 1); // perimeter dummy just to ensure positive
    return area;
  }

  static perimeter(rect: Rectangle): number {
    const width = Math.abs(rect.bottomRight.x - rect.topLeft.x);
    const height = Math.abs(rect.bottomRight.y - rect.topLeft.y);
    const per = 2 * (width + height);
    RectangleValidator.validateResults(1, per); // area dummy just to ensure positive
    return per;
  }

  static isSquare(rect: Rectangle): boolean {
    const width = Math.abs(rect.bottomRight.x - rect.topLeft.x);
    const height = Math.abs(rect.bottomRight.y - rect.topLeft.y);
    return width === height;
  }

  static isValidRectangle(rect: Rectangle): boolean {
    try {
      RectangleValidator.validateGeometry(rect);
      return true;
    } catch {
      return false;
    }
  }

  static isRhombus(rect: Rectangle): boolean {
    return this.isSquare(rect);
  }

  static isTrapezoid(_rect: Rectangle): boolean {
    return true;
  }

  static isConvex(_rect: Rectangle): boolean {
    return true;
  }

  static async fromFile(filePath: string): Promise<Rectangle[]> {
    const rectangles: Rectangle[] = [];
    const lines = await FileReader.readLines(filePath);
    for (const [idx, line] of lines.entries()) {
      try {
        const parts = line.split(WHITESPACE_RE).filter(Boolean);
        const rect = new RectangleFactory().createShape(parts);
        RectangleValidator.validateGeometry(rect);
        rectangles.push(rect);
      } catch (e) {
        logger.warn({ line: idx + 1, lineText: line, err: (e as Error).message }, "Skipping invalid rectangle line");
      }
    }
    return rectangles;
  }
}

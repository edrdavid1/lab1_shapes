import { ShapeFactory } from "./ShapeFactory.js";
import { Rectangle } from "../entities/Rectangle.js";
import { Point } from "../entities/Point.js";
import { InvalidDataError } from "../exceptions/InvalidDataError.js";
import { WarehouseObserver } from "../patterns/WarehouseObserver.js";

export class RectangleFactory extends ShapeFactory {
  createShape(data: string[]): Rectangle {
    if (data.length < 4) throw new InvalidDataError('Недостаточно данных для прямоугольника');
    const nums = data.map(Number);
    if (nums.some((n) => Number.isNaN(n))) throw new InvalidDataError('Некорректные числа в строке прямоугольника');
    const [x1, y1, x2, y2] = nums;
    const topLeft = new Point(x1, y1);
    const bottomRight = new Point(x2, y2);
    const rectangle = new Rectangle('rect_' + Date.now(), topLeft, bottomRight);
    
    // Добавить observer для отслеживания изменений
    const observer = new WarehouseObserver();
    rectangle.addObserver(observer);
    observer.update(rectangle);
    
    return rectangle;
  }
}

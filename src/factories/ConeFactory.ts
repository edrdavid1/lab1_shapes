import { ShapeFactory } from "./ShapeFactory.js";
import { Cone } from "../entities/Cone.js";
import { Point } from "../entities/Point.js";
import { InvalidDataError } from "../exceptions/InvalidDataError.js";
import { WarehouseObserver } from "../patterns/WarehouseObserver.js";

export class ConeFactory extends ShapeFactory {
  createShape(data: string[]): Cone {
    if (data.length < 8) throw new InvalidDataError("Недостаточно данных для конуса");
    const nums = data.map(Number);
    if (nums.some((n) => Number.isNaN(n))) throw new InvalidDataError("Некорректные числа в строке конуса");
    const [ax, ay, az, bx, by, bz, r, h] = nums;
    if (r <= 0 || h <= 0) throw new InvalidDataError("Радиус и высота должны быть положительными");
    const cone = new Cone("cone_" + Date.now(), new Point(ax, ay, az), new Point(bx, by, bz), r, h);
    
    // Добавить observer для отслеживания изменений
    const observer = new WarehouseObserver();
    cone.addObserver(observer);
    observer.update(cone);
    
    return cone;
  }
}

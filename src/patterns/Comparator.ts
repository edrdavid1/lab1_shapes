import type { Shape } from '../entities/Shape.js';

/**
 * Интерфейс Comparator для сортировки фигур
 */
export interface IComparator<T> {
  /**
   * Сравнить два объекта
   * @returns отрицательное число если a < b, 0 если a == b, положительное если a > b
   */
  compare(a: T, b: T): number;
}

/**
 * Comparator по ID
 */
export class IdComparator implements IComparator<Shape> {
  compare(a: Shape, b: Shape): number {
    return a.id.localeCompare(b.id);
  }
}

/**
 * Comparator по имени
 */
export class NameComparator implements IComparator<Shape> {
  compare(a: Shape, b: Shape): number {
    return a.getName().localeCompare(b.getName());
  }
}

/**
 * Comparator по X координате первой точки
 */
export class FirstPointXComparator implements IComparator<Shape> {
  compare(a: Shape, b: Shape): number {
    const xA = a.getFirstPoint().x;
    const xB = b.getFirstPoint().x;
    return xA - xB;
  }
}

/**
 * Comparator по Y координате первой точки
 */
export class FirstPointYComparator implements IComparator<Shape> {
  compare(a: Shape, b: Shape): number {
    const yA = a.getFirstPoint().y;
    const yB = b.getFirstPoint().y;
    return yA - yB;
  }
}

/**
 * Comparator по Z координате первой точки
 */
export class FirstPointZComparator implements IComparator<Shape> {
  compare(a: Shape, b: Shape): number {
    const zA = a.getFirstPoint().z;
    const zB = b.getFirstPoint().z;
    return zA - zB;
  }
}

/**
 * Comparator по расстоянию от начала координат
 */
export class DistanceFromOriginComparator implements IComparator<Shape> {
  compare(a: Shape, b: Shape): number {
    const pointA = a.getFirstPoint();
    const pointB = b.getFirstPoint();

    const distA = Math.sqrt(pointA.x ** 2 + pointA.y ** 2 + pointA.z ** 2);
    const distB = Math.sqrt(pointB.x ** 2 + pointB.y ** 2 + pointB.z ** 2);

    return distA - distB;
  }
}

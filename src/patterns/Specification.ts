import type { Shape } from '../entities/Shape.js';
import type { Point } from '../entities/Point.js';

/**
 * Интерфейс для спецификаций поиска (паттерн Specification)
 */
export interface ISpecification<T> {
  /**
   * Проверить, соответствует ли объект спецификации
   */
  isSatisfiedBy(candidate: T): boolean;

  /**
   * Комбинировать спецификации с AND
   */
  and(other: ISpecification<T>): ISpecification<T>;

  /**
   * Комбинировать спецификации с OR
   */
  or(other: ISpecification<T>): ISpecification<T>;

  /**
   * Инвертировать спецификацию
   */
  not(): ISpecification<T>;
}

/**
 * Абстрактный класс для реализации спецификаций
 */
export abstract class AbstractSpecification<T> implements ISpecification<T> {
  abstract isSatisfiedBy(candidate: T): boolean;

  and(other: ISpecification<T>): ISpecification<T> {
    return new AndSpecification(this, other);
  }

  or(other: ISpecification<T>): ISpecification<T> {
    return new OrSpecification(this, other);
  }

  not(): ISpecification<T> {
    return new NotSpecification(this);
  }
}

/**
 * Вспомогательные классы для комбинирования спецификаций
 */
class AndSpecification<T> extends AbstractSpecification<T> {
  constructor(
    private left: ISpecification<T>,
    private right: ISpecification<T>
  ) {
    super();
  }

  isSatisfiedBy(candidate: T): boolean {
    return this.left.isSatisfiedBy(candidate) && this.right.isSatisfiedBy(candidate);
  }
}

class OrSpecification<T> extends AbstractSpecification<T> {
  constructor(
    private left: ISpecification<T>,
    private right: ISpecification<T>
  ) {
    super();
  }

  isSatisfiedBy(candidate: T): boolean {
    return this.left.isSatisfiedBy(candidate) || this.right.isSatisfiedBy(candidate);
  }
}

class NotSpecification<T> extends AbstractSpecification<T> {
  constructor(private spec: ISpecification<T>) {
    super();
  }

  isSatisfiedBy(candidate: T): boolean {
    return !this.spec.isSatisfiedBy(candidate);
  }
}

/**
 * Спецификация для поиска по ID
 */
export class IdSpecification extends AbstractSpecification<Shape> {
  constructor(private id: string) {
    super();
  }

  isSatisfiedBy(candidate: Shape): boolean {
    return candidate.id === this.id;
  }
}

/**
 * Спецификация для поиска по имени (частичное совпадение)
 */
export class NameSpecification extends AbstractSpecification<Shape> {
  constructor(
    private name: string,
    private caseSensitive: boolean = false
  ) {
    super();
  }

  isSatisfiedBy(candidate: Shape): boolean {
    const candidateName = this.caseSensitive ? candidate.getName() : candidate.getName().toLowerCase();
    const searchName = this.caseSensitive ? this.name : this.name.toLowerCase();
    return candidateName.includes(searchName);
  }
}

/**
 * Спецификация для поиска объектов в первом квадранте (X > 0, Y > 0)
 */
export class FirstQuadrantSpecification extends AbstractSpecification<Shape> {
  isSatisfiedBy(candidate: Shape): boolean {
    const point = candidate.getFirstPoint();
    return point.x > 0 && point.y > 0;
  }
}

/**
 * Спецификация для поиска объектов во втором квадранте (X < 0, Y > 0)
 */
export class SecondQuadrantSpecification extends AbstractSpecification<Shape> {
  isSatisfiedBy(candidate: Shape): boolean {
    const point = candidate.getFirstPoint();
    return point.x < 0 && point.y > 0;
  }
}

/**
 * Спецификация для поиска объектов в третьем квадранте (X < 0, Y < 0)
 */
export class ThirdQuadrantSpecification extends AbstractSpecification<Shape> {
  isSatisfiedBy(candidate: Shape): boolean {
    const point = candidate.getFirstPoint();
    return point.x < 0 && point.y < 0;
  }
}

/**
 * Спецификация для поиска объектов в четвертом квадранте (X > 0, Y < 0)
 */
export class FourthQuadrantSpecification extends AbstractSpecification<Shape> {
  isSatisfiedBy(candidate: Shape): boolean {
    const point = candidate.getFirstPoint();
    return point.x > 0 && point.y < 0;
  }
}

/**
 * Спецификация для поиска объектов на положительной оси Z
 */
export class PositiveZSpecification extends AbstractSpecification<Shape> {
  isSatisfiedBy(candidate: Shape): boolean {
    return candidate.getFirstPoint().z > 0;
  }
}

/**
 * Спецификация для поиска объектов на отрицательной оси Z
 */
export class NegativeZSpecification extends AbstractSpecification<Shape> {
  isSatisfiedBy(candidate: Shape): boolean {
    return candidate.getFirstPoint().z < 0;
  }
}

/**
 * Спецификация для поиска объектов в диапазоне расстояний от начала координат
 */
export class DistanceRangeSpecification extends AbstractSpecification<Shape> {
  constructor(
    private minDistance: number,
    private maxDistance: number
  ) {
    super();
  }

  isSatisfiedBy(candidate: Shape): boolean {
    const point = candidate.getFirstPoint();
    const distance = Math.sqrt(point.x ** 2 + point.y ** 2 + point.z ** 2);
    return distance >= this.minDistance && distance <= this.maxDistance;
  }
}

/**
 * Спецификация для поиска объектов по типу (Rectangle или Cone)
 */
export class TypeSpecification extends AbstractSpecification<Shape> {
  constructor(private typeName: string) {
    super();
  }

  isSatisfiedBy(candidate: Shape): boolean {
    return candidate.constructor.name === this.typeName;
  }
}

/**
 * Спецификация для поиска Rectangle в диапазоне площадей
 */
export class AreaRangeSpecification extends AbstractSpecification<Shape> {
  constructor(
    private minArea: number,
    private maxArea: number
  ) {
    super();
  }

  isSatisfiedBy(candidate: Shape): boolean {
    if (candidate.constructor.name !== 'Rectangle') {
      return false;
    }
    const area = candidate.getProperty('area');
    if (area === undefined) {
      return false;
    }
    return area >= this.minArea && area <= this.maxArea;
  }
}

/**
 * Спецификация для поиска Rectangle в диапазоне периметров
 */
export class PerimeterRangeSpecification extends AbstractSpecification<Shape> {
  constructor(
    private minPerimeter: number,
    private maxPerimeter: number
  ) {
    super();
  }

  isSatisfiedBy(candidate: Shape): boolean {
    if (candidate.constructor.name !== 'Rectangle') {
      return false;
    }
    const perimeter = candidate.getProperty('perimeter');
    if (perimeter === undefined) {
      return false;
    }
    return perimeter >= this.minPerimeter && perimeter <= this.maxPerimeter;
  }
}

/**
 * Спецификация для поиска Cone в диапазоне объемов
 */
export class VolumeRangeSpecification extends AbstractSpecification<Shape> {
  constructor(
    private minVolume: number,
    private maxVolume: number
  ) {
    super();
  }

  isSatisfiedBy(candidate: Shape): boolean {
    if (candidate.constructor.name !== 'Cone') {
      return false;
    }
    const volume = candidate.getProperty('volume');
    if (volume === undefined) {
      return false;
    }
    return volume >= this.minVolume && volume <= this.maxVolume;
  }
}

/**
 * Спецификация для поиска Cone в диапазоне поверхностей
 */
export class SurfaceAreaRangeSpecification extends AbstractSpecification<Shape> {
  constructor(
    private minSurfaceArea: number,
    private maxSurfaceArea: number
  ) {
    super();
  }

  isSatisfiedBy(candidate: Shape): boolean {
    if (candidate.constructor.name !== 'Cone') {
      return false;
    }
    const surfaceArea = candidate.getProperty('surfaceArea');
    if (surfaceArea === undefined) {
      return false;
    }
    return surfaceArea >= this.minSurfaceArea && surfaceArea <= this.maxSurfaceArea;
  }
}

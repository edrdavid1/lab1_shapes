import { Point } from './Point.js';
import { Shape, type ShapeType } from './Shape.js';

export interface IRectangle {
  id: string;
  topLeft: Point;
  bottomRight: Point;
}

export class Rectangle extends Shape implements IRectangle {
  private _topLeft: Point;
  private _bottomRight: Point;
  private _area: number = 0;
  private _perimeter: number = 0;

  constructor(
    public id: string,
    topLeft: Point,
    bottomRight: Point,
    name?: string
  ) {
    super(id);
    this._topLeft = topLeft;
    this._bottomRight = bottomRight;
    if (name) {
      this.name = name;
    }
    this.calculateProperties();
  }

  get topLeft(): Point {
    return this._topLeft;
  }

  get bottomRight(): Point {
    return this._bottomRight;
  }

  /**
   * Получить площадь
   */
  public getArea(): number {
    return this._area;
  }

  /**
   * Получить периметр
   */
  public getPerimeter(): number {
    return this._perimeter;
  }

  /**
   * Установить новые точки и пересчитать параметры
   */
  public setPoints(topLeft: Point, bottomRight: Point): void {
    this._topLeft = topLeft;
    this._bottomRight = bottomRight;
    this.calculateProperties();
    this.notifyObservers();
  }

  /**
   * Установить левую верхнюю точку
   */
  public setTopLeft(point: Point): void {
    this._topLeft = point;
    this.calculateProperties();
    this.notifyObservers();
  }

  /**
   * Установить правую нижнюю точку
   */
  public setBottomRight(point: Point): void {
    this._bottomRight = point;
    this.calculateProperties();
    this.notifyObservers();
  }

  /**
   * Пересчитать площадь и периметр
   */
  private calculateProperties(): void {
    const width = Math.abs(this._bottomRight.x - this._topLeft.x);
    const height = Math.abs(this._bottomRight.y - this._topLeft.y);
    this._area = width * height;
    this._perimeter = 2 * (width + height);
  }

  /**
   * Получить первую точку (топ-лефт)
   */
  public getFirstPoint(): Point {
    return this._topLeft;
  }

  /**
   * Получить свойство по имени
   */
  public getProperty(propertyName: string): number | undefined {
    switch (propertyName.toLowerCase()) {
      case 'area':
        return this._area;
      case 'perimeter':
        return this._perimeter;
      default:
        return undefined;
    }
  }

  /**
   * Получить тип фигуры
   */
  public getShapeType(): ShapeType {
    return 'rectangle';
  }

  /**
   * Проверить, является ли фигура квадратом
   */
  public isSquare(): boolean {
    const width = Math.abs(this._bottomRight.x - this._topLeft.x);
    const height = Math.abs(this._bottomRight.y - this._topLeft.y);
    return width === height;
  }
}

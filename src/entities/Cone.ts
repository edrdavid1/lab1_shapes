import { Shape, type ShapeType } from './Shape.js';
import { Point } from './Point.js';

export interface ICone {
  id: string;
  apex: Point;
  baseCenter: Point;
  radius: number;
  height: number;
}

export class Cone extends Shape implements ICone {
  private _apex: Point;
  private _baseCenter: Point;
  private _radius: number;
  private _height: number;
  private _volume: number = 0;
  private _surfaceArea: number = 0;

  constructor(
    public id: string,
    apex: Point,
    baseCenter: Point,
    radius: number,
    height: number,
    name?: string
  ) {
    super(id);
    this._apex = apex;
    this._baseCenter = baseCenter;
    this._radius = radius;
    this._height = height;
    if (name) {
      this.name = name;
    }
    this.calculateProperties();
  }

  get apex(): Point {
    return this._apex;
  }

  get baseCenter(): Point {
    return this._baseCenter;
  }

  get radius(): number {
    return this._radius;
  }

  get height(): number {
    return this._height;
  }

  /**
   * Получить объем
   */
  public getVolume(): number {
    return this._volume;
  }

  /**
   * Получить поверхность
   */
  public getSurfaceArea(): number {
    return this._surfaceArea;
  }

  /**
   * Установить новые параметры и пересчитать
   */
  public setParameters(
    apex: Point,
    baseCenter: Point,
    radius: number,
    height: number
  ): void {
    this._apex = apex;
    this._baseCenter = baseCenter;
    this._radius = radius;
    this._height = height;
    this.calculateProperties();
    this.notifyObservers();
  }

  /**
   * Установить вершину
   */
  public setApex(point: Point): void {
    this._apex = point;
    this.calculateProperties();
    this.notifyObservers();
  }

  /**
   * Установить центр основания
   */
  public setBaseCenter(point: Point): void {
    this._baseCenter = point;
    this.calculateProperties();
    this.notifyObservers();
  }

  /**
   * Установить радиус
   */
  public setRadius(radius: number): void {
    this._radius = radius;
    this.calculateProperties();
    this.notifyObservers();
  }

  /**
   * Установить высоту
   */
  public setHeight(height: number): void {
    this._height = height;
    this.calculateProperties();
    this.notifyObservers();
  }

  /**
   * Пересчитать объем и поверхность
   */
  private calculateProperties(): void {
    // Объем конуса: V = (1/3) * π * r² * h
    this._volume = (1 / 3) * Math.PI * this._radius ** 2 * this._height;

    // Боковая поверхность: S_бок = π * r * l, где l - длина образующей
    const slant = Math.sqrt(this._radius ** 2 + this._height ** 2);
    const lateralSurfaceArea = Math.PI * this._radius * slant;

    // Полная поверхность: S = π * r * (r + l)
    this._surfaceArea = Math.PI * this._radius * (this._radius + slant);
  }

  /**
   * Получить первую точку (вершина)
   */
  public getFirstPoint(): Point {
    return this._apex;
  }

  /**
   * Получить свойство по имени
   */
  public getProperty(propertyName: string): number | undefined {
    switch (propertyName.toLowerCase()) {
      case 'volume':
        return this._volume;
      case 'surfacearea':
      case 'surface_area':
        return this._surfaceArea;
      case 'radius':
        return this._radius;
      case 'height':
        return this._height;
      default:
        return undefined;
    }
  }

  /**
   * Получить тип фигуры
   */
  public getShapeType(): ShapeType {
    return 'cone';
  }
}

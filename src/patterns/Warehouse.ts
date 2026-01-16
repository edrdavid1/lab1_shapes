import type { Shape } from '../entities/Shape.js';
import type { Rectangle } from '../entities/Rectangle.js';
import type { Cone } from '../entities/Cone.js';

/**
 * Warehouse - Singleton паттерн для хранения характеристик фигур
 * Хранит площади, объемы, периметры фигур
 * Любое изменение фигуры должно вызывать пересчет
 */
export class Warehouse {
  private static instance: Warehouse | null = null;

  private shapes: Map<string, Shape> = new Map();
  private areas: Map<string, number> = new Map(); // для Rectangle
  private perimeters: Map<string, number> = new Map(); // для Rectangle
  private volumes: Map<string, number> = new Map(); // для Cone
  private surfaceAreas: Map<string, number> = new Map(); // для Cone

  /**
   * Приватный конструктор для Singleton паттерна
   */
  private constructor() {}

  /**
   * Получить единственный экземпляр Warehouse
   */
  public static getInstance(): Warehouse {
    if (!Warehouse.instance) {
      Warehouse.instance = new Warehouse();
    }
    return Warehouse.instance;
  }

  /**
   * Добавить фигуру в Warehouse
   */
  public addShape(shape: Shape): void {
    this.shapes.set(shape.id, shape);
  }

  /**
   * Удалить фигуру из Warehouse
   */
  public removeShape(shapeId: string): void {
    this.shapes.delete(shapeId);
    this.areas.delete(shapeId);
    this.perimeters.delete(shapeId);
    this.volumes.delete(shapeId);
    this.surfaceAreas.delete(shapeId);
  }

  /**
   * Получить фигуру по ID
   */
  public getShape(shapeId: string): Shape | undefined {
    return this.shapes.get(shapeId);
  }

  /**
   * Получить все фигуры
   */
  public getAllShapes(): Shape[] {
    return Array.from(this.shapes.values());
  }

  /**
   * Установить площадь прямоугольника
   */
  public setArea(shapeId: string, area: number): void {
    this.areas.set(shapeId, area);
  }

  /**
   * Получить площадь прямоугольника
   */
  public getArea(shapeId: string): number | undefined {
    return this.areas.get(shapeId);
  }

  /**
   * Получить все площади
   */
  public getAllAreas(): Map<string, number> {
    return new Map(this.areas);
  }

  /**
   * Установить периметр прямоугольника
   */
  public setPerimeter(shapeId: string, perimeter: number): void {
    this.perimeters.set(shapeId, perimeter);
  }

  /**
   * Получить периметр прямоугольника
   */
  public getPerimeter(shapeId: string): number | undefined {
    return this.perimeters.get(shapeId);
  }

  /**
   * Получить все периметры
   */
  public getAllPerimeters(): Map<string, number> {
    return new Map(this.perimeters);
  }

  /**
   * Установить объем конуса
   */
  public setVolume(shapeId: string, volume: number): void {
    this.volumes.set(shapeId, volume);
  }

  /**
   * Получить объем конуса
   */
  public getVolume(shapeId: string): number | undefined {
    return this.volumes.get(shapeId);
  }

  /**
   * Получить все объемы
   */
  public getAllVolumes(): Map<string, number> {
    return new Map(this.volumes);
  }

  /**
   * Установить поверхность конуса
   */
  public setSurfaceArea(shapeId: string, surfaceArea: number): void {
    this.surfaceAreas.set(shapeId, surfaceArea);
  }

  /**
   * Получить поверхность конуса
   */
  public getSurfaceArea(shapeId: string): number | undefined {
    return this.surfaceAreas.get(shapeId);
  }

  /**
   * Получить все поверхности
   */
  public getAllSurfaceAreas(): Map<string, number> {
    return new Map(this.surfaceAreas);
  }

  /**
   * Очистить Warehouse (для тестирования)
   */
  public clear(): void {
    this.shapes.clear();
    this.areas.clear();
    this.perimeters.clear();
    this.volumes.clear();
    this.surfaceAreas.clear();
  }

  /**
   * Получить общую статистику
   */
  public getStatistics() {
    return {
      totalShapes: this.shapes.size,
      rectangles: Array.from(this.shapes.values()).filter(
        (s) => s.constructor.name === 'Rectangle'
      ).length,
      cones: Array.from(this.shapes.values()).filter(
        (s) => s.constructor.name === 'Cone'
      ).length,
      totalArea: Array.from(this.areas.values()).reduce((sum, a) => sum + a, 0),
      totalPerimeter: Array.from(this.perimeters.values()).reduce((sum, p) => sum + p, 0),
      totalVolume: Array.from(this.volumes.values()).reduce((sum, v) => sum + v, 0),
      totalSurfaceArea: Array.from(this.surfaceAreas.values()).reduce((sum, sa) => sum + sa, 0),
    };
  }
}

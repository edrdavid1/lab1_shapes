import type { Shape } from '../entities/Shape.js';
import type { ISpecification } from '../patterns/Specification.js';
import type { IComparator } from '../patterns/Comparator.js';
import { Warehouse } from '../patterns/Warehouse.js';
import { WarehouseObserver } from './WarehouseObserver.js';

/**
 * Repository паттерн для управления коллекцией фигур
 * Обеспечивает добавление, удаление, поиск и сортировку фигур
 */
export class ShapeRepository {
  private shapes: Map<string, Shape> = new Map();
  private warehouse: Warehouse = Warehouse.getInstance();
  private warehouseObserver: WarehouseObserver = new WarehouseObserver();

  /**
   * Добавить фигуру в репозиторий
   */
  public add(shape: Shape): void {
    this.shapes.set(shape.id, shape);
    this.warehouse.addShape(shape);
    
    // Добавить observer для отслеживания изменений
    shape.addObserver(this.warehouseObserver);
    // Первоначально обновить Warehouse
    this.warehouseObserver.update(shape);
  }

  /**
   * Удалить фигуру из репозитория по ID
   */
  public remove(shapeId: string): boolean {
    const deleted = this.shapes.delete(shapeId);
    if (deleted) {
      this.warehouse.removeShape(shapeId);
    }
    return deleted;
  }

  /**
   * Получить фигуру по ID
   */
  public getById(id: string): Shape | undefined {
    return this.shapes.get(id);
  }

  /**
   * Получить все фигуры
   */
  public getAll(): Shape[] {
    return Array.from(this.shapes.values());
  }

  /**
   * Получить количество фигур
   */
  public count(): number {
    return this.shapes.size;
  }

  /**
   * Проверить наличие фигуры по ID
   */
  public exists(id: string): boolean {
    return this.shapes.has(id);
  }

  /**
   * Найти фигуры по спецификации
   */
  public find(specification: ISpecification<Shape>): Shape[] {
    return this.getAll().filter((shape) => specification.isSatisfiedBy(shape));
  }

  /**
   * Найти одну фигуру по спецификации
   */
  public findOne(specification: ISpecification<Shape>): Shape | undefined {
    return this.getAll().find((shape) => specification.isSatisfiedBy(shape));
  }

  /**
   * Найти фигуры по имени (частичное совпадение)
   */
  public findByName(name: string, caseSensitive: boolean = false): Shape[] {
    return this.getAll().filter((shape) => {
      const shapeName = caseSensitive ? shape.getName() : shape.getName().toLowerCase();
      const searchName = caseSensitive ? name : name.toLowerCase();
      return shapeName.includes(searchName);
    });
  }

  /**
   * Получить все фигуры в первом квадранте
   */
  public getInFirstQuadrant(): Shape[] {
    return this.getAll().filter((shape) => {
      const point = shape.getFirstPoint();
      return point.x > 0 && point.y > 0;
    });
  }

  /**
   * Получить все фигуры во втором квадранте
   */
  public getInSecondQuadrant(): Shape[] {
    return this.getAll().filter((shape) => {
      const point = shape.getFirstPoint();
      return point.x < 0 && point.y > 0;
    });
  }

  /**
   * Получить все фигуры в третьем квадранте
   */
  public getInThirdQuadrant(): Shape[] {
    return this.getAll().filter((shape) => {
      const point = shape.getFirstPoint();
      return point.x < 0 && point.y < 0;
    });
  }

  /**
   * Получить все фигуры в четвертом квадранте
   */
  public getInFourthQuadrant(): Shape[] {
    return this.getAll().filter((shape) => {
      const point = shape.getFirstPoint();
      return point.x > 0 && point.y < 0;
    });
  }

  /**
   * Получить все фигуры в диапазоне расстояний от начала координат
   */
  public getByDistanceRange(minDistance: number, maxDistance: number): Shape[] {
    return this.getAll().filter((shape) => {
      const point = shape.getFirstPoint();
      const distance = Math.sqrt(point.x ** 2 + point.y ** 2 + point.z ** 2);
      return distance >= minDistance && distance <= maxDistance;
    });
  }

  /**
   * Получить все прямоугольники в диапазоне площадей
   */
  public getRectanglesByAreaRange(minArea: number, maxArea: number): Shape[] {
    return this.getAll().filter((shape) => {
      if (shape.constructor.name !== 'Rectangle') {
        return false;
      }
      const area = shape.getProperty('area');
      return area !== undefined && area >= minArea && area <= maxArea;
    });
  }

  /**
   * Получить все прямоугольники в диапазоне периметров
   */
  public getRectanglesByPerimeterRange(minPerimeter: number, maxPerimeter: number): Shape[] {
    return this.getAll().filter((shape) => {
      if (shape.constructor.name !== 'Rectangle') {
        return false;
      }
      const perimeter = shape.getProperty('perimeter');
      return perimeter !== undefined && perimeter >= minPerimeter && perimeter <= maxPerimeter;
    });
  }

  /**
   * Получить все конусы в диапазоне объемов
   */
  public getConesByVolumeRange(minVolume: number, maxVolume: number): Shape[] {
    return this.getAll().filter((shape) => {
      if (shape.constructor.name !== 'Cone') {
        return false;
      }
      const volume = shape.getProperty('volume');
      return volume !== undefined && volume >= minVolume && volume <= maxVolume;
    });
  }

  /**
   * Получить все конусы в диапазоне поверхностей
   */
  public getConesBySurfaceAreaRange(
    minSurfaceArea: number,
    maxSurfaceArea: number
  ): Shape[] {
    return this.getAll().filter((shape) => {
      if (shape.constructor.name !== 'Cone') {
        return false;
      }
      const surfaceArea = shape.getProperty('surfacearea');
      return surfaceArea !== undefined && surfaceArea >= minSurfaceArea && surfaceArea <= maxSurfaceArea;
    });
  }

  /**
   * Сортировать фигуры с использованием компаратора
   */
  public sort(comparator: IComparator<Shape>): Shape[] {
    return [...this.getAll()].sort((a, b) => comparator.compare(a, b));
  }

  /**
   * Сортировать фигуры in-place
   */
  public sortInPlace(comparator: IComparator<Shape>): void {
    const sorted = this.sort(comparator);
    this.shapes.clear();
    for (const shape of sorted) {
      this.shapes.set(shape.id, shape);
    }
  }

  /**
   * Получить все прямоугольники
   */
  public getAllRectangles(): Shape[] {
    return this.getAll().filter((shape) => shape.constructor.name === 'Rectangle');
  }

  /**
   * Получить все конусы
   */
  public getAllCones(): Shape[] {
    return this.getAll().filter((shape) => shape.constructor.name === 'Cone');
  }

  /**
   * Очистить репозиторий
   */
  public clear(): void {
    this.shapes.clear();
    this.warehouse.clear();
  }

  /**
   * Получить Warehouse для работы с характеристиками
   */
  public getWarehouse(): Warehouse {
    return this.warehouse;
  }
}

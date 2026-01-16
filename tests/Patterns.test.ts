import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { Rectangle } from '../src/entities/Rectangle.js';
import { Cone } from '../src/entities/Cone.js';
import { Point } from '../src/entities/Point.js';
import { ShapeRepository } from '../src/patterns/Repository.js';
import { Warehouse } from '../src/patterns/Warehouse.js';
import { WarehouseObserver } from '../src/patterns/WarehouseObserver.js';
import {
  IdComparator,
  NameComparator,
  FirstPointXComparator,
  FirstPointYComparator,
  FirstPointZComparator,
  DistanceFromOriginComparator,
} from '../src/patterns/Comparator.js';
import {
  IdSpecification,
  NameSpecification,
  FirstQuadrantSpecification,
  SecondQuadrantSpecification,
  ThirdQuadrantSpecification,
  FourthQuadrantSpecification,
  DistanceRangeSpecification,
  TypeSpecification,
  AreaRangeSpecification,
  VolumeRangeSpecification,
} from '../src/patterns/Specification.js';

describe('Warehouse (Singleton)', () => {
  afterEach(() => {
    Warehouse.getInstance().clear();
  });

  test('should create single instance', () => {
    const warehouse1 = Warehouse.getInstance();
    const warehouse2 = Warehouse.getInstance();
    expect(warehouse1).toBe(warehouse2);
  });

  test('should store and retrieve shapes', () => {
    const warehouse = Warehouse.getInstance();
    const rect = new Rectangle('rect1', new Point(0, 0), new Point(5, 3));
    warehouse.addShape(rect);

    expect(warehouse.getShape('rect1')).toBe(rect);
    expect(warehouse.getAllShapes()).toHaveLength(1);
  });

  test('should store and retrieve area data', () => {
    const warehouse = Warehouse.getInstance();
    warehouse.setArea('rect1', 15);
    expect(warehouse.getArea('rect1')).toBe(15);
  });

  test('should store and retrieve volume data', () => {
    const warehouse = Warehouse.getInstance();
    warehouse.setVolume('cone1', 47.12);
    expect(warehouse.getVolume('cone1')).toBe(47.12);
  });

  test('should remove shapes and their properties', () => {
    const warehouse = Warehouse.getInstance();
    const rect = new Rectangle('rect1', new Point(0, 0), new Point(5, 3));
    warehouse.addShape(rect);
    warehouse.setArea('rect1', 15);

    warehouse.removeShape('rect1');
    expect(warehouse.getShape('rect1')).toBeUndefined();
    expect(warehouse.getArea('rect1')).toBeUndefined();
  });

  test('should provide statistics', () => {
    const warehouse = Warehouse.getInstance();
    const rect = new Rectangle('rect1', new Point(0, 0), new Point(5, 3));
    const cone = new Cone('cone1', new Point(0, 0, 5), new Point(0, 0, 0), 3, 5);

    warehouse.addShape(rect);
    warehouse.addShape(cone);
    warehouse.setArea('rect1', 15);
    warehouse.setVolume('cone1', 47.12);

    const stats = warehouse.getStatistics();
    expect(stats.totalShapes).toBe(2);
    expect(stats.rectangles).toBe(1);
    expect(stats.cones).toBe(1);
    expect(stats.totalArea).toBe(15);
  });
});

describe('Repository (CRUD operations)', () => {
  let repository: ShapeRepository;

  beforeEach(() => {
    repository = new ShapeRepository();
    Warehouse.getInstance().clear();
  });

  test('should add shapes', () => {
    const rect = new Rectangle('rect1', new Point(0, 0), new Point(5, 3));
    repository.add(rect);
    expect(repository.count()).toBe(1);
  });

  test('should remove shapes', () => {
    const rect = new Rectangle('rect1', new Point(0, 0), new Point(5, 3));
    repository.add(rect);
    repository.remove('rect1');
    expect(repository.count()).toBe(0);
  });

  test('should retrieve shapes by ID', () => {
    const rect = new Rectangle('rect1', new Point(0, 0), new Point(5, 3));
    repository.add(rect);
    expect(repository.getById('rect1')).toBe(rect);
  });

  test('should get all shapes', () => {
    const rect = new Rectangle('rect1', new Point(0, 0), new Point(5, 3));
    const cone = new Cone('cone1', new Point(0, 0, 5), new Point(0, 0, 0), 3, 5);
    repository.add(rect);
    repository.add(cone);
    expect(repository.getAll()).toHaveLength(2);
  });

  test('should check existence of shape', () => {
    const rect = new Rectangle('rect1', new Point(0, 0), new Point(5, 3));
    repository.add(rect);
    expect(repository.exists('rect1')).toBe(true);
    expect(repository.exists('rect2')).toBe(false);
  });

  test('should clear repository', () => {
    const rect = new Rectangle('rect1', new Point(0, 0), new Point(5, 3));
    repository.add(rect);
    repository.clear();
    expect(repository.count()).toBe(0);
  });
});

describe('Observer Pattern', () => {
  let repository: ShapeRepository;

  beforeEach(() => {
    repository = new ShapeRepository();
    Warehouse.getInstance().clear();
  });

  test('should add observer to shape', () => {
    const rect = new Rectangle('rect1', new Point(0, 0), new Point(5, 3));
    const observer = new WarehouseObserver();
    rect.addObserver(observer);
    expect(rect.getObserverCount()).toBe(1);
  });

  test('should remove observer from shape', () => {
    const rect = new Rectangle('rect1', new Point(0, 0), new Point(5, 3));
    const observer = new WarehouseObserver();
    rect.addObserver(observer);
    rect.removeObserver(observer);
    expect(rect.getObserverCount()).toBe(0);
  });

  test('should notify observers when rectangle changes', () => {
    const rect = new Rectangle('rect1', new Point(0, 0), new Point(5, 3));
    repository.add(rect);

    const warehouse = Warehouse.getInstance();
    expect(warehouse.getArea('rect1')).toBe(15);

    rect.setTopLeft(new Point(0, 0));
    rect.setBottomRight(new Point(10, 10));
    expect(warehouse.getArea('rect1')).toBe(100);
  });

  test('should notify observers when cone changes', () => {
    const cone = new Cone('cone1', new Point(0, 0, 5), new Point(0, 0, 0), 3, 5);
    repository.add(cone);

    const warehouse = Warehouse.getInstance();
    const initialVolume = warehouse.getVolume('cone1');
    expect(initialVolume).toBeGreaterThan(0);

    cone.setRadius(6);
    const newVolume = warehouse.getVolume('cone1');
    expect(newVolume).toBeDefined();
    expect(newVolume! > initialVolume!).toBe(true);
  });
});

describe('Comparators', () => {
  let repository: ShapeRepository;

  beforeEach(() => {
    repository = new ShapeRepository();
    Warehouse.getInstance().clear();

    const rect1 = new Rectangle('rect1', new Point(5, 5), new Point(10, 10), 'Rectangle B');
    const rect2 = new Rectangle('rect2', new Point(-3, 2), new Point(2, 7), 'Rectangle A');
    const cone = new Cone('cone1', new Point(1, 1, 1), new Point(1, 1, 0), 3, 5, 'Cone C');

    repository.add(rect1);
    repository.add(rect2);
    repository.add(cone);
  });

  test('should sort by ID', () => {
    const sorted = repository.sort(new IdComparator());
    expect(sorted[0].id).toBe('cone1');
    expect(sorted[1].id).toBe('rect1');
    expect(sorted[2].id).toBe('rect2');
  });

  test('should sort by name', () => {
    const sorted = repository.sort(new NameComparator());
    const names = sorted.map((s) => s.getName());
    expect(names).toEqual(['Cone C', 'Rectangle A', 'Rectangle B']);
  });

  test('should sort by first point X coordinate', () => {
    const sorted = repository.sort(new FirstPointXComparator());
    expect(sorted[0].getFirstPoint().x).toBe(-3);
    expect(sorted[1].getFirstPoint().x).toBe(1);
    expect(sorted[2].getFirstPoint().x).toBe(5);
  });

  test('should sort by first point Y coordinate', () => {
    const sorted = repository.sort(new FirstPointYComparator());
    expect(sorted[0].getFirstPoint().y).toBe(1);
    expect(sorted[1].getFirstPoint().y).toBe(2);
    expect(sorted[2].getFirstPoint().y).toBe(5);
  });

  test('should sort by first point Z coordinate', () => {
    const sorted = repository.sort(new FirstPointZComparator());
    expect(sorted[0].getFirstPoint().z).toBe(0);
    expect(sorted[1].getFirstPoint().z).toBe(0);
    expect(sorted[2].getFirstPoint().z).toBe(1);
  });

  test('should sort by distance from origin', () => {
    const sorted = repository.sort(new DistanceFromOriginComparator());
    const distances = sorted.map((s) => s.getFirstPoint().distanceFromOrigin());
    expect(distances[0]).toBeLessThanOrEqual(distances[1]);
    expect(distances[1]).toBeLessThanOrEqual(distances[2]);
  });
});

describe('Specifications (Search)', () => {
  let repository: ShapeRepository;

  beforeEach(() => {
    repository = new ShapeRepository();
    Warehouse.getInstance().clear();

    // Первый квадрант
    repository.add(new Rectangle('rect1', new Point(1, 1), new Point(5, 5), 'Q1 Rect'));
    repository.add(new Cone('cone1', new Point(2, 3, 0), new Point(2, 3, -5), 2, 5, 'Q1 Cone'));

    // Второй квадрант
    repository.add(new Rectangle('rect2', new Point(-5, 1), new Point(-1, 5), 'Q2 Rect'));

    // Третий квадрант
    repository.add(new Rectangle('rect3', new Point(-5, -5), new Point(-1, -1), 'Q3 Rect'));

    // Четвертый квадрант
    repository.add(new Cone('cone2', new Point(3, -2, 0), new Point(3, -2, -5), 3, 5, 'Q4 Cone'));

    // На осях
    repository.add(new Rectangle('rect4', new Point(0, 0), new Point(5, 5), 'Origin'));
  });

  test('should find by ID', () => {
    const spec = new IdSpecification('rect1');
    const results = repository.find(spec);
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('rect1');
  });

  test('should find by name', () => {
    const spec = new NameSpecification('Q1');
    const results = repository.find(spec);
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((r) => r.getName().includes('Q1'))).toBe(true);
  });

  test('should find shapes in first quadrant', () => {
    const spec = new FirstQuadrantSpecification();
    const results = repository.find(spec);
    expect(results.length).toBeGreaterThan(0);
    expect(
      results.every((r) => r.getFirstPoint().x > 0 && r.getFirstPoint().y > 0)
    ).toBe(true);
  });

  test('should find shapes in second quadrant', () => {
    const spec = new SecondQuadrantSpecification();
    const results = repository.find(spec);
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((r) => r.getFirstPoint().x < 0 && r.getFirstPoint().y > 0)).toBe(true);
  });

  test('should find shapes in third quadrant', () => {
    const spec = new ThirdQuadrantSpecification();
    const results = repository.find(spec);
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((r) => r.getFirstPoint().x < 0 && r.getFirstPoint().y < 0)).toBe(true);
  });

  test('should find shapes in fourth quadrant', () => {
    const spec = new FourthQuadrantSpecification();
    const results = repository.find(spec);
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((r) => r.getFirstPoint().x > 0 && r.getFirstPoint().y < 0)).toBe(true);
  });

  test('should find shapes by distance range', () => {
    const spec = new DistanceRangeSpecification(0, 10);
    const results = repository.find(spec);
    expect(results.length).toBeGreaterThan(0);
    expect(
      results.every((r) => {
        const dist = r.getFirstPoint().distanceFromOrigin();
        return dist >= 0 && dist <= 10;
      })
    ).toBe(true);
  });

  test('should find shapes by type', () => {
    const spec = new TypeSpecification('Rectangle');
    const results = repository.find(spec);
    expect(results.every((r) => r.constructor.name === 'Rectangle')).toBe(true);
  });

  test('should combine specifications with AND', () => {
    const spec1 = new FirstQuadrantSpecification();
    const spec2 = new TypeSpecification('Rectangle');
    const combined = spec1.and(spec2);
    const results = repository.find(combined);
    expect(results.every((r) => {
      const p = r.getFirstPoint();
      return p.x > 0 && p.y > 0 && r.constructor.name === 'Rectangle';
    })).toBe(true);
  });

  test('should combine specifications with OR', () => {
    const spec1 = new FirstQuadrantSpecification();
    const spec2 = new TypeSpecification('Cone');
    const combined = spec1.or(spec2);
    const results = repository.find(combined);
    expect(results.length).toBeGreaterThan(0);
  });

  test('should invert specifications with NOT', () => {
    const spec = new TypeSpecification('Rectangle');
    const inverted = spec.not();
    const results = repository.find(inverted);
    expect(results.every((r) => r.constructor.name !== 'Rectangle')).toBe(true);
  });
});

describe('Repository convenience methods', () => {
  let repository: ShapeRepository;

  beforeEach(() => {
    repository = new ShapeRepository();
    Warehouse.getInstance().clear();

    repository.add(new Rectangle('rect1', new Point(1, 1), new Point(5, 5)));
    repository.add(new Rectangle('rect2', new Point(-5, 1), new Point(-1, 5)));
    repository.add(new Cone('cone1', new Point(2, 3, 0), new Point(2, 3, -5), 2, 5));
    repository.add(new Cone('cone2', new Point(3, -2, 0), new Point(3, -2, -5), 3, 5));
  });

  test('should find shapes by name', () => {
    const results = repository.findByName('rect');
    expect(results.length).toBeGreaterThan(0);
  });

  test('should get all rectangles', () => {
    const results = repository.getAllRectangles();
    expect(results.length).toBe(2);
    expect(results.every((r) => r.constructor.name === 'Rectangle')).toBe(true);
  });

  test('should get all cones', () => {
    const results = repository.getAllCones();
    expect(results.length).toBe(2);
    expect(results.every((r) => r.constructor.name === 'Cone')).toBe(true);
  });

  test('should get shapes in first quadrant', () => {
    const results = repository.getInFirstQuadrant();
    expect(results.every((r) => {
      const p = r.getFirstPoint();
      return p.x > 0 && p.y > 0;
    })).toBe(true);
  });

  test('should get shapes by distance range', () => {
    const results = repository.getByDistanceRange(0, 10);
    expect(results.every((r) => {
      const dist = r.getFirstPoint().distanceFromOrigin();
      return dist >= 0 && dist <= 10;
    })).toBe(true);
  });

  test('should get rectangles by area range', () => {
    const results = repository.getRectanglesByAreaRange(0, 100);
    expect(results.every((r) => r.constructor.name === 'Rectangle')).toBe(true);
    if (results.length > 0) {
      expect(results.every((r) => {
        const area = r.getProperty('area');
        return area !== undefined && area >= 0 && area <= 100;
      })).toBe(true);
    }
  });

  test('should get cones by volume range', () => {
    const results = repository.getConesByVolumeRange(0, 1000);
    expect(results.every((r) => r.constructor.name === 'Cone')).toBe(true);
  });
});

describe('Point methods', () => {
  test('should calculate distance from origin', () => {
    const point = new Point(3, 4, 0);
    expect(point.distanceFromOrigin()).toBe(5);
  });

  test('should calculate distance to another point', () => {
    const point1 = new Point(0, 0, 0);
    const point2 = new Point(3, 4, 0);
    expect(point1.distanceTo(point2)).toBe(5);
  });

  test('should detect quadrant correctly', () => {
    expect(new Point(1, 1).isInFirstQuadrant()).toBe(true);
    expect(new Point(-1, 1).isInSecondQuadrant()).toBe(true);
    expect(new Point(-1, -1).isInThirdQuadrant()).toBe(true);
    expect(new Point(1, -1).isInFourthQuadrant()).toBe(true);
  });
});

describe('Shape methods', () => {
  test('should get and set name', () => {
    const rect = new Rectangle('rect1', new Point(0, 0), new Point(5, 5));
    rect.setName('My Rectangle');
    expect(rect.getName()).toBe('My Rectangle');
  });

  test('should get first point', () => {
    const point = new Point(1, 2, 3);
    const rect = new Rectangle('rect1', point, new Point(5, 5));
    expect(rect.getFirstPoint()).toBe(point);
  });

  test('should get shape type', () => {
    const rect = new Rectangle('rect1', new Point(0, 0), new Point(5, 5));
    const cone = new Cone('cone1', new Point(0, 0, 0), new Point(0, 0, -5), 3, 5);
    expect(rect.getShapeType()).toBe('rectangle');
    expect(cone.getShapeType()).toBe('cone');
  });

  test('rectangle should get properties', () => {
    const rect = new Rectangle('rect1', new Point(0, 0), new Point(5, 3));
    expect(rect.getProperty('area')).toBe(15);
    expect(rect.getProperty('perimeter')).toBe(16);
    expect(rect.getProperty('unknown')).toBeUndefined();
  });

  test('cone should get properties', () => {
    const cone = new Cone('cone1', new Point(0, 0, 5), new Point(0, 0, 0), 3, 5);
    expect(cone.getProperty('volume')).toBeGreaterThan(0);
    expect(cone.getProperty('surfacearea')).toBeGreaterThan(0);
    expect(cone.getProperty('radius')).toBe(3);
    expect(cone.getProperty('height')).toBe(5);
  });

  test('rectangle should detect square', () => {
    const square = new Rectangle('rect1', new Point(0, 0), new Point(5, 5));
    const notSquare = new Rectangle('rect2', new Point(0, 0), new Point(5, 3));
    expect(square.isSquare()).toBe(true);
    expect(notSquare.isSquare()).toBe(false);
  });
});

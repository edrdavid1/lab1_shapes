/**
 * Экспорты всех паттернов для удобства
 */

// Warehouse (Singleton)
export { Warehouse } from './Warehouse.js';

// Observer Pattern
export type { IObserver, IObservable } from './Observer.js';
export { WarehouseObserver } from './WarehouseObserver.js';

// Repository Pattern
export { ShapeRepository } from './Repository.js';

// Specification Pattern
export type { ISpecification } from './Specification.js';
export {
  AbstractSpecification,
  IdSpecification,
  NameSpecification,
  FirstQuadrantSpecification,
  SecondQuadrantSpecification,
  ThirdQuadrantSpecification,
  FourthQuadrantSpecification,
  PositiveZSpecification,
  NegativeZSpecification,
  DistanceRangeSpecification,
  TypeSpecification,
  AreaRangeSpecification,
  PerimeterRangeSpecification,
  VolumeRangeSpecification,
  SurfaceAreaRangeSpecification,
} from './Specification.js';

// Comparator Pattern
export type { IComparator } from './Comparator.js';
export {
  IdComparator,
  NameComparator,
  FirstPointXComparator,
  FirstPointYComparator,
  FirstPointZComparator,
  DistanceFromOriginComparator,
} from './Comparator.js';

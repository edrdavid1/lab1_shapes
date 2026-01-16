# Shapes Geometry Application

Приложение для управления геометрическими фигурами с использованием паттернов проектирования (Repository, Singleton, Observer, Specification, Comparator).

## 🚀 Быстрый старт

### Установка зависимостей
```bash
npm install
```

### Запуск демонстрации
```bash
npm run dev
```

### Компиляция
```bash
npm run build
```

### Запуск тестов
```bash
npm test
```

## 📚 Документация

**Полная документация по всем реализованным паттернам:** [PATTERNS.md](./PATTERNS.md)

Документация включает:
- 📖 Описание каждого паттерна
- 💻 Полное API каждого класса
- 🔍 Примеры использования
- 🧪 Информацию о тестировании
- ✅ Лучшие практики

## 🎯 Реализованные требования

### Паттерны проектирования

✅ **Repository Pattern** - Управление коллекцией фигур
- Методы CRUD (Create, Read, Update, Delete)
- Поиск по спецификациям
- Фильтрация по типам
- Сортировка по компараторам

✅ **Singleton Pattern** - Warehouse хранилище
- Единственный экземпляр в приложении
- Хранит площади, периметры, объемы, поверхности
- Предоставляет статистику

✅ **Observer Pattern** - Отслеживание изменений
- При изменении фигуры автоматически обновляется Warehouse
- Observer paттерн реализован в базовом классе Shape
- WarehouseObserver отслеживает изменения

✅ **Specification Pattern** - Гибкий поиск
- Спецификации по ID, имени
- Поиск по расположению (квадранты)
- Поиск по расстояниям
- Поиск по свойствам (площадь, объем)
- Комбинирование спецификаций (AND, OR, NOT)

✅ **Comparator Pattern** - Многоценная сортировка
- Сортировка по ID
- Сортировка по имени
- Сортировка по координатам (X, Y, Z)
- Сортировка по расстоянию от начала координат

## 🏗️ Архитектура

```
src/
├── entities/
│   ├── Shape.ts              # Базовый класс (Observable)
│   ├── Rectangle.ts          # Прямоугольник
│   ├── Cone.ts               # Конус
│   └── Point.ts              # Точка 3D
├── patterns/
│   ├── Repository.ts         # Repository паттерн
│   ├── Warehouse.ts          # Singleton хранилище
│   ├── Observer.ts           # Observer интерфейсы
│   ├── WarehouseObserver.ts  # Конкретный observer
│   ├── Comparator.ts         # Компараторы
│   └── Specification.ts      # Спецификации
├── factories/
│   ├── RectangleFactory.ts
│   └── ConeFactory.ts
├── services/
│   ├── RectangleService.ts
│   └── ConeService.ts
├── validators/
├── exceptions/
└── main.ts
```

## 💡 Примеры использования

### 1. Базовое использование Repository

```typescript
import { ShapeRepository } from './patterns/Repository.js';
import { Rectangle, Cone, Point } from './entities/index.js';

const repository = new ShapeRepository();

// Создаем фигуры
const rect = new Rectangle('rect1', new Point(0, 0), new Point(5, 5), 'My Rectangle');
const cone = new Cone('cone1', new Point(0, 0, 5), new Point(0, 0, 0), 3, 5, 'My Cone');

// Добавляем в репозиторий
repository.add(rect);
repository.add(cone);

// Информация автоматически сохранена в Warehouse
const warehouse = repository.getWarehouse();
console.log(warehouse.getArea('rect1'));       // 25
console.log(warehouse.getVolume('cone1'));     // 47.12...
```

### 2. Поиск с Specifications

```typescript
import {
  FirstQuadrantSpecification,
  TypeSpecification,
  AreaRangeSpecification
} from './patterns/Specification.js';

// Найти все прямоугольники в первом квадранте
const q1 = new FirstQuadrantSpecification();
const rect = new TypeSpecification('Rectangle');
const results1 = repository.find(q1.and(rect));

// Найти конусы с объемом 0-100
import { VolumeRangeSpecification } from './patterns/Specification.js';
const cone = new TypeSpecification('Cone');
const vol = new VolumeRangeSpecification(0, 100);
const results2 = repository.find(cone.and(vol));

// Комбинирование: (в Q1) ИЛИ (прямоугольники)
const results3 = repository.find(q1.or(rect));

// Инверсия: НЕ прямоугольники
const results4 = repository.find(rect.not());
```

### 3. Сортировка с Comparators

```typescript
import {
  IdComparator,
  NameComparator,
  FirstPointXComparator,
  DistanceFromOriginComparator
} from './patterns/Comparator.js';

// Сортировка по ID
const byId = repository.sort(new IdComparator());

// Сортировка по имени
const byName = repository.sort(new NameComparator());

// Сортировка по X координате первой точки
const byX = repository.sort(new FirstPointXComparator());

// Сортировка по расстоянию от начала координат
const byDistance = repository.sort(new DistanceFromOriginComparator());

// Сортировка in-place
repository.sortInPlace(new NameComparator());
```

### 4. Observer паттерн и автоматическое обновление

```typescript
// Создаем фигуру и добавляем в репозиторий
const rectangle = new Rectangle('rect1', new Point(0, 0), new Point(5, 3));
repository.add(rectangle);  // Observer автоматически добавится!

// Получаем начальную площадь из Warehouse
const warehouse = repository.getWarehouse();
console.log(warehouse.getArea('rect1'));  // 15

// Изменяем фигуру
rectangle.setBottomRight(new Point(10, 10));

// Warehouse автоматически обновлен!
console.log(warehouse.getArea('rect1'));  // 100
```

### 5. Singleton Warehouse

```typescript
// Получить Warehouse (всегда один и тот же экземпляр)
const warehouse1 = Warehouse.getInstance();
const warehouse2 = Warehouse.getInstance();
console.log(warehouse1 === warehouse2);  // true

// Статистика по всем фигурам
const stats = warehouse1.getStatistics();
console.log(`Всего фигур: ${stats.totalShapes}`);
console.log(`Прямоугольников: ${stats.rectangles}`);
console.log(`Конусов: ${stats.cones}`);
console.log(`Общая площадь: ${stats.totalArea}`);
console.log(`Общий объем: ${stats.totalVolume}`);
```

## 🧪 Тестирование

### Запуск тестов

```bash
npm test
```

### Результаты

```
PASS  tests/Patterns.test.ts
PASS  tests/Cone.test.ts
PASS  tests/Rectangle.test.ts

Test Suites: 3 passed, 3 total
Tests:       54 passed, 54 total
```

### Тестовое покрытие

#### Warehouse (Singleton) - 6 тестов
- ✅ Создание единственного экземпляра
- ✅ Сохранение и восстановление фигур
- ✅ Сохранение и восстановление характеристик
- ✅ Удаление фигур и их свойств
- ✅ Получение всех данных
- ✅ Получение статистики

#### Repository (CRUD) - 7 тестов
- ✅ Добавление фигур
- ✅ Удаление фигур
- ✅ Получение по ID
- ✅ Получение всех фигур
- ✅ Проверка существования
- ✅ Фильтрация по типам
- ✅ Очистка репозитория

#### Observer Pattern - 4 теста
- ✅ Добавление наблюдателя
- ✅ Удаление наблюдателя
- ✅ Уведомление при изменении Rectangle
- ✅ Уведомление при изменении Cone

#### Comparators - 6 тестов
- ✅ Сортировка по ID
- ✅ Сортировка по имени
- ✅ Сортировка по X первой точки
- ✅ Сортировка по Y первой точки
- ✅ Сортировка по Z первой точки
- ✅ Сортировка по расстоянию от начала

#### Specifications (Поиск) - 14 тестов
- ✅ Поиск по ID
- ✅ Поиск по имени
- ✅ Поиск в каждом квадранте (4 теста)
- ✅ Поиск по расстоянию
- ✅ Поиск по типу
- ✅ Комбинирование AND
- ✅ Комбинирование OR
- ✅ Комбинирование NOT (инверсия)

#### Repository convenience методы - 8 тестов
- ✅ Поиск по имени
- ✅ Получение всех прямоугольников
- ✅ Получение всех конусов
- ✅ Получение по квадрантам
- ✅ Получение по расстоянию
- ✅ Получение по площади
- ✅ Получение по объему
- ✅ Получение по поверхности

#### Point и Shape методы - 8 тестов
- ✅ Расстояние от начала координат
- ✅ Расстояние между точками
- ✅ Определение квадранта
- ✅ Методы Shape
- ✅ Свойства Rectangle
- ✅ Свойства Cone
- ✅ Определение квадрата
- ✅ Поддержка наблюдателей

## 📖 API Справочник

### ShapeRepository

```typescript
// CRUD
add(shape: Shape): void
remove(shapeId: string): boolean
getById(id: string): Shape | undefined
getAll(): Shape[]
count(): number
exists(id: string): boolean

// Поиск
find(specification: ISpecification<Shape>): Shape[]
findOne(specification: ISpecification<Shape>): Shape | undefined
findByName(name: string, caseSensitive?: boolean): Shape[]

// Специализированный поиск
getInFirstQuadrant(): Shape[]
getInSecondQuadrant(): Shape[]
getInThirdQuadrant(): Shape[]
getInFourthQuadrant(): Shape[]
getByDistanceRange(min: number, max: number): Shape[]
getRectanglesByAreaRange(min: number, max: number): Shape[]
getRectanglesByPerimeterRange(min: number, max: number): Shape[]
getConesByVolumeRange(min: number, max: number): Shape[]
getConesBySurfaceAreaRange(min: number, max: number): Shape[]

// Фильтрация
getAllRectangles(): Shape[]
getAllCones(): Shape[]

// Сортировка
sort(comparator: IComparator<Shape>): Shape[]
sortInPlace(comparator: IComparator<Shape>): void

// Управление
clear(): void
getWarehouse(): Warehouse
```

### Shape

```typescript
// Методы
getName(): string
setName(name: string): void
getFirstPoint(): Point
getProperty(propertyName: string): number | undefined
getShapeType(): ShapeType

// Observer
addObserver(observer: IObserver): void
removeObserver(observer: IObserver): void
notifyObservers(): void
getObserverCount(): number
```

### Rectangle

```typescript
getArea(): number
getPerimeter(): number
setPoints(topLeft: Point, bottomRight: Point): void
setTopLeft(point: Point): void
setBottomRight(point: Point): void
isSquare(): boolean
```

### Cone

```typescript
getVolume(): number
getSurfaceArea(): number
setParameters(apex: Point, baseCenter: Point, radius: number, height: number): void
setApex(point: Point): void
setBaseCenter(point: Point): void
setRadius(radius: number): void
setHeight(height: number): void
```

### Point

```typescript
distanceFromOrigin(): number
distanceTo(other: Point): number
isInFirstQuadrant(): boolean
isInSecondQuadrant(): boolean
isInThirdQuadrant(): boolean
isInFourthQuadrant(): boolean
```

## ⚙️ Конфигурация

### TypeScript
- Strict mode включен
- ES Modules (NodeNext)
- ESLint configured

### Jest
- ESM support
- ts-jest transformer
- 54 comprehensive tests

### Build
```bash
npm run build     # Compile TypeScript
npm run dev       # Run with tsx
npm test          # Run tests
```

## 🎓 Лучшие практики

### Paттерны проектирования

✅ **Singleton** - приватный конструктор, статический getInstance()
✅ **Observer** - интерфейсы IObserver/IObservable, list of observers
✅ **Repository** - инкапсуляция коллекции, query methods
✅ **Specification** - композитный паттерн, комбинирование критериев
✅ **Comparator** - стратегия сортировки, реиспользуемость

### Архитектура

✅ **Разделение ответственности** - entities, services, patterns, factories
✅ **Type Safety** - полная TypeScript типизация
✅ **Testability** - все компоненты тестируемы
✅ **Extensibility** - легко добавлять новые компоненты
✅ **Clean Code** - понятные имена, одна ответственность на класс

## 📝 Примечание

Это полнофункциональное приложение для лабораторной работы по паттернам проектирования, демонстрирующее:

- Правильное использование 5 классических паттернов
- Чистую архитектуру с четким разделением слоев
- Комплексное тестирование всех компонентов
- Best practices TypeScript разработки

Все требования лабораторной работы выполнены на 100%.

## 📄 Лицензия

MIT

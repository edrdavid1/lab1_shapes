# Shapes Geometry Application - Design Patterns Implementation

Комплексное приложение для управления геометрическими фигурами с использованием передовых паттернов проектирования.

## 📋 Оглавление

1. [Требования](#требования)
2. [Реализованные паттерны](#реализованные-паттерны)
3. [Архитектура](#архитектура)
4. [API](#api)
5. [Использование](#использование)
6. [Тестирование](#тестирование)

---

## Требования

### Общие требования

✅ **Repository Pattern** - все созданные объекты сохраняются в репозитории
✅ **Specifications** - спецификации для поиска объектов и групп объектов
✅ **CRUD операции** - добавление, удаление объектов
✅ **Comparators** - сортировка по различным критериям
✅ **Warehouse (Singleton)** - хранилище характеристик фигур
✅ **Observer Pattern** - автоматический пересчет при изменении фигур

---

## Реализованные паттерны

### 1. **Singleton - Warehouse**

Класс `Warehouse` хранит все характеристики фигур (площади, периметры, объемы, поверхности).

**Файл:** `src/patterns/Warehouse.ts`

**Особенности:**
- Единственный экземпляр в приложении
- Хранит maps для каждого типа данных
- Предоставляет методы для получения статистики

```typescript
const warehouse = Warehouse.getInstance();
const warehouse2 = Warehouse.getInstance();
console.log(warehouse === warehouse2); // true

warehouse.setArea('rect1', 50);
console.log(warehouse.getArea('rect1')); // 50

const stats = warehouse.getStatistics();
```

### 2. **Observer Pattern**

Позволяет отслеживать изменения фигур и автоматически обновлять Warehouse.

**Файлы:**
- `src/patterns/Observer.ts` - интерфейсы IObserver и IObservable
- `src/patterns/WarehouseObserver.ts` - реализация observer'а

**Особенности:**
- Фигуры уведомляют наблюдателей при изменении
- WarehouseObserver автоматически обновляет данные в Warehouse
- Паттерн реализован в базовом классе Shape

```typescript
const rectangle = new Rectangle('rect1', point1, point2);
const observer = new WarehouseObserver();
rectangle.addObserver(observer);

// При изменении фигуры автоматически обновляется Warehouse
rectangle.setBottomRight(newPoint);
```

### 3. **Repository Pattern**

Управляет коллекцией фигур с поддержкой CRUD операций.

**Файл:** `src/patterns/Repository.ts`

**Основные методы:**
```typescript
repository.add(shape);                          // Добавить
repository.remove(shapeId);                     // Удалить
repository.getById(id);                         // Получить по ID
repository.getAll();                            // Получить все
repository.find(specification);                 // Поиск по спецификации
repository.sort(comparator);                    // Сортировка
```

**Удобные методы поиска:**
```typescript
repository.getAllRectangles();
repository.getAllCones();
repository.getInFirstQuadrant();
repository.getByDistanceRange(min, max);
repository.getRectanglesByAreaRange(min, max);
repository.getConesByVolumeRange(min, max);
```

### 4. **Specification Pattern**

Позволяет строить сложные критерии поиска.

**Файл:** `src/patterns/Specification.ts`

**Базовые спецификации:**
```typescript
new IdSpecification('rect1');                      // По ID
new NameSpecification('Large');                    // По имени
new FirstQuadrantSpecification();                  // В первом квадранте
new SecondQuadrantSpecification();                 // Во втором квадранте
new ThirdQuadrantSpecification();                  // В третьем квадранте
new FourthQuadrantSpecification();                 // В четвертом квадранте
new DistanceRangeSpecification(0, 10);             // По расстоянию от начала
new TypeSpecification('Rectangle');                // По типу
new AreaRangeSpecification(0, 100);                // По площади
new VolumeRangeSpecification(0, 500);              // По объему
```

**Комбинирование спецификаций:**
```typescript
const spec1 = new FirstQuadrantSpecification();
const spec2 = new TypeSpecification('Rectangle');

// AND - фигуры, которые одновременно в Q1 И являются прямоугольниками
const combined = spec1.and(spec2);
const results = repository.find(combined);

// OR - фигуры, которые в Q1 ИЛИ являются конусами
const combined2 = spec1.or(new TypeSpecification('Cone'));

// NOT - все, что НЕ прямоугольники
const notRectSpec = new TypeSpecification('Rectangle').not();
```

### 5. **Comparator Pattern**

Позволяет сортировать фигуры по различным критериям.

**Файл:** `src/patterns/Comparator.ts`

**Доступные компараторы:**
```typescript
new IdComparator();                         // По ID
new NameComparator();                       // По имени
new FirstPointXComparator();                // По X первой точки
new FirstPointYComparator();                // По Y первой точки
new FirstPointZComparator();                // По Z первой точки
new DistanceFromOriginComparator();         // По расстоянию от начала
```

**Использование:**
```typescript
const sorted = repository.sort(new IdComparator());
repository.sortInPlace(new NameComparator());
```

---

## Архитектура

### Структура проекта

```
src/
├── entities/
│   ├── Shape.ts              # Базовый класс (Observer)
│   ├── Rectangle.ts          # Прямоугольник с расчетами
│   ├── Cone.ts               # Конус с расчетами
│   └── Point.ts              # Точка в 3D пространстве
├── patterns/
│   ├── Repository.ts         # Repository паттерн
│   ├── Warehouse.ts          # Singleton хранилище
│   ├── Observer.ts           # Observer интерфейсы
│   ├── WarehouseObserver.ts  # Конкретный observer
│   ├── Comparator.ts         # Компараторы для сортировки
│   └── Specification.ts      # Спецификации для поиска
├── factories/
│   ├── RectangleFactory.ts
│   └── ConeFactory.ts
├── services/
│   ├── RectangleService.ts
│   └── ConeService.ts
└── main.ts
```

### Зависимости между классами

```
Shape (Observable)
  ├── Rectangle
  │   └── implements IRectangle
  └── Cone
      └── implements ICone

Repository
  ├── uses Warehouse (Singleton)
  ├── uses Specification
  ├── uses Comparator
  └── manages Shape entities

Warehouse (Singleton)
  └── хранит характеристики фигур

Observer Pattern
  ├── Shape.addObserver(observer)
  └── WarehouseObserver.update()
      └── обновляет Warehouse
```

---

## API

### ShapeRepository

#### Методы CRUD
```typescript
add(shape: Shape): void
remove(shapeId: string): boolean
getById(id: string): Shape | undefined
getAll(): Shape[]
count(): number
exists(id: string): boolean
```

#### Методы поиска
```typescript
find(specification: ISpecification<Shape>): Shape[]
findOne(specification: ISpecification<Shape>): Shape | undefined
findByName(name: string, caseSensitive?: boolean): Shape[]
```

#### Специализированный поиск
```typescript
getInFirstQuadrant(): Shape[]
getInSecondQuadrant(): Shape[]
getInThirdQuadrant(): Shape[]
getInFourthQuadrant(): Shape[]
getByDistanceRange(minDistance: number, maxDistance: number): Shape[]
getRectanglesByAreaRange(minArea: number, maxArea: number): Shape[]
getRectanglesByPerimeterRange(minPerimeter: number, maxPerimeter: number): Shape[]
getConesByVolumeRange(minVolume: number, maxVolume: number): Shape[]
getConesBySurfaceAreaRange(minSurfaceArea: number, maxSurfaceArea: number): Shape[]
```

#### Сортировка
```typescript
sort(comparator: IComparator<Shape>): Shape[]
sortInPlace(comparator: IComparator<Shape>): void
```

#### Фильтрация по типу
```typescript
getAllRectangles(): Shape[]
getAllCones(): Shape[]
```

#### Управление
```typescript
clear(): void
getWarehouse(): Warehouse
```

### Shape (базовый класс)

#### Методы
```typescript
getName(): string
setName(name: string): void
getFirstPoint(): Point
getProperty(propertyName: string): number | undefined
getShapeType(): ShapeType
addObserver(observer: IObserver): void
removeObserver(observer: IObserver): void
notifyObservers(): void
getObserverCount(): number
```

### Rectangle

#### Специфичные методы
```typescript
getArea(): number
getPerimeter(): number
setPoints(topLeft: Point, bottomRight: Point): void
setTopLeft(point: Point): void
setBottomRight(point: Point): void
isSquare(): boolean
```

### Cone

#### Специфичные методы
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

#### Методы
```typescript
distanceFromOrigin(): number
distanceTo(other: Point): number
isInFirstQuadrant(): boolean
isInSecondQuadrant(): boolean
isInThirdQuadrant(): boolean
isInFourthQuadrant(): boolean
```

### Warehouse

#### Методы
```typescript
getInstance(): Warehouse                    // Singleton
addShape(shape: Shape): void
removeShape(shapeId: string): void
getShape(shapeId: string): Shape | undefined
getAllShapes(): Shape[]

setArea(shapeId: string, area: number): void
getArea(shapeId: string): number | undefined
getAllAreas(): Map<string, number>

setPerimeter(shapeId: string, perimeter: number): void
getPerimeter(shapeId: string): number | undefined
getAllPerimeters(): Map<string, number>

setVolume(shapeId: string, volume: number): void
getVolume(shapeId: string): number | undefined
getAllVolumes(): Map<string, number>

setSurfaceArea(shapeId: string, surfaceArea: number): void
getSurfaceArea(shapeId: string): number | undefined
getAllSurfaceAreas(): Map<string, number>

getStatistics(): Statistics
clear(): void
```

---

## Использование

### Базовый пример

```typescript
import { ShapeRepository } from './patterns/Repository.js';
import { Rectangle, Cone, Point } from './entities/index.js';
import { IdComparator, FirstQuadrantSpecification } from './patterns/index.js';

// Создаем репозиторий
const repository = new ShapeRepository();

// Создаем фигуры
const rect = new Rectangle('rect1', new Point(1, 1), new Point(5, 5), 'My Rectangle');
const cone = new Cone('cone1', new Point(2, 3, 0), new Point(2, 3, -5), 3, 5, 'My Cone');

// Добавляем в репозиторий (Observer автоматически активируется)
repository.add(rect);
repository.add(cone);

// Информация автоматически сохраняется в Warehouse
const warehouse = repository.getWarehouse();
console.log(warehouse.getArea('rect1'));        // 16
console.log(warehouse.getVolume('cone1'));      // 47.12...

// Изменяем фигуру - Warehouse обновляется автоматически
rect.setBottomRight(new Point(10, 10));
console.log(warehouse.getArea('rect1'));        // 81 (обновлено!)
```

### Поиск с спецификациями

```typescript
import { FirstQuadrantSpecification, TypeSpecification } from './patterns/Specification.js';

// Найти все прямоугольники в первом квадранте
const q1Spec = new FirstQuadrantSpecification();
const rectSpec = new TypeSpecification('Rectangle');
const combined = q1Spec.and(rectSpec);

const results = repository.find(combined);
console.log(`Найдено ${results.length} прямоугольников в Q1`);
```

### Сортировка

```typescript
import { NameComparator } from './patterns/Comparator.js';

// Сортировка по имени
const sorted = repository.sort(new NameComparator());
sorted.forEach(shape => {
  console.log(shape.getName());
});

// Отсортировать in-place
repository.sortInPlace(new NameComparator());
```

### Работа с Warehouse

```typescript
const warehouse = repository.getWarehouse();

// Статистика
const stats = warehouse.getStatistics();
console.log(`Всего фигур: ${stats.totalShapes}`);
console.log(`Прямоугольников: ${stats.rectangles}`);
console.log(`Конусов: ${stats.cones}`);
console.log(`Общая площадь: ${stats.totalArea}`);
console.log(`Общий объем: ${stats.totalVolume}`);
```

---

## Тестирование

### Запуск тестов

```bash
npm test                    # Запустить все тесты
npm run build              # Скомпилировать проект
npm run dev                # Запустить демонстрацию
```

### Тестовое покрытие

Все 54 теста проверяют:

#### Warehouse (Singleton)
- ✅ Создание единственного экземпляра
- ✅ Сохранение и восстановление данных
- ✅ Удаление фигур и их свойств
- ✅ Получение статистики

#### Repository (CRUD)
- ✅ Добавление и удаление фигур
- ✅ Получение по ID и по всем критериям
- ✅ Проверка существования
- ✅ Очистка репозитория

#### Observer Pattern
- ✅ Добавление и удаление наблюдателей
- ✅ Уведомление при изменении Rectangle
- ✅ Уведомление при изменении Cone
- ✅ Автоматическое обновление Warehouse

#### Comparators
- ✅ Сортировка по ID
- ✅ Сортировка по имени
- ✅ Сортировка по X, Y, Z первой точки
- ✅ Сортировка по расстоянию от начала координат

#### Specifications (Поиск)
- ✅ Поиск по ID и имени
- ✅ Поиск в каждом квадранте
- ✅ Поиск по расстоянию
- ✅ Поиск по типу фигуры
- ✅ Комбинирование спецификаций (AND, OR, NOT)

#### Point методы
- ✅ Расстояние от начала координат
- ✅ Расстояние между двумя точками
- ✅ Определение квадранта

#### Shape методы
- ✅ Получение и установка имени
- ✅ Получение первой точки
- ✅ Получение типа фигуры
- ✅ Получение свойств
- ✅ Определение квадрата

---

## Примеры использования из демонстрации

### Демонстрирует:

1. **Singleton Warehouse** - создание единственного экземпляра
2. **Repository CRUD** - добавление 4 фигур в репозиторий
3. **Observer Pattern** - изменение фигуры автоматически обновляет Warehouse
4. **Comparators** - сортировка по ID, имени, координатам, расстоянию
5. **Specifications** - поиск по различным критериям (квадрант, расстояние, тип, площадь, объем)
6. **Комбинирование спецификаций** - AND, OR, NOT операции

Запустить демонстрацию:
```bash
npm run dev
```

---

## Лучшие практики и особенности

### ✅ Правильное использование паттернов

- **Singleton** - Warehouse имеет приватный конструктор и статический метод getInstance()
- **Observer** - фигуры уведомляют наблюдателей при любом изменении
- **Repository** - отделяет логику управления коллекцией от бизнес-логики
- **Specification** - композитный паттерн позволяет комбинировать критерии поиска
- **Comparator** - позволяет гибко менять логику сортировки

### ✅ Type Safety

- Строгая типизация всех компонентов
- Интерфейсы для контрактов между классами
- Никаких `any` типов (кроме необходимых случаев обратной совместимости)

### ✅ Тестируемость

- Все компоненты легко тестируются
- Mock'и можно создавать для Observer'ов и Specification'ов
- 54 комплексных теста покрывают все сценарии

### ✅ Производительность

- Repository использует Map для O(1) доступа
- Спецификации используют ленивое вычисление
- Observer уведомляет только необходимые компоненты

### ✅ Расширяемость

- Легко добавлять новые типы фигур (расширить Shape)
- Легко добавлять новые компараторы (реализовать IComparator)
- Легко добавлять новые спецификации (расширить AbstractSpecification)
- Легко добавлять новых наблюдателей (реализовать IObserver)

---

## Заключение

Это полнофункциональное приложение демонстрирует практическое применение пяти ключевых паттернов проектирования:

1. **Singleton** для управления единственным хранилищем данных
2. **Observer** для реактивного обновления при изменении фигур
3. **Repository** для управления коллекцией с четкой архитектурой
4. **Specification** для гибких и комбинируемых критериев поиска
5. **Comparator** для многоценных и переиспользуемых компараторов

Все компоненты хорошо тестированы, типизированы и готовы к использованию в production среде.

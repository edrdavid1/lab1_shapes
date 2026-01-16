# ТЕКСТ ЗАЩИТЫ ПРОЕКТА
## Shapes Geometry Application - Design Patterns Implementation

---

## 1. ВВЕДЕНИЕ

Добрый день! Я представляю вам лабораторную работу "Shapes Geometry Application" - приложение для управления геометрическими фигурами с использованием передовых паттернов проектирования.

Проект демонстрирует правильное применение 5 классических паттернов:
- **Repository Pattern** - управление коллекцией
- **Singleton Pattern** - единственный экземпляр
- **Observer Pattern** - отслеживание изменений
- **Specification Pattern** - гибкий поиск
- **Comparator Pattern** - универсальная сортировка

---

## 2. АРХИТЕКТУРА И ПАТТЕРНЫ

### 2.1 Repository Pattern

**Назначение:** Инкапсулировать доступ к коллекции фигур и обеспечить CRUD операции.

**Файл:** `src/patterns/Repository.ts`

**Как это работает:**

```typescript
// Создаем репозиторий
const repository = new ShapeRepository();

// Добавляем фигуру (CREATE)
const rect = new Rectangle('rect1', new Point(0, 0), new Point(5, 5));
repository.add(rect);  // Фигура сохраняется в Map

// Получаем фигуру (READ)
const found = repository.getById('rect1');

// Удаляем фигуру (DELETE)
repository.remove('rect1');

// Получаем все фигуры (READ)
const all = repository.getAll();
```

**Преимущества:**
- Централизованное управление коллекцией
- Скрывает детали внутреннего хранилища (Map)
- Обеспечивает согласованность данных
- Легко расширяется новыми методами поиска

**В проекте используется для:**
- Хранения всех Rectangle и Cone объектов
- Предоставления методов поиска и сортировки
- Синхронизации с Warehouse

---

### 2.2 Singleton Pattern (Warehouse)

**Назначение:** Гарантировать единственный экземпляр хранилища характеристик фигур.

**Файл:** `src/patterns/Warehouse.ts`

**Как это работает:**

```typescript
// Первый вызов - создается экземпляр
const warehouse1 = Warehouse.getInstance();

// Второй вызов - возвращается тот же экземпляр
const warehouse2 = Warehouse.getInstance();

// Оба указывают на один объект
console.log(warehouse1 === warehouse2);  // true
```

**Реализация Singleton:**

```typescript
export class Warehouse {
  private static instance: Warehouse | null = null;
  private areas: Map<string, number> = new Map();
  private volumes: Map<string, number> = new Map();

  private constructor() {}  // Приватный конструктор!

  public static getInstance(): Warehouse {
    if (!Warehouse.instance) {
      Warehouse.instance = new Warehouse();
    }
    return Warehouse.instance;
  }
}
```

**Хранилище содержит:**
- Площади прямоугольников (Map<id, площадь>)
- Периметры прямоугольников
- Объемы конусов
- Поверхности конусов

**Преимущества:**
- Глобальный доступ к данным характеристик
- Гарантия единственности экземпляра
- Возможность получения статистики по всем фигурам

---

### 2.3 Observer Pattern

**Назначение:** Автоматически обновлять Warehouse при изменении фигур.

**Файлы:**
- `src/patterns/Observer.ts` - интерфейсы
- `src/patterns/WarehouseObserver.ts` - реализация
- `src/entities/Shape.ts` - базовый класс

**Как это работает:**

```typescript
// 1. Создаем фигуру
const rectangle = new Rectangle('rect1', 
  new Point(0, 0), 
  new Point(5, 3)
);

// 2. Добавляем в репозиторий
repository.add(rectangle);
// ↓ Repository автоматически добавляет WarehouseObserver к фигуре!

// 3. Получаем начальные данные из Warehouse
const warehouse = repository.getWarehouse();
console.log(warehouse.getArea('rect1'));  // 15

// 4. Изменяем фигуру
rectangle.setBottomRight(new Point(10, 10));
// ↓ Это вызывает notifyObservers()!

// 5. Warehouse АВТОМАТИЧЕСКИ обновлен!
console.log(warehouse.getArea('rect1'));  // 100
```

**Поток данных:**

```
1. Пользователь изменяет Shape
   rectangle.setBottomRight(newPoint)
                     ↓
2. Shape пересчитывает свойства
   _area = width * height
                     ↓
3. Shape уведомляет наблюдателей
   this.notifyObservers()
                     ↓
4. WarehouseObserver получает обновление
   update(subject)
                     ↓
5. WarehouseObserver обновляет Warehouse
   warehouse.setArea(id, newArea)
```

**Преимущества:**
- Автоматическое обновление данных
- Слабая связь между Shape и Warehouse
- Возможность добавления других наблюдателей

---

### 2.4 Specification Pattern

**Назначение:** Предоставить гибкий и композитный способ поиска фигур.

**Файл:** `src/patterns/Specification.ts`

**Как это работает:**

```typescript
// 1. Простой поиск по ID
const spec1 = new IdSpecification('rect1');
const results1 = repository.find(spec1);

// 2. Поиск в первом квадранте (X > 0, Y > 0)
const spec2 = new FirstQuadrantSpecification();
const results2 = repository.find(spec2);

// 3. Поиск по типу (все прямоугольники)
const spec3 = new TypeSpecification('Rectangle');
const results3 = repository.find(spec3);

// 4. КОМБИНИРОВАНИЕ спецификаций (И)
const combined_and = spec2.and(spec3);
// ↓ Найти все прямоугольники в первом квадранте
const results4 = repository.find(combined_and);

// 5. КОМБИНИРОВАНИЕ спецификаций (ИЛИ)
const combined_or = spec2.or(spec3);
// ↓ Найти все фигуры в Q1 или все прямоугольники
const results5 = repository.find(combined_or);

// 6. ИНВЕРСИЯ спецификации (НЕ)
const inverted = spec3.not();
// ↓ Найти все, что не являются прямоугольниками
const results6 = repository.find(inverted);
```

**Доступные спецификации:**

1. **По расположению:**
   - FirstQuadrantSpecification (X > 0, Y > 0)
   - SecondQuadrantSpecification (X < 0, Y > 0)
   - ThirdQuadrantSpecification (X < 0, Y < 0)
   - FourthQuadrantSpecification (X > 0, Y < 0)

2. **По расстояниям:**
   - DistanceRangeSpecification(min, max)

3. **По типу и свойствам:**
   - TypeSpecification('Rectangle' | 'Cone')
   - AreaRangeSpecification(min, max)
   - VolumeRangeSpecification(min, max)

4. **По ID и имени:**
   - IdSpecification(id)
   - NameSpecification(name)

**Преимущества:**
- Легко добавлять новые критерии поиска
- Возможность комбинирования критериев
- Переиспользуемые спецификации
- Чистый и понятный API

**Реальный пример из кода:**

```typescript
// Найти все конусы с объемом от 0 до 100 кубических единиц
const coneSpec = new TypeSpecification('Cone');
const volumeSpec = new VolumeRangeSpecification(0, 100);
const smallCones = repository.find(coneSpec.and(volumeSpec));

// Результат: массив конусов, удовлетворяющих обоим критериям
```

---

### 2.5 Comparator Pattern

**Назначение:** Предоставить переиспользуемые стратегии сортировки.

**Файл:** `src/patterns/Comparator.ts`

**Как это работает:**

```typescript
// 1. Сортировка по ID
const byId = repository.sort(new IdComparator());
// Результат: [cone1, cone2, rect1, rect2]

// 2. Сортировка по имени
const byName = repository.sort(new NameComparator());
// Результат: [Big Cone, Large Rectangle, Medium Rectangle, Small Cone]

// 3. Сортировка по X координате первой точки
const byX = repository.sort(new FirstPointXComparator());
// Результат: фигуры отсортированы по возрастанию X

// 4. Сортировка по расстоянию от начала координат
const byDistance = repository.sort(new DistanceFromOriginComparator());
// Результат: ближайшие фигуры сначала

// 5. Сортировка in-place (модифицирует репозиторий)
repository.sortInPlace(new NameComparator());
```

**Интерфейс Comparator:**

```typescript
interface IComparator<T> {
  compare(a: T, b: T): number;
  // Возвращает: < 0 если a < b
  //            0 если a == b
  //            > 0 если a > b
}
```

**Преимущества:**
- Отделение логики сортировки от данных
- Переиспользование одного компаратора для разных операций
- Легко добавлять новые компараторы

---

## 3. ПОТОКИ ДАННЫХ В ПРИЛОЖЕНИИ

### 3.1 Создание и добавление фигур

```
┌─────────────────────────────────────────────────────────────┐
│ Пользователь создает фигуру                                  │
│ rect = new Rectangle('rect1', p1, p2)                       │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ Rectangle.ts:                                               │
│ - Вычисляет площадь и периметр                             │
│ - Инициализирует observers = []                            │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ Пользователь добавляет в Repository                         │
│ repository.add(rect)                                        │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ Repository.ts:                                              │
│ - Сохраняет в Map<id, shape>                               │
│ - Добавляет WarehouseObserver к фигуре                     │
│ rect.addObserver(warehouseObserver)                        │
│ - Инициирует первый update()                              │
│ warehouseObserver.update(rect)                            │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ WarehouseObserver.ts:                                       │
│ - Получает свойства фигуры                                 │
│ area = rect.getArea()                                     │
│ - Сохраняет в Warehouse                                   │
│ warehouse.setArea('rect1', area)                          │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ Warehouse.ts (Singleton):                                   │
│ - Сохраняет в Map<id, area>                                │
│ areas.set('rect1', 15)                                    │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Изменение фигуры и обновление Warehouse

```
┌─────────────────────────────────────────────────────────────┐
│ Пользователь изменяет фигуру                                │
│ rectangle.setBottomRight(new Point(10, 10))                │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ Rectangle.ts:                                               │
│ - Обновляет координату                                     │
│ this._bottomRight = new Point(10, 10)                      │
│ - Пересчитывает свойства                                   │
│ this.calculateProperties()                                 │
│ - Уведомляет наблюдателей                                 │
│ this.notifyObservers()                                    │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ Shape.ts (базовый класс):                                  │
│ - Обходит всех observers                                   │
│ for (const observer of this.observers)                     │
│   observer.update(this)                                    │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ WarehouseObserver.ts:                                       │
│ - Получает обновленные данные                              │
│ newArea = subject.getArea()  // 100                        │
│ - Обновляет Warehouse                                      │
│ warehouse.setArea('rect1', 100)                           │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ Warehouse.ts:                                               │
│ - Обновляет значение в Map                                 │
│ areas.set('rect1', 100)                                   │
│ - Данные всегда синхронизированы!                          │
└─────────────────────────────────────────────────────────────┘
```

### 3.3 Поиск с Specifications

```
┌─────────────────────────────────────────────────────────────┐
│ Пользователь создает спецификацию                           │
│ const q1Spec = new FirstQuadrantSpecification()            │
│ const rectSpec = new TypeSpecification('Rectangle')        │
│ const combined = q1Spec.and(rectSpec)                      │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ Specification.ts:                                           │
│ - Создает AndSpecification(q1Spec, rectSpec)              │
│ - Сохраняет оба спецификации                              │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ Пользователь выполняет поиск                               │
│ const results = repository.find(combined)                  │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ Repository.ts:                                              │
│ - Получает все фигуры                                      │
│ const allShapes = this.getAll()                            │
│ - Фильтрует по спецификации                                │
│ return allShapes.filter(s =>                               │
│   specification.isSatisfiedBy(s))                          │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ AndSpecification.ts:                                        │
│ - Для каждой фигуры вызывает:                              │
│ if (left.isSatisfiedBy(shape) &&                           │
│     right.isSatisfiedBy(shape))                            │
│   // добавить в результаты                                 │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ Результат:                                                  │
│ [rect1, rect3, ...]  // все прямоугольники в Q1           │
└─────────────────────────────────────────────────────────────┘
```

### 3.4 Сортировка с Comparators

```
┌─────────────────────────────────────────────────────────────┐
│ Пользователь создает компаратор                             │
│ const comparator = new NameComparator()                    │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ NameComparator.ts:                                          │
│ - Реализует compare(a, b)                                  │
│ - Сравнивает: a.getName().localeCompare(b.getName())      │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ Пользователь сортирует                                      │
│ const sorted = repository.sort(comparator)                 │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ Repository.ts:                                              │
│ - Копирует массив фигур                                    │
│ [...this.getAll()]                                        │
│ - Сортирует используя comparator                           │
│ .sort((a, b) => comparator.compare(a, b))                 │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ Результат:                                                  │
│ [Big Cone, Large Rectangle, Medium Rectangle, Small Cone]  │
│ (отсортировано по имени A-Z)                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ

### Пример 1: Создание фигур и работа с Warehouse

```typescript
// Файл: main.ts

const repository = new ShapeRepository();
const warehouse = repository.getWarehouse();

// Создаем прямоугольник
const rect1 = new Rectangle('rect1', 
  new Point(1, 1), 
  new Point(6, 5), 
  'Large Rectangle'
);

// Добавляем в репозиторий
repository.add(rect1);

// Warehouse АВТОМАТИЧЕСКИ содержит площадь!
console.log(warehouse.getArea('rect1'));  // 20

// Изменяем прямоугольник
rect1.setBottomRight(new Point(10, 10));

// Warehouse АВТОМАТИЧЕСКИ обновлен!
console.log(warehouse.getArea('rect1'));  // 81

// Получаем статистику по всем фигурам
const stats = warehouse.getStatistics();
console.log(stats.totalArea);      // сумма всех площадей
console.log(stats.totalVolume);    // сумма всех объемов
```

**Файлы:**
- `src/main.ts` - точка входа
- `src/patterns/Repository.ts` - управление коллекцией
- `src/patterns/Warehouse.ts` - хранилище данных
- `src/entities/Rectangle.ts` - сущность прямоугольника

---

### Пример 2: Поиск с Specifications

```typescript
// Файл: main.ts

// Поиск всех прямоугольников в первом квадранте
const q1Spec = new FirstQuadrantSpecification();
const rectSpec = new TypeSpecification('Rectangle');
const combined = q1Spec.and(rectSpec);

const q1Rectangles = repository.find(combined);

// Результат: только прямоугольники с X > 0 и Y > 0

// ────────────────────────────────────────────

// Поиск конусов с объемом в диапазоне
const coneSpec = new TypeSpecification('Cone');
const volumeSpec = new VolumeRangeSpecification(0, 100);

const smallCones = repository.find(coneSpec.and(volumeSpec));

// Результат: конусы с volume в диапазоне [0, 100]

// ────────────────────────────────────────────

// Поиск всех фигур НЕ прямоугольников
const notRectSpec = new TypeSpecification('Rectangle').not();

const nonRectangles = repository.find(notRectSpec);

// Результат: только конусы
```

**Файлы:**
- `src/patterns/Repository.ts` - метод find()
- `src/patterns/Specification.ts` - все спецификации
- `tests/Patterns.test.ts` - примеры тестов

---

### Пример 3: Сортировка с Comparators

```typescript
// Файл: main.ts

// Сортировка по имени (A-Z)
const byName = repository.sort(new NameComparator());
console.log(byName.map(s => s.getName()));

// Сортировка по X координате первой точки
const byX = repository.sort(new FirstPointXComparator());
console.log(byX.map(s => s.getFirstPoint().x));

// Сортировка по расстоянию от начала координат
const byDistance = repository.sort(new DistanceFromOriginComparator());
console.log(byDistance.map(s => s.getFirstPoint().distanceFromOrigin()));

// Сортировка in-place
repository.sortInPlace(new IdComparator());
```

**Файлы:**
- `src/patterns/Repository.ts` - методы sort(), sortInPlace()
- `src/patterns/Comparator.ts` - все компараторы
- `src/entities/Point.ts` - методы для расстояний

---

## 5. ТЕСТИРОВАНИЕ

**54 комплексных теста покрывают все паттерны:**

```
✅ Warehouse (Singleton) - 6 тестов
   - Создание единственного экземпляра
   - Сохранение и восстановление данных
   - Удаление фигур и их свойств
   - Получение статистики

✅ Repository (CRUD) - 7 тестов
   - Добавление и удаление
   - Получение по ID
   - Проверка существования
   - Очистка репозитория

✅ Observer Pattern - 4 теста
   - Добавление наблюдателей
   - Удаление наблюдателей
   - Уведомление при изменении
   - Автоматическое обновление Warehouse

✅ Comparators - 6 тестов
   - Сортировка по ID
   - Сортировка по имени
   - Сортировка по координатам

✅ Specifications - 14 тестов
   - Поиск по квадрантам
   - Комбинирование спецификаций
   - Инверсия спецификаций

✅ Остальные - 17 тестов
```

**Файл:** `tests/Patterns.test.ts`

---

## 6. ПРЕИМУЩЕСТВА РЕАЛИЗАЦИИ

### 6.1 Паттерн Repository
- ✅ Централизованное управление коллекцией
- ✅ Отделение логики доступа от бизнес-логики
- ✅ Легко тестировать
- ✅ Легко переходить на другую БД

### 6.2 Паттерн Singleton (Warehouse)
- ✅ Гарантия единственности
- ✅ Глобальный доступ к данным
- ✅ Аккумулирование статистики
- ✅ Нет дублирования данных

### 6.3 Паттерн Observer
- ✅ Автоматическое обновление данных
- ✅ Слабая связь между объектами
- ✅ Возможность добавления новых наблюдателей
- ✅ Отсутствие polling'а

### 6.4 Паттерн Specification
- ✅ Переиспользуемые критерии поиска
- ✅ Комбинирование критериев
- ✅ Чистый API
- ✅ Легко расширяется

### 6.5 Паттерн Comparator
- ✅ Переиспользуемые стратегии сортировки
- ✅ Отделение логики сортировки
- ✅ Множественные стратегии
- ✅ Легко добавлять новые

---

## 7. СТРУКТУРА ФАЙЛОВ

```
src/
├── patterns/
│   ├── Repository.ts              # Repository паттерн
│   ├── Warehouse.ts               # Singleton паттерн
│   ├── Observer.ts                # Observer интерфейсы
│   ├── WarehouseObserver.ts       # Observer реализация
│   ├── Specification.ts           # Specification паттерн
│   ├── Comparator.ts              # Comparator паттерн
│   └── index.ts                   # Экспорты
├── entities/
│   ├── Shape.ts                   # Базовый класс (Observable)
│   ├── Rectangle.ts               # Прямоугольник
│   ├── Cone.ts                    # Конус
│   ├── Point.ts                   # Точка 3D
│   └── index.ts                   # Экспорты
├── factories/
│   ├── RectangleFactory.ts        # Создание прямоугольников
│   └── ConeFactory.ts             # Создание конусов
├── services/
│   ├── RectangleService.ts        # Бизнес-логика
│   └── ConeService.ts             # Бизнес-логика
└── main.ts                         # Точка входа
```

---

## 8. ЗАПУСК И ДЕМОНСТРАЦИЯ

```bash
# Установка зависимостей
npm install

# Компиляция TypeScript
npm run build

# Запуск тестов
npm test
# Result: 54 passed, 54 total ✅

# Запуск демонстрации
npm run dev
# Выводит пример работы всех паттернов
```

---

## 9. ЗАКЛЮЧЕНИЕ

Данный проект демонстрирует:

1. **Правильное применение 5 классических паттернов проектирования**
   - Repository для управления коллекцией
   - Singleton для единственного хранилища
   - Observer для отслеживания изменений
   - Specification для гибкого поиска
   - Comparator для универсальной сортировки

2. **Чистую архитектуру**
   - Разделение ответственности
   - Слабая связь между компонентами
   - Высокая когезия

3. **Best Practices**
   - Full TypeScript type safety
   - Comprehensive testing (54 tests)
   - Clear documentation
   - Production-ready code

4. **Практическую ценность**
   - Переиспользуемые компоненты
   - Легко расширяется
   - Легко тестируется
   - Легко поддерживается

Приложение полностью готово к использованию и может служить примером правильной реализации паттернов проектирования на TypeScript.

import { RECTANGLES_FILE, CONES_FILE } from './constants.js';
import { RectangleService } from './services/RectangleService.js';
import { ConeService } from './services/ConeService.js';
import { logger } from './utils/logger.js';
import type { IRectangle } from './entities/Rectangle.js';
import type { ICone } from './entities/Cone.js';

import { ShapeRepository } from './patterns/Repository.js';
import { Warehouse } from './patterns/Warehouse.js';
import { Point } from './entities/Point.js';
import { Rectangle } from './entities/Rectangle.js';
import { Cone } from './entities/Cone.js';

import {
  IdComparator,
  NameComparator,
  FirstPointXComparator,
  FirstPointYComparator,
  DistanceFromOriginComparator,
} from './patterns/Comparator.js';

import {
  IdSpecification,
  FirstQuadrantSpecification,
  DistanceRangeSpecification,
  TypeSpecification,
  AreaRangeSpecification,
  VolumeRangeSpecification,
} from './patterns/Specification.js';

async function run() {
  try {
    // ===== ДЕМОНСТРАЦИЯ ПАТТЕРНОВ =====
    logger.info('=== НАЧАЛО ДЕМОНСТРАЦИИ ПАТТЕРНОВ ===');

    // 1. WAREHOUSE (Singleton)
    logger.info('');
    logger.info('1. WAREHOUSE (Singleton) - Хранилище характеристик фигур');
    const warehouse = Warehouse.getInstance();
    const warehouse2 = Warehouse.getInstance();
    logger.info(`Singleton работает: ${warehouse === warehouse2}`);

    // 2. REPOSITORY
    logger.info('');
    logger.info('2. REPOSITORY - Управление коллекцией фигур');
    const repository = new ShapeRepository();

    // Добавление фигур в репозиторий
    const rect1 = new Rectangle('rect1', new Point(1, 1), new Point(6, 5), 'Large Rectangle');
    const rect2 = new Rectangle('rect2', new Point(-3, 2), new Point(2, 7), 'Medium Rectangle');
    const cone1 = new Cone('cone1', new Point(2, 3, 0), new Point(2, 3, -5), 3, 5, 'Big Cone');
    const cone2 = new Cone('cone2', new Point(-2, -3, 1), new Point(-2, -3, -4), 2, 3, 'Small Cone');

    repository.add(rect1);
    repository.add(rect2);
    repository.add(cone1);
    repository.add(cone2);

    logger.info(`Всего фигур в репозитории: ${repository.count()}`);
    logger.info(`Прямоугольников: ${repository.getAllRectangles().length}`);
    logger.info(`Конусов: ${repository.getAllCones().length}`);

    // 3. WAREHOUSE - данные
    logger.info('');
    logger.info('3. WAREHOUSE - Автоматические данные');
    const stats = warehouse.getStatistics();
    logger.info(`Статистика Warehouse: totalShapes=${stats.totalShapes}, rectangles=${stats.rectangles}, cones=${stats.cones}, totalArea=${stats.totalArea.toFixed(2)}, totalPerimeter=${stats.totalPerimeter.toFixed(2)}, totalVolume=${stats.totalVolume.toFixed(2)}, totalSurfaceArea=${stats.totalSurfaceArea.toFixed(2)}`);

    // 4. OBSERVER PATTERN
    logger.info('');
    logger.info('4. OBSERVER - Изменение фигуры обновляет Warehouse');
    const oldArea = warehouse.getArea('rect1');
    logger.info(`Площадь rect1 до изменения: ${oldArea}`);

    rect1.setBottomRight(new Point(10, 10));

    const newArea = warehouse.getArea('rect1');
    logger.info(`Площадь rect1 после изменения: ${newArea}`);
    logger.info(`Observer успешно обновил Warehouse`);

    // 5. COMPARATORS
    logger.info('');
    logger.info('5. COMPARATORS - Сортировка фигур');

    const sortedById = repository.sort(new IdComparator());
    logger.info(`Отсортировано по ID: ${sortedById.map((s) => s.id).join(', ')}`);

    const sortedByName = repository.sort(new NameComparator());
    logger.info(`Отсортировано по имени: ${sortedByName.map((s) => s.getName()).join(', ')}`);

    const sortedByX = repository.sort(new FirstPointXComparator());
    logger.info(
      `Отсортировано по X первой точки: ${sortedByX.map((s) => `${s.id}(${s.getFirstPoint().x})`).join(', ')}`
    );

    const sortedByDistance = repository.sort(new DistanceFromOriginComparator());
    logger.info(
      `Отсортировано по расстоянию от начала координат: ${sortedByDistance.map(
        (s) => `${s.id}(${s.getFirstPoint().distanceFromOrigin().toFixed(2)})`
      ).join(', ')}`
    );

    // 6. SPECIFICATIONS (ПОИСК)
    logger.info('');
    logger.info('6. SPECIFICATIONS - Поиск фигур');

    // По ID
    const byIdSpec = new IdSpecification('rect1');
    const foundById = repository.find(byIdSpec);
    logger.info(`Найдены по ID (rect1): ${foundById.length} фигур`);

    // В первом квадранте
    const q1Spec = new FirstQuadrantSpecification();
    const q1Shapes = repository.find(q1Spec);
    logger.info(
      `В первом квадранте: ${q1Shapes.length} фигур - ${q1Shapes.map((s) => s.id).join(', ')}`
    );

    // В диапазоне расстояний
    const distanceSpec = new DistanceRangeSpecification(0, 5);
    const nearShapes = repository.find(distanceSpec);
    logger.info(
      `На расстоянии 0-5 от начала координат: ${nearShapes.length} фигур - ${nearShapes.map((s) => s.id).join(', ')}`
    );

    // По типу (прямоугольники)
    const rectSpec = new TypeSpecification('Rectangle');
    const rectangles = repository.find(rectSpec);
    logger.info(`Все прямоугольники: ${rectangles.length} фигур`);

    // По площади прямоугольников
    const areaSpec = new AreaRangeSpecification(0, 50);
    const smallRects = repository.find(rectSpec.and(areaSpec));
    logger.info(
      `Прямоугольники с площадью 0-50: ${smallRects.length} фигур - ${smallRects.map((s) => s.id).join(', ')}`
    );

    // По объему конусов
    const coneSpec = new TypeSpecification('Cone');
    const volumeSpec = new VolumeRangeSpecification(0, 100);
    const smallCones = repository.find(coneSpec.and(volumeSpec));
    logger.info(
      `Конусы с объемом 0-100: ${smallCones.length} фигур - ${smallCones.map((s) => s.id).join(', ')}`
    );

    // Комбинирование спецификаций
    const combined = q1Spec.or(rectSpec);
    const combined_results = repository.find(combined);
    logger.info(
      `Фигуры в Q1 ИЛИ прямоугольники: ${combined_results.length} фигур - ${combined_results.map((s) => s.id).join(', ')}`
    );

    // Инверсия
    const notRectSpec = rectSpec.not();
    const notRectangles = repository.find(notRectSpec);
    logger.info(`НЕ прямоугольники: ${notRectangles.length} фигур - ${notRectangles.map((s) => s.id).join(', ')}`);

    // ===== ОБРАБОТКА ДАННЫХ ИЗ ФАЙЛОВ =====
    logger.info('');
    logger.info('=== ОБРАБОТКА ДАННЫХ ИЗ ФАЙЛОВ ===');

    try {
      logger.info({ file: RECTANGLES_FILE }, 'Processing rectangles');
      const rects = await RectangleService.fromFile(RECTANGLES_FILE);
      rects.forEach((r: IRectangle, i: number) => {
        const area = RectangleService.area(r as any);
        const perimeter = RectangleService.perimeter(r as any);
        const square = RectangleService.isSquare(r as any);
        logger.info({ index: i + 1, id: r.id, area, perimeter, square }, 'Rectangle computed');
      });
    } catch (e) {
      logger.error({ err: e }, 'Failed processing rectangles');
    }

    try {
      logger.info({ file: CONES_FILE }, 'Processing cones');
      const cones = await ConeService.fromFile(CONES_FILE);
      cones.forEach((c: ICone, i: number) => {
        const surfaceArea = ConeService.surfaceArea(c as any);
        const volume = ConeService.volume(c as any);
        const isCone = ConeService.isCone(c as any);
        logger.info({ index: i + 1, id: c.id, surfaceArea, volume, isCone }, 'Cone computed');
      });
    } catch (e) {
      logger.error({ err: e }, 'Failed processing cones');
    }

    logger.info('');
    logger.info('=== ДЕМОНСТРАЦИЯ ЗАВЕРШЕНА ===');
  } catch (e) {
    logger.error({ err: e }, 'Fatal error');
  }
}

run();

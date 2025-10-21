import { RECTANGLES_FILE, CONES_FILE } from './constants.js';
import { RectangleService } from './services/RectangleService.js';
import { ConeService } from './services/ConeService.js';
import { logger } from './utils/logger.js';

async function run() {
  try {
    logger.info({ file: RECTANGLES_FILE }, 'Processing rectangles');
    const rects = await RectangleService.fromFile(RECTANGLES_FILE);
    rects.forEach((r, i) => {
      const area = RectangleService.area(r);
      const perimeter = RectangleService.perimeter(r);
      const square = RectangleService.isSquare(r);
      logger.info({ index: i + 1, id: r.id, area, perimeter, square }, 'Rectangle computed');
    });
  } catch (e) {
    logger.error({ err: e }, 'Failed processing rectangles');
  }

  try {
    logger.info({ file: CONES_FILE }, 'Processing cones');
    const cones = await ConeService.fromFile(CONES_FILE);
    cones.forEach((c, i) => {
      const surfaceArea = ConeService.surfaceArea(c);
      const volume = ConeService.volume(c);
      const isCone = ConeService.isCone(c);
      logger.info({ index: i + 1, id: c.id, surfaceArea, volume, isCone }, 'Cone computed');
    });
  } catch (e) {
    logger.error({ err: e }, 'Failed processing cones');
  }
}

run();

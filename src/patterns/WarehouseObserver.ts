import type { IObserver, IObservable } from './Observer.js';
import { Warehouse } from './Warehouse.js';
import { Rectangle } from '../entities/Rectangle.js';
import { Cone } from '../entities/Cone.js';

/**
 * WarehouseObserver реализует паттерн Observer
 * Автоматически обновляет данные в Warehouse при изменении фигур
 */
export class WarehouseObserver implements IObserver {
  private warehouse: Warehouse = Warehouse.getInstance();

  /**
   * Обновить данные в Warehouse при изменении фигуры
   */
  public update(subject: IObservable): void {
    const shape = subject as Rectangle | Cone;

    if (shape instanceof Rectangle) {
      const area = shape.getArea();
      const perimeter = shape.getPerimeter();
      this.warehouse.setArea(shape.id, area);
      this.warehouse.setPerimeter(shape.id, perimeter);
    } else if (shape instanceof Cone) {
      const volume = shape.getVolume();
      const surfaceArea = shape.getSurfaceArea();
      this.warehouse.setVolume(shape.id, volume);
      this.warehouse.setSurfaceArea(shape.id, surfaceArea);
    }
  }
}

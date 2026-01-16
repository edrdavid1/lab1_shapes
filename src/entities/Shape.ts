import type { IObservable, IObserver } from '../patterns/Observer.js';
import type { Point } from './Point.js';

export type ShapeType = 'rectangle' | 'cone';

/**
 * Абстрактный базовый класс для всех геометрических фигур
 * Реализует паттерн Observer для отслеживания изменений
 */
export abstract class Shape implements IObservable {
  protected observers: IObserver[] = [];
  protected name: string;

  constructor(public id: string) {
    this.name = id;
  }

  /**
   * Получить имя фигуры
   */
  public getName(): string {
    return this.name;
  }

  /**
   * Установить имя фигуры
   */
  public setName(name: string): void {
    this.name = name;
    this.notifyObservers();
  }

  /**
   * Получить первую точку фигуры
   */
  abstract getFirstPoint(): Point;

  /**
   * Получить свойство фигуры (для использования в спецификациях)
   */
  abstract getProperty(propertyName: string): number | undefined;

  /**
   * Получить тип фигуры
   */
  abstract getShapeType(): ShapeType;

  /**
   * Добавить наблюдателя
   */
  public addObserver(observer: IObserver): void {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }

  /**
   * Удалить наблюдателя
   */
  public removeObserver(observer: IObserver): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  /**
   * Уведомить всех наблюдателей об изменениях
   */
  public notifyObservers(): void {
    for (const observer of this.observers) {
      observer.update(this);
    }
  }

  /**
   * Получить количество наблюдателей
   */
  public getObserverCount(): number {
    return this.observers.length;
  }
}

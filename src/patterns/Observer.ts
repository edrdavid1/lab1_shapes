/**
 * Интерфейс Observer для паттерна Observer
 * Используется для отслеживания изменений в фигурах
 */
export interface IObserver {
  /**
   * Вызывается при изменении наблюдаемого объекта
   * @param subject - объект, который был изменен
   */
  update(subject: IObservable): void;
}

/**
 * Интерфейс Observable для паттерна Observer
 * Позволяет объектам быть наблюдаемыми
 */
export interface IObservable {
  /**
   * Добавить наблюдателя
   */
  addObserver(observer: IObserver): void;

  /**
   * Удалить наблюдателя
   */
  removeObserver(observer: IObserver): void;

  /**
   * Уведомить всех наблюдателей
   */
  notifyObservers(): void;
}

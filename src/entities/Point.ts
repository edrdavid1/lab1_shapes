export class Point {
  private _x: number;
  private _y: number;
  private _z: number;

  constructor(x: number, y: number, z: number = 0) {
    this._x = x;
    this._y = y;
    this._z = z;
  }

  get x(): number {
    return this._x;
  }

  get y(): number {
    return this._y;
  }

  get z(): number {
    return this._z;
  }

  /**
   * Вычислить расстояние от начала координат
   */
  public distanceFromOrigin(): number {
    return Math.sqrt(this._x ** 2 + this._y ** 2 + this._z ** 2);
  }

  /**
   * Вычислить расстояние до другой точки
   */
  public distanceTo(other: Point): number {
    const dx = this._x - other._x;
    const dy = this._y - other._y;
    const dz = this._z - other._z;
    return Math.sqrt(dx ** 2 + dy ** 2 + dz ** 2);
  }

  /**
   * Проверить, находится ли точка в первом квадранте
   */
  public isInFirstQuadrant(): boolean {
    return this._x > 0 && this._y > 0;
  }

  /**
   * Проверить, находится ли точка во втором квадранте
   */
  public isInSecondQuadrant(): boolean {
    return this._x < 0 && this._y > 0;
  }

  /**
   * Проверить, находится ли точка в третьем квадранте
   */
  public isInThirdQuadrant(): boolean {
    return this._x < 0 && this._y < 0;
  }

  /**
   * Проверить, находится ли точка в четвертом квадранте
   */
  public isInFourthQuadrant(): boolean {
    return this._x > 0 && this._y < 0;
  }
}

export type ShapeType = 'rectangle' | 'cone';

export abstract class Shape {
  constructor(public id: string) {}
}

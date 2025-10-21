import { Cone } from "../entities/Cone.js";
import { ConeValidator } from "../validators/ConeValidator.js";
import { ConeFactory } from "../factories/ConeFactory.js";
import { FileReader } from "./FileReader.js";
import { logger } from "../utils/logger.js";
import { WHITESPACE_RE } from "../constants.js";

export class ConeService {
  static surfaceArea(cone: Cone): number {
    ConeValidator.validateGeometry(cone);
    const slant = Math.sqrt(cone.radius ** 2 + cone.height ** 2);
    const area = Math.PI * cone.radius * (cone.radius + slant);
    ConeValidator.validateResults(area, 1);
    return area;
  }

  static volume(cone: Cone): number {
    ConeValidator.validateGeometry(cone);
    const vol = (1 / 3) * Math.PI * cone.radius ** 2 * cone.height;
    ConeValidator.validateResults(1, vol);
    return vol;
  }

  static isCone(cone: Cone): boolean {
    try {
      ConeValidator.validateGeometry(cone);
      return true;
    } catch {
      return false;
    }
  }

  static isBaseOnXOY(cone: Cone): boolean {
    return Math.abs(cone.baseCenter.z) === 0;
  }

  static volumeSplitByXOY(cone: Cone): { above: number; below: number; total: number } {
    const total = this.volume(cone);
    const zApex = cone.apex.z;
    const zBase = cone.baseCenter.z;
    const zMin = Math.min(zApex, zBase);
    const zMax = Math.max(zApex, zBase);

    if (0 <= zMin || 0 >= zMax) {
      const above = 0 <= zApex && 0 <= zBase ? total : 0;
      const below = above === total ? 0 : total;
      return { above, below, total };
    }

    const height = Math.abs(zBase - zApex) || cone.height;
    const dFromApex = Math.abs(0 - zApex);
    const f = Math.min(Math.max(dFromApex / height, 0), 1);
    const above = total * Math.pow(f, 3);
    const below = total - above;
    return { above, below, total };
  }

  static async fromFile(filePath: string): Promise<Cone[]> {
    const cones: Cone[] = [];
    const lines = await FileReader.readLines(filePath);
    for (const [idx, line] of lines.entries()) {
      try {
        const parts = line.split(WHITESPACE_RE).filter(Boolean);
        const cone = new ConeFactory().createShape(parts);
        ConeValidator.validateGeometry(cone);
        cones.push(cone);
      } catch (e) {
        logger.warn({ line: idx + 1, lineText: line, err: (e as Error).message }, "Skipping invalid cone line");
      }
    }
    return cones;
  }
}

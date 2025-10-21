import { Cone } from "../src/entities/Cone.js";
import { Point } from "../src/entities/Point.js";
import { ConeService } from "../src/services/ConeService.js";

const closeTo = (a: number, b: number, eps = 1e-10) => Math.abs(a - b) < eps;

describe("ConeService", () => {
  const cone = new Cone("1", new Point(0, 0, 5), new Point(0, 0, 0), 3, 5);

  test("computes volume and surface area and validates geometry", () => {
    const area = ConeService.surfaceArea(cone);
    const volume = ConeService.volume(cone);
    expect(closeTo(volume, (Math.PI * 9 * 5) / 3)).toBe(true);
    const slant = Math.sqrt(3 ** 2 + 5 ** 2);
    const expectedArea = Math.PI * 3 * (3 + slant);
    expect(closeTo(area, expectedArea)).toBeTruthy();
    expect(ConeService.isCone(cone)).toBe(true);
  });
});

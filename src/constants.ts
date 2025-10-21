import { join } from 'node:path';

export const DATA_DIR = join(process.cwd(), 'data');
export const RECTANGLES_FILE = join(DATA_DIR, 'rectangles.txt');
export const CONES_FILE = join(DATA_DIR, 'cones.txt');
export const WHITESPACE_RE = /\s+/g;

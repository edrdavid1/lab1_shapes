import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

export class FileReader {
  static async readLines(filePath: string): Promise<string[]> {
    const lines: string[] = [];
    const stream = createReadStream(filePath, { encoding: 'utf-8' });
    const rl = createInterface({ input: stream, crlfDelay: Infinity });

    for await (const line of rl) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const withoutComment = trimmed.split('#')[0].trim();
      if (!withoutComment) continue;
      lines.push(withoutComment);
    }

    return lines;
  }
}

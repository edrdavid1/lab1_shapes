# Shapes Project (Variants 2: Rectangle, 8: Cone)

## Overview

This project implements two geometric tasks in TypeScript with a clean architecture:

- Variant 2: Rectangle in 2D.
- Variant 8: Cone in 3D.

Key requirements covered:
- ES Modules (NodeNext) + strict TypeScript.
- Entity classes without business logic.
- Factory Method for entity construction from text files.
- Validation with custom exceptions (no throwing bare Error).
- pino logging to console and file.
- Reading data from `.txt`, skipping invalid lines.
- Unit tests (Jest, ESM) with multiple expectations per test.
- ESLint enabled (can be switched to Airbnb TypeScript if desired).

## Architecture and Reasoning

### Goals
- Keep entity classes simple (only fields/identity) and move all computations and I/O outside of them.
- Isolate parsing and validation in factories and validators.
- Make file processing robust: tolerate invalid lines and continue work.
- Provide structured logging that is useful both in dev and CI.

### Modules

- `src/entities/`
  - `Shape.ts`: base class with `id: string` for identification.
  - `Point.ts`: 3D point for universal use (`z` defaults to 0).
  - `Rectangle.ts`: defined by two points `topLeft` and `bottomRight` (axis-aligned).
  - `Cone.ts`: defined by `apex`, `baseCenter`, `radius`, `height`.

- `src/factories/`
  - `ShapeFactory.ts`: abstract factory to enforce a `createShape(data: string[]): Shape` contract.
  - `RectangleFactory.ts`: parses `x1 y1 x2 y2` and creates `Rectangle` with generated `id`.
  - `ConeFactory.ts`: parses `ax ay az bx by bz r h` and creates `Cone` with generated `id`.

- `src/validators/`
  - `CommonValidator.ts`: low-level checks using `InvalidDataError`.
  - `RectangleValidator.ts`: geometry (width/height > 0) and results (area/perimeter > 0).
  - `ConeValidator.ts`: geometry (r, h > 0) and results (area/volume > 0).

- `src/services/`
  - `FileReader.ts`: reads non-empty, non-`#`-comment lines.
  - `RectangleService.ts`:
    - `area(rect)`, `perimeter(rect)`, `isSquare(rect)`.
    - `fromFile(path)`: parses, validates, logs, skips invalid lines.
  - `ConeService.ts`:
    - `surfaceArea(cone)`, `volume(cone)`, `isCone(cone)`.
    - `fromFile(path)`: parses, validates, logs, skips invalid lines.

- `src/exceptions/`
  - `InvalidDataError.ts`, `CalculationError.ts`: custom exceptions.

- `src/utils/logger.ts`: pino logger writes to console and `./logs/app.log`.

- `src/constants.ts`: file paths and reusable regexes (`WHITESPACE_RE`).

- `src/main.ts`: demo runner that reads files, computes metrics, logs per-shape outputs.

### Why this design
- Entities are serializable and reusable (pure data + identity) and can be used in different contexts (UI, CLI, services).
- Factories encapsulate all parsing logic, making it simple to swap data sources or formats.
- Validators decouple the validation rules from computations, making tests more direct and specific.
- Services are testable and contain only business logic calculations and orchestration.
- Logging is centralized, leveled, and safe to use in tests and production.

### Alternatives considered
- Use interfaces for Points only in 2D; we chose a 3D `Point` with default `z=0` to reuse for Cone.
- Compute properties inside entities; rejected due to requirement that entities must not contain business logic.
- Parsing in services; rejected to keep responsibilities clear and support multiple input formats via factories.
- No file logging; rejected because the requirement asked for console and file logging.

## Data Formats

- `data/rectangles.txt` lines: `x1 y1 x2 y2`
  - Examples:
    - `0 0 10 5` (valid)
    - `1 1 1 1` (invalid: zero area)
    - `2 a 5 6` (invalid: non-number)

- `data/cones.txt` lines: `ax ay az bx by bz r h`
  - Examples:
    - `0 0 5 0 0 0 3 5` (valid)
    - `0 0 5 0 0 0 -3 5` (invalid: negative radius)
    - `0 0 5 0 0 0 3` (invalid: too few values)

Invalid lines are logged with `warn` and skipped.

## Validation & Exceptions

- All checks throw `InvalidDataError` (or a domain-specific custom error). No raw `Error` is thrown.
- Factories validate input counts and numeric parsing.
- Geometry validators ensure physical possibility (positive dimensions), services validate computed results.
- Exceptions are not caught in the same scope as they are thrown (as required). Services catch around file-line loops.

## Logging

- `pino` with two transports:
  - Pretty console via `pino-pretty`.
  - File output to `./logs/app.log`.
- Ensure `logs/` directory exists for file transport.

## Testing

- Jest + ts-jest in ESM mode with NodeNext TS config.
- Multiple expectations per test for stronger assertions.
- Example coverage:
  - `RectangleService` area, perimeter, square detection.
  - `ConeService` surface area, volume, and geometry validity.

## How to Run

### Prerequisites
- Node.js >= 18

### Install
```bash
npm install
```

### Test
```bash
npm test
```
(We run Jest with `NODE_OPTIONS=--experimental-vm-modules` for ESM support.)

### Build
```bash
npm run build
```

### Start
```bash
npm start
```
- The app reads `data/rectangles.txt` and `data/cones.txt`, logs computed metrics.

## What could be improved
- Add more shape properties (e.g., for rectangles: convexity checks, trapezoid/rhombus detection), and axis-intersection checks.
- Add richer error reporting with structured tags for analytics.
- Parameterize file locations via env vars.
- Extend ESLint to Airbnb TypeScript config (install peer deps) for stricter style.
- Add integration tests for `fromFile()` including logging assertions.

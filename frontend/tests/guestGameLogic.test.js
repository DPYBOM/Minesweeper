import { describe, it, expect } from "vitest";

import { 
  createEmptyBoard, 
  getSafeZoneTiles, 
  getNeighborCoords
} from "../static/js/guestGameLogic.js";

import { stringToSeed, mulberry32 } from "../static/js/guestUtils.js";


//integration test would be needed for checkWinCondition, revealAdjacentZerosIterative, getTileRevealResult, placeMines

describe("guestGameLogic - Pure Functions", () => {
  describe("createEmptyBoard", () => {
    it("should create a board of correct size", () => {
      const board = createEmptyBoard(3, 2);
      expect(board).toHaveLength(3);
      expect(board[0]).toHaveLength(2);
    });
  });

  describe("getSafeZoneTiles", () => {
  it("should return a 3x3 safe zone around the clicked tile", () => {
    const safeTiles = getSafeZoneTiles(1, 1, 3, 3);
    expect(safeTiles).toHaveLength(9);
  });
});

  describe("getNeighborCoords", () => {
    it("should return 8 neighbors for a middle tile", () => {
      const coords = getNeighborCoords(1, 1, 3, 3);
      expect(coords).toHaveLength(8);
    });

    it("should return 3 neighbors for a corner tile", () => {
      const cornerCoords = getNeighborCoords(0, 0, 3, 3);
      expect(cornerCoords).toHaveLength(3);
    });
  });
});

describe("guestUtils", () => {
  describe("stringToSeed", () => {
    it("should return consistent numeric seed for a given string", () => {
      const seed1 = stringToSeed("test");
      const seed2 = stringToSeed("test");
      expect(seed1).toBe(seed2);
      expect(typeof seed1).toBe("number");
    });

    it("should return different seeds for different strings", () => {
      const seedA = stringToSeed("hello");
      const seedB = stringToSeed("world");
      expect(seedA).not.toBe(seedB);
    });
  });

  describe("mulberry32", () => {
    it("should generate deterministic sequence for given seed", () => {
      const rng = mulberry32(12345);
      expect(rng()).toBeCloseTo(0.9797, 4);
      expect(rng()).toBeCloseTo(0.30675, 4);
      expect(rng()).toBeCloseTo(0.4842, 4);
    });

    it("should produce numbers between 0 and 1", () => {
      const rng = mulberry32(67890)
      for (let i = 0; i < 10; i++) {
        const value = rng();
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThan(1);
      }
    });
  });
});

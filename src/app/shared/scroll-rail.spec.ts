import { describe, expect, it } from 'vitest';
import { measureRail, railProgress } from './scroll-rail.component';

describe('measured scroll rail', () => {
  it('derives pin height from real horizontal overflow', () => {
    expect(measureRail(6000, 1200, 900, 90)).toEqual({
      overflow: 4800,
      travel: 4800,
      height: 5610,
    });
    expect(measureRail(1200, 1200, 900, 90)).toEqual({ overflow: 0, travel: 0, height: 810 });
  });
  it('maps normal vertical scroll to bounded horizontal progress', () => {
    expect(railProgress(90, 90, 4800)).toBe(0);
    expect(railProgress(-2310, 90, 4800)).toBe(0.5);
    expect(railProgress(-4710, 90, 4800)).toBe(1);
    expect(railProgress(-9000, 90, 4800)).toBe(1);
  });
});

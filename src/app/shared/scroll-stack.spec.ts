import { describe, expect, it } from 'vitest';
import { stackMetrics, stackPosition } from './scroll-stack.component';

describe('measured scroll stacks', () => {
  it('derives pin duration from the panel count and visible stage', () => {
    expect(stackMetrics(600, 810, 5)).toEqual({ step: 528, travel: 2112, height: 2922 });
    expect(stackMetrics(600, 810, 3)).toEqual({ step: 528, travel: 1056, height: 1866 });
    expect(stackMetrics(600, 810, 1)).toEqual({ step: 528, travel: 0, height: 810 });
  });

  it('maps page scroll to a bounded stack position', () => {
    expect(stackPosition(90, 90, 528, 5)).toBe(0);
    expect(stackPosition(-174, 90, 528, 5)).toBe(0.5);
    expect(stackPosition(-966, 90, 528, 5)).toBe(2);
    expect(stackPosition(-4000, 90, 528, 5)).toBe(4);
  });
});

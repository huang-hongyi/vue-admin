import { describe, expect, test } from 'vitest';
import Editor from './index.vue';

describe("Hello", () => {
  test('挂载组件', () => {
    expect(Editor).toBeTruthy();
  })
})
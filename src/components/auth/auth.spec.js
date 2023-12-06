import { describe, expect, test } from 'vitest';
import Auth from './auth.vue';

describe("Hello", () => {
  test('挂载组件', () => {
    expect(Auth).toBeTruthy();
  })
})
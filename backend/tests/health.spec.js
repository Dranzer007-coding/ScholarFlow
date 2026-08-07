const { test, expect } = require('@playwright/test');

test('API Server Health Check', async ({ request }) => {
  const response = await request.get('/api/health');
  expect(response.ok()).toBeTruthy();
  const json = await response.json();
  expect(json.success).toBe(true);
  expect(json.message).toContain('running smoothly');
});

import { test, expect } from '@playwright/test';

test('loads bokehjs', async ({ page }) => {
  const info: string[] = []
  page.on('console', msg => {
    if (msg.type() === 'info') {
      info.push(msg.text());
    }
  });

  await page.goto('/');

  const matches = info.filter(s => s.startsWith('BokehJS version:'));
  expect(matches.length).toBe(1);
});

test('is interactive', async ({ page }) => {
  await page.goto('/');

  for (var i = 0; i < 20; i++) {
    await page.locator('.bk-Button').click();
  }
  // Take screenshot

  const boxZoom = await page.getByTitle('Box Zoom').click();
  const bbox = await page.locator('.bk-CartesianFrame').boundingBox();
  expect(bbox).not.toBeNull();

  await page.mouse.move(bbox!.x + bbox!.width*0.2, bbox!.y + bbox!.height*0.2);
  await page.mouse.down();
  await page.mouse.move(bbox!.x + bbox!.width*0.8, bbox!.y + bbox!.height*0.8);
  await page.mouse.up();
  await page.waitForTimeout(100);
  // Take screenshot

  const reset = await page.getByTitle('Reset').click();
  await page.waitForTimeout(100);
  // Take screenshot
});

import { test, expect } from '@playwright/test';
import { seedData } from '../support/general';

test.describe('Posts', () => {
  test('can see posts as a list', async ({ page }) => {
    // arrange
    seedData('posts', 'a');

    // act
    await page.goto('/posts');

    // assert
    const body = page.locator('body');
    await expect(page).toHaveTitle(/Vite App/);
    await expect(body).toContainText('first post title');
    await expect(body).toContainText('first post body');
    await expect(body).toContainText('second post title');
    await expect(body).toContainText('second post body');
  });
});

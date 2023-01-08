import { test, expect } from '@playwright/test';
import { seedData } from '../support/general';

test.describe('Posts', () => {
  test('can see posts as a list', async ({ page }) => {
    // arrange
    await seedData(page, 'post', 'a');

    // act
    await page.goto('/posts');

    // assert
    await expect(page).toHaveTitle(/Vite App/);
    const body = page.locator('body');
    await expect(body).toContainText('first post title');
    await expect(body).toContainText('first post body');
    await expect(body).toContainText('second post title');
    await expect(body).toContainText('some extra long b...');
  });

  test('can see an individual post', async({ page }) => {
    // arrange
    const postId = (await seedData(page, 'post', 'b')).id;

    // act
    await page.goto(`/post/${postId}`);

    // assert
    const body = page.locator('body');
    await expect(body).toContainText('first post title');
    await expect(body).toContainText('first post body');
  });
});

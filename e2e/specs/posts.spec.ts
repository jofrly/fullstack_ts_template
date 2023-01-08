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

  test('can see an individual post', async ({ page }) => {
    // arrange
    const postId = (await seedData(page, 'post', 'b')).id;

    // act
    await page.goto(`/post/${postId}`);

    // assert
    const body = page.locator('body');
    await expect(body).toContainText('first post title');
    await expect(body).toContainText('first post body');
  });

  test('can create a post', async({ page }) => {
    // arrange
    await seedData(page, 'post', 'c')

    // act
    await page.goto('/posts');
    await page.locator('button:text("Neuer Post")').click();
    expect(page).toHaveURL('/posts/new');
    await page.getByPlaceholder('Titel').fill('my custom title');
    await page.getByPlaceholder('Inhalt').fill('my custom body');
    await page.locator('button:text("Post erstellen")').click();
    expect(page).toHaveURL('/posts');

    // assert
    const body = page.locator('body');
    await expect(body).toContainText('my custom title');
    await expect(body).toContainText('my custom body');
  });

  test('can update a post', async({ page }) => {
    // arrange
    const postId = (await seedData(page, 'post', 'd')).id

    // act
    await page.goto(`/post/${postId}`);
    await page.locator('button:text("Bearbeiten")').click();
    expect(page).toHaveURL(`/post/${postId}/edit`);
    await page.getByPlaceholder('Titel').fill('my custom title');
    await page.getByPlaceholder('Inhalt').fill('my custom body');
    await page.locator('button:text("Post bearbeiten")').click();
    expect(page).toHaveURL('/posts');

    // assert
    const body = page.locator('body');
    await expect(body).toContainText('my custom title');
    await expect(body).toContainText('my custom body');
  });

  test('can delete a post', async({ page }) => {
    // arrange
    const postId = (await seedData(page, 'post', 'e')).id

    // act
    await page.goto(`/post/${postId}`);
    await page.locator('button:text("Löschen")').click();
    expect(page).toHaveURL('/posts');

    // assert
    const body = page.locator('body');
    await expect(body).not.toContainText('my custom title');
    await expect(body).not.toContainText('my custom body');
  });
});

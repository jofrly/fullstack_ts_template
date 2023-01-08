import { Page } from '@playwright/test';

export async function seedData(page: Page, group: string, seed: string): Promise<any> {
  const response = await page.request.post('http://localhost:3001/api/seed', { data: { group, seed } });
  return response.json();
}

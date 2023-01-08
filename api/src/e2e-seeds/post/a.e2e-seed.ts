import { FactoryBot } from '../../../specs/support/general';

export default async function(): Promise<any> {
  await FactoryBot.create('post', {
    title: 'first post title',
    body: 'first post body'
  });

  await FactoryBot.create('post', {
    title: 'second post title',
    body: 'some extra long body with more than twenty characters'
  });
}

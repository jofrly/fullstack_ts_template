import { FactoryBot } from '../../../specs/support/general';

export default async function BSeed(): Promise<any> {
  const post = await FactoryBot.create('post', {
    title: 'first post title',
    body: 'first post body'
  });

  return { id: post.id };
}

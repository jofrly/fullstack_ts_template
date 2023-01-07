import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

const PREVIEW_CHARACTERS = 20;

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  body: string;

  get previewBody(): string {
    if (this.body.length > PREVIEW_CHARACTERS) {
      return `${this.body.substring(0, 17)}...`;
    } else {
      return this.body;
    }
  }
}

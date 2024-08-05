import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Paragraph } from './paragraph.entity';
import { Voice } from './voice.entity';

@Entity({ name: 'audios' })
export class Audio extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Resemble internal ID',
    select: false,
  })
  providerId: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'S3 bucket key',
  })
  storageProviderKey: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  storageFileUrl: string;

  @ManyToOne(() => Paragraph, (paragraph) => paragraph.audios)
  paragraph: Paragraph;

  @ManyToOne(() => Voice, (voice) => voice.audios)
  voice: Voice;
}

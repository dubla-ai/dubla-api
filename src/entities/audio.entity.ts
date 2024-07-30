import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Paragraph } from './paragraph.entity';

@Entity({ name: 'audios' })
export class Audio extends BaseEntity {
  @ManyToOne(() => Paragraph, (paragraph) => paragraph.audios)
  paragraph: Paragraph;

  @Column({ type: 'varchar', length: 255, nullable: true })
  providerKey: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  fileUrl: string;
}

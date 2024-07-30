import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Voice } from './voice.entity';
import { Audio } from './audio.entity';

@Entity({ name: 'paragraphs' })
export class Paragraph extends BaseEntity {
  @Column()
  name: string;

  @Column()
  text: string;

  @OneToMany(() => Audio, (audio) => audio.paragraph)
  audios: Audio[];

  @ManyToOne(() => Voice, (voice) => voice.paragraphs)
  voice: Voice;
}

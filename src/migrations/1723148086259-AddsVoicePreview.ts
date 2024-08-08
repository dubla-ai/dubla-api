import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddsVoicePreview1723148086259 implements MigrationInterface {
  name = 'AddsVoicePreview1723148086259';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "voices" ADD "preview" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "voices" DROP COLUMN "preview"`);
  }
}

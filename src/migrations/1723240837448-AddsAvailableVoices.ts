import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddsAvailableVoices1723240837448 implements MigrationInterface {
  name = 'AddsAvailableVoices1723240837448';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "plans" ADD "monthlyVoiceCredits" integer NOT NULL DEFAULT '1'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "plans" DROP COLUMN "monthlyVoiceCredits"`,
    );
  }
}

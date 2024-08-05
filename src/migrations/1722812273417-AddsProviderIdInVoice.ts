import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddsProviderIdInVoice1722812273417 implements MigrationInterface {
  name = 'AddsProviderIdInVoice1722812273417';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "voices" ADD "providerId" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "voices" DROP COLUMN "providerId"`);
  }
}

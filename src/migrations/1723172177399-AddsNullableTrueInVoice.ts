import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddsNullableTrueInVoice1723172177399
  implements MigrationInterface
{
  name = 'AddsNullableTrueInVoice1723172177399';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "providerId"`);
    await queryRunner.query(
      `ALTER TABLE "voices" ALTER COLUMN "gender" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "voices" ALTER COLUMN "ageGroup" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "voices" ALTER COLUMN "style" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "voices" ALTER COLUMN "style" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "voices" ALTER COLUMN "ageGroup" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "voices" ALTER COLUMN "gender" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects" ADD "providerId" character varying NOT NULL`,
    );
  }
}

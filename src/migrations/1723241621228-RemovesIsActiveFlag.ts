import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemovesIsActiveFlag1723241621228 implements MigrationInterface {
  name = 'RemovesIsActiveFlag1723241621228';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "voices" DROP COLUMN "isActive"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "voices" ADD "isActive" boolean NOT NULL DEFAULT false`,
    );
  }
}

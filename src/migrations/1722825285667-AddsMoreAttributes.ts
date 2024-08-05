import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddsMoreAttributes1722825285667 implements MigrationInterface {
  name = 'AddsMoreAttributes1722825285667';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "voices" ADD "userId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "audios" ADD "isSelected" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "voices" ADD CONSTRAINT "FK_503699a442f1e77ec4041586989" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "voices" DROP CONSTRAINT "FK_503699a442f1e77ec4041586989"`,
    );
    await queryRunner.query(`ALTER TABLE "audios" DROP COLUMN "isSelected"`);
    await queryRunner.query(`ALTER TABLE "voices" DROP COLUMN "userId"`);
  }
}

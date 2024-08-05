import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddsSeconds1722823080923 implements MigrationInterface {
  name = 'AddsSeconds1722823080923';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "audios" ADD "durationInSeconds" double precision NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "plans" DROP COLUMN "price"`);
    await queryRunner.query(
      `ALTER TABLE "plans" ADD "price" numeric(10,2) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "plans" DROP COLUMN "price"`);
    await queryRunner.query(`ALTER TABLE "plans" ADD "price" integer NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "audios" DROP COLUMN "durationInSeconds"`,
    );
  }
}

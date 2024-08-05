import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddsUserAttributes1722901866121 implements MigrationInterface {
  name = 'AddsUserAttributes1722901866121';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "phone" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "userOrigin" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "userOrigin"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
  }
}

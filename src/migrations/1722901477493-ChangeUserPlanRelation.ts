import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeUserPlanRelation1722901477493 implements MigrationInterface {
  name = 'ChangeUserPlanRelation1722901477493';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_plans" DROP CONSTRAINT "FK_e7dfb1112dc2436d350d67f56d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_plans" ADD CONSTRAINT "UQ_e7dfb1112dc2436d350d67f56d7" UNIQUE ("userId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_plans" ADD CONSTRAINT "FK_e7dfb1112dc2436d350d67f56d7" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_plans" DROP CONSTRAINT "FK_e7dfb1112dc2436d350d67f56d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_plans" DROP CONSTRAINT "UQ_e7dfb1112dc2436d350d67f56d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_plans" ADD CONSTRAINT "FK_e7dfb1112dc2436d350d67f56d7" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}

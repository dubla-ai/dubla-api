import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddsUserPlan1722899170400 implements MigrationInterface {
  name = 'AddsUserPlan1722899170400';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_56f2aa669ddbe83eab8a25898b2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "planId" TO "cpf"`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_plans" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, "paymentDetails" json NOT NULL, "userId" uuid, "planId" uuid, CONSTRAINT "PK_bbff9d5e095f9c76cc66e78a951" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "cpf"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "cpf" character varying`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_230b925048540454c8b4c481e1c" UNIQUE ("cpf")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_plans" ADD CONSTRAINT "FK_e7dfb1112dc2436d350d67f56d7" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_plans" ADD CONSTRAINT "FK_4846c2fbd62da9a99cb2f5146a6" FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_plans" DROP CONSTRAINT "FK_4846c2fbd62da9a99cb2f5146a6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_plans" DROP CONSTRAINT "FK_e7dfb1112dc2436d350d67f56d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_230b925048540454c8b4c481e1c"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "cpf"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "cpf" uuid`);
    await queryRunner.query(`DROP TABLE "user_plans"`);
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "cpf" TO "planId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_56f2aa669ddbe83eab8a25898b2" FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}

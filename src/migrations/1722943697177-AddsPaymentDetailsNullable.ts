import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddsPaymentDetailsNullable1722943697177
  implements MigrationInterface
{
  name = 'AddsPaymentDetailsNullable1722943697177';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_plans" ALTER COLUMN "paymentDetails" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_plans" ALTER COLUMN "paymentDetails" SET NOT NULL`,
    );
  }
}

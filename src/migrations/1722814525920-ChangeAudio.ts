import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeAudio1722814525920 implements MigrationInterface {
  name = 'ChangeAudio1722814525920';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "paragraphs" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "paragraphs" DROP COLUMN "text"`);
    await queryRunner.query(
      `ALTER TABLE "paragraphs" ADD "title" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "paragraphs" ADD "body" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "paragraphs" DROP COLUMN "body"`);
    await queryRunner.query(`ALTER TABLE "paragraphs" DROP COLUMN "title"`);
    await queryRunner.query(
      `ALTER TABLE "paragraphs" ADD "text" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "paragraphs" ADD "name" character varying NOT NULL`,
    );
  }
}

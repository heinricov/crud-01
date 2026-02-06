import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBlogTimestamps1770353241898 implements MigrationInterface {
  name = 'AddBlogTimestamps1770353241898';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "blog" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "blog" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "blog" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "blog" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "blog" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "blog" ADD "updatedAt" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "blog" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "blog" ADD "createdAt" TIMESTAMP NOT NULL`,
    );
  }
}

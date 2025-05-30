import { MigrationInterface, QueryRunner } from 'typeorm';

export class HolderPostIdNullable1744283253169 implements MigrationInterface {
  name = 'HolderPostIdNullable1744283253169';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "target" ALTER COLUMN "holderPostId" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "target" ALTER COLUMN "holderPostId" SET NOT NULL`,
    );
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class GoalcontentNotNull1727272577482 implements MigrationInterface {
  name = 'GoalcontentNotNull1727272577482';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "goal" ALTER COLUMN "content" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "goal" ALTER COLUMN "content" DROP NOT NULL`,
    );
  }
}

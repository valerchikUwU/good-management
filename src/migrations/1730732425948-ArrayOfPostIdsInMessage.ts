import { MigrationInterface, QueryRunner } from 'typeorm';

export class ArrayOfPostIdsInMessage1730732425948
  implements MigrationInterface
{
  name = 'ArrayOfPostIdsInMessage1730732425948';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "message" RENAME COLUMN "recieverPostId" TO "pathOfPosts"`,
    );
    await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "pathOfPosts"`);
    await queryRunner.query(
      `ALTER TABLE "message" ADD "pathOfPosts" uuid array`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "pathOfPosts"`);
    await queryRunner.query(`ALTER TABLE "message" ADD "pathOfPosts" uuid`);
    await queryRunner.query(
      `ALTER TABLE "message" RENAME COLUMN "pathOfPosts" TO "recieverPostId"`,
    );
  }
}

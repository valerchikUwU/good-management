import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedTimeSeenMessage1739869863813 implements MigrationInterface {
  name = 'AddedTimeSeenMessage1739869863813';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "message" ADD "timeSeen" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "timeSeen"`);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewPropToMessage1730732182684 implements MigrationInterface {
  name = 'NewPropToMessage1730732182684';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "message" ADD "recieverId" uuid`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "recieverId"`);
  }
}

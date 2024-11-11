import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedTimeStampsTargetHolder1729783544889
  implements MigrationInterface
{
  name = 'AddedTimeStampsTargetHolder1729783544889';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "target_holder" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "target_holder" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "target_holder" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "target_holder" DROP COLUMN "createdAt"`,
    );
  }
}

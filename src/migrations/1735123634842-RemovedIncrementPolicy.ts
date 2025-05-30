import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemovedIncrementPolicy1735123634842 implements MigrationInterface {
  name = 'RemovedIncrementPolicy1735123634842';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "policy" ALTER COLUMN "policyNumber" DROP DEFAULT`,
    );
    await queryRunner.query(`DROP SEQUENCE "policy_policyNumber_seq"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE SEQUENCE IF NOT EXISTS "policy_policyNumber_seq" OWNED BY "policy"."policyNumber"`,
    );
    await queryRunner.query(
      `ALTER TABLE "policy" ALTER COLUMN "policyNumber" SET DEFAULT nextval('"policy_policyNumber_seq"')`,
    );
  }
}

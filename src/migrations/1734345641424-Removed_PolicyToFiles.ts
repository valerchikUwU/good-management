import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemovedPolicyToFiles1734345641424 implements MigrationInterface {
  name = 'RemovedPolicyToFiles1734345641424';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "file" DROP CONSTRAINT "FK_53940b40b330b963b360df7a29e"`,
    );
    await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "policyId"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "file" ADD "policyId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "file" ADD CONSTRAINT "FK_53940b40b330b963b360df7a29e" FOREIGN KEY ("policyId") REFERENCES "policy"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}

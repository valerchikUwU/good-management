import { MigrationInterface, QueryRunner } from 'typeorm';

export class GoalToOrganization1728572099504 implements MigrationInterface {
  name = 'GoalToOrganization1728572099504';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "goal" ADD "organizationId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "goal" ADD CONSTRAINT "UQ_c6e8ae55a4db3584686cbf6afe1" UNIQUE ("organizationId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "target" ALTER COLUMN "dateStart" SET DEFAULT '"2024-10-10T14:55:01.465Z"'`,
    );
    await queryRunner.query(
      `ALTER TABLE "goal" ADD CONSTRAINT "FK_c6e8ae55a4db3584686cbf6afe1" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "goal" DROP CONSTRAINT "FK_c6e8ae55a4db3584686cbf6afe1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "target" ALTER COLUMN "dateStart" SET DEFAULT '2024-10-10 14:50:11.042'`,
    );
    await queryRunner.query(
      `ALTER TABLE "goal" DROP CONSTRAINT "UQ_c6e8ae55a4db3584686cbf6afe1"`,
    );
    await queryRunner.query(`ALTER TABLE "goal" DROP COLUMN "organizationId"`);
  }
}

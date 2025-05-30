import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedOrgColor1740738816723 implements MigrationInterface {
  name = 'AddedOrgColor1740738816723';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization" ADD "organizationColor" character varying(10)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization" DROP COLUMN "organizationColor"`,
    );
  }
}

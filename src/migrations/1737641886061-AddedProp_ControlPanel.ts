import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedPropControlPanel1737641886061 implements MigrationInterface {
  name = 'AddedPropControlPanel1737641886061';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "control_panel" ADD "isNameChanged" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "control_panel" DROP COLUMN "isNameChanged"`,
    );
  }
}

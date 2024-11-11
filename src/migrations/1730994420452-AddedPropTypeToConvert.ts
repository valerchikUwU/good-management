import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedPropTypeToConvert1730994420452 implements MigrationInterface {
  name = 'AddedPropTypeToConvert1730994420452';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."convert_converttype_enum" AS ENUM('Прямой', 'Приказ', 'Согласование')`,
    );
    await queryRunner.query(
      `ALTER TABLE "convert" ADD "convertType" "public"."convert_converttype_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "convert" ADD "activeUserId" uuid`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "convert" DROP COLUMN "activeUserId"`);
    await queryRunner.query(`ALTER TABLE "convert" DROP COLUMN "convertType"`);
    await queryRunner.query(`DROP TYPE "public"."convert_converttype_enum"`);
  }
}

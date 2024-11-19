import { MigrationInterface, QueryRunner } from "typeorm";

export class PoliciesToOrganization1732008414781 implements MigrationInterface {
    name = 'PoliciesToOrganization1732008414781'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."statistic_type_enum" RENAME TO "statistic_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."statistic_type_enum" AS ENUM('Прямая', 'Обратная')`);
        await queryRunner.query(`ALTER TABLE "statistic" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "statistic" ALTER COLUMN "type" TYPE "public"."statistic_type_enum" USING "type"::"text"::"public"."statistic_type_enum"`);
        await queryRunner.query(`ALTER TABLE "statistic" ALTER COLUMN "type" SET DEFAULT 'Прямая'`);
        await queryRunner.query(`DROP TYPE "public"."statistic_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."statistic_type_enum_old" AS ENUM('Прямая', 'Перевернутая', 'Обратная')`);
        await queryRunner.query(`ALTER TABLE "statistic" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "statistic" ALTER COLUMN "type" TYPE "public"."statistic_type_enum_old" USING "type"::"text"::"public"."statistic_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "statistic" ALTER COLUMN "type" SET DEFAULT 'Прямая'`);
        await queryRunner.query(`DROP TYPE "public"."statistic_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."statistic_type_enum_old" RENAME TO "statistic_type_enum"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class ControlPanelPropsChanges1736952019762 implements MigrationInterface {
    name = 'ControlPanelPropsChanges1736952019762'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "control_panel" ADD "orderNumber" integer NOT NULL`);
        await queryRunner.query(`ALTER TYPE "public"."control_panel_graphtype_enum" RENAME TO "control_panel_graphtype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."control_panel_graphtype_enum" AS ENUM('Ежегодовой', '13', '26', '52', 'Ежемесячный', 'Ежедневный')`);
        await queryRunner.query(`ALTER TABLE "control_panel" ALTER COLUMN "graphType" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "control_panel" ALTER COLUMN "graphType" TYPE "public"."control_panel_graphtype_enum" USING "graphType"::"text"::"public"."control_panel_graphtype_enum"`);
        await queryRunner.query(`ALTER TABLE "control_panel" ALTER COLUMN "graphType" SET DEFAULT 'Ежедневный'`);
        await queryRunner.query(`DROP TYPE "public"."control_panel_graphtype_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."control_panel_graphtype_enum_old" AS ENUM('13 недель', 'Ежедневные', 'Месячные')`);
        await queryRunner.query(`ALTER TABLE "control_panel" ALTER COLUMN "graphType" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "control_panel" ALTER COLUMN "graphType" TYPE "public"."control_panel_graphtype_enum_old" USING "graphType"::"text"::"public"."control_panel_graphtype_enum_old"`);
        await queryRunner.query(`ALTER TABLE "control_panel" ALTER COLUMN "graphType" SET DEFAULT 'Ежедневные'`);
        await queryRunner.query(`DROP TYPE "public"."control_panel_graphtype_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."control_panel_graphtype_enum_old" RENAME TO "control_panel_graphtype_enum"`);
        await queryRunner.query(`ALTER TABLE "control_panel" DROP COLUMN "orderNumber"`);
    }

}

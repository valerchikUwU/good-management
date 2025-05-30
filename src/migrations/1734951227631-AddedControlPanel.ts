import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedControlPanel1734951227631 implements MigrationInterface {
  name = 'AddedControlPanel1734951227631';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."control_panel_paneltype_enum" AS ENUM('Глобальная', 'Личная')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."control_panel_graphtype_enum" AS ENUM('13 недель', 'Месячные', 'Ежедневные')`,
    );
    await queryRunner.query(
      `CREATE TABLE "control_panel" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "panelName" character varying NOT NULL, "panelType" "public"."control_panel_paneltype_enum" NOT NULL DEFAULT 'Глобальная', "graphType" "public"."control_panel_graphtype_enum" NOT NULL DEFAULT 'Ежедневные', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5b7d73568d4db8993fe32913b93" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "panel_to_statistic" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "controlPanelId" uuid NOT NULL, "statisticId" uuid NOT NULL, CONSTRAINT "PK_6a97bbed21f3dd117e1c653ec1d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7b4fbbcc0a5cb0fcb2d1041141" ON "panel_to_statistic" ("controlPanelId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "panel_to_statistic" ADD CONSTRAINT "FK_7b4fbbcc0a5cb0fcb2d1041141d" FOREIGN KEY ("controlPanelId") REFERENCES "control_panel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "panel_to_statistic" ADD CONSTRAINT "FK_cc0da47767faed658adf3ed30dd" FOREIGN KEY ("statisticId") REFERENCES "statistic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "panel_to_statistic" DROP CONSTRAINT "FK_cc0da47767faed658adf3ed30dd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "panel_to_statistic" DROP CONSTRAINT "FK_7b4fbbcc0a5cb0fcb2d1041141d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7b4fbbcc0a5cb0fcb2d1041141"`,
    );
    await queryRunner.query(`DROP TABLE "panel_to_statistic"`);
    await queryRunner.query(`DROP TABLE "control_panel"`);
    await queryRunner.query(
      `DROP TYPE "public"."control_panel_graphtype_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."control_panel_paneltype_enum"`,
    );
  }
}

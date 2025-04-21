import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedPropToControlPanel1736955257566 implements MigrationInterface {
    name = 'AddedPropToControlPanel1736955257566'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "control_panel" ADD "controlPanelNumber" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "control_panel" ADD "postId" uuid`);
        await queryRunner.query(`ALTER TABLE "control_panel" ADD CONSTRAINT "FK_2efce09a10c55af81928255a706" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "control_panel" DROP CONSTRAINT "FK_2efce09a10c55af81928255a706"`);
        await queryRunner.query(`ALTER TABLE "control_panel" DROP COLUMN "postId"`);
        await queryRunner.query(`ALTER TABLE "control_panel" DROP COLUMN "controlPanelNumber"`);
    }

}

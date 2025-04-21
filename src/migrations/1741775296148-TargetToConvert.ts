import { MigrationInterface, QueryRunner } from "typeorm";

export class TargetToConvert1741775296148 implements MigrationInterface {
    name = 'TargetToConvert1741775296148'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "target" ADD "convertId" uuid`);
        await queryRunner.query(`ALTER TABLE "target" ADD CONSTRAINT "UQ_c32ec30acb8104bda79376f3af4" UNIQUE ("convertId")`);
        await queryRunner.query(`ALTER TABLE "target" ADD CONSTRAINT "FK_c32ec30acb8104bda79376f3af4" FOREIGN KEY ("convertId") REFERENCES "convert"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "target" DROP CONSTRAINT "FK_c32ec30acb8104bda79376f3af4"`);
        await queryRunner.query(`ALTER TABLE "target" DROP CONSTRAINT "UQ_c32ec30acb8104bda79376f3af4"`);
        await queryRunner.query(`ALTER TABLE "target" DROP COLUMN "convertId"`);
    }

}

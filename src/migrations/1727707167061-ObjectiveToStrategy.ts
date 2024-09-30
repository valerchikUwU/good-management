import { MigrationInterface, QueryRunner } from "typeorm";

export class ObjectiveToStrategy1727707167061 implements MigrationInterface {
    name = 'ObjectiveToStrategy1727707167061'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "objective" DROP CONSTRAINT "FK_3b9f2b0b950b992feb67e225e39"`);
        await queryRunner.query(`ALTER TABLE "objective" ADD CONSTRAINT "UQ_3b9f2b0b950b992feb67e225e39" UNIQUE ("strategyId")`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "telegramId" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "objective" ADD CONSTRAINT "FK_3b9f2b0b950b992feb67e225e39" FOREIGN KEY ("strategyId") REFERENCES "strategy"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "objective" DROP CONSTRAINT "FK_3b9f2b0b950b992feb67e225e39"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "telegramId" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "objective" DROP CONSTRAINT "UQ_3b9f2b0b950b992feb67e225e39"`);
        await queryRunner.query(`ALTER TABLE "objective" ADD CONSTRAINT "FK_3b9f2b0b950b992feb67e225e39" FOREIGN KEY ("strategyId") REFERENCES "strategy"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

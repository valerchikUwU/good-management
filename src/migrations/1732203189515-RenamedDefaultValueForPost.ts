import { MigrationInterface, QueryRunner } from "typeorm";

export class RenamedDefaultValueForPost1732203189515 implements MigrationInterface {
    name = 'RenamedDefaultValueForPost1732203189515'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "divisionName" SET DEFAULT 'Подразделение'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "divisionName" SET DEFAULT 'Подразделения'`);
    }

}

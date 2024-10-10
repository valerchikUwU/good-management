import { MigrationInterface, QueryRunner } from "typeorm";

export class GoalToOrganization1728571808856 implements MigrationInterface {
    name = 'GoalToOrganization1728571808856'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "target" ALTER COLUMN "dateStart" SET DEFAULT '"2024-10-10T14:50:11.042Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "target" ALTER COLUMN "dateStart" SET DEFAULT '2024-10-10 13:20:54.444'`);
    }

}

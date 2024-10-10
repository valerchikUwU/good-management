import { MigrationInterface, QueryRunner } from "typeorm";

export class UserAddedPropToTarget1728559022893 implements MigrationInterface {
    name = 'UserAddedPropToTarget1728559022893'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "target" ADD "activeResponsibleUserId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "target" ALTER COLUMN "orderNumber" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "target" ALTER COLUMN "dateStart" SET DEFAULT '"2024-10-10T11:17:05.726Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "target" ALTER COLUMN "dateStart" SET DEFAULT '2024-10-08 10:46:40.194'`);
        await queryRunner.query(`ALTER TABLE "target" ALTER COLUMN "orderNumber" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "target" DROP COLUMN "activeResponsibleUserId"`);
    }

}

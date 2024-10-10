import { MigrationInterface, QueryRunner } from "typeorm";

export class UserUpdatedNullableOptionTarget1728554123103 implements MigrationInterface {
    name = 'UserUpdatedNullableOptionTarget1728554123103'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "target" ALTER COLUMN "orderNumber" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "target" ALTER COLUMN "dateStart" SET DEFAULT '"2024-10-10T09:55:25.092Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "target" ALTER COLUMN "dateStart" SET DEFAULT '2024-10-08 10:46:40.194'`);
        await queryRunner.query(`ALTER TABLE "target" ALTER COLUMN "orderNumber" DROP NOT NULL`);
    }

}

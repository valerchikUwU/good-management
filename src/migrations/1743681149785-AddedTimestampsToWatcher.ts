import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedTimestampsToWatcher1743681149785 implements MigrationInterface {
    name = 'AddedTimestampsToWatcher1743681149785'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "watchers_to_convert" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "watchers_to_convert" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "watchers_to_convert" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "watchers_to_convert" DROP COLUMN "createdAt"`);
    }

}

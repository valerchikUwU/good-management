import { MigrationInterface, QueryRunner } from "typeorm";

export class UserAddedPropsForVkAuth1724748895284 implements MigrationInterface {
    name = 'UserAddedPropsForVkAuth1724748895284'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "avatar_url" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "vk_id" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "vk_id"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatar_url"`);
    }

}

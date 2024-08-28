import { MigrationInterface, QueryRunner } from "typeorm";

export class UserAddedNames1724425935398 implements MigrationInterface {
    name = 'UserAddedNames1724425935398'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "login"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "firstName" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "lastName" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "telegramId" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "telegramId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lastName"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "firstName"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "email" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "login" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "name" character varying(50) NOT NULL`);
    }

}

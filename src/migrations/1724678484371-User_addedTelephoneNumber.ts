import { MigrationInterface, QueryRunner } from "typeorm";

export class UserAddedTelephoneNumber1724678484371 implements MigrationInterface {
    name = 'UserAddedTelephoneNumber1724678484371'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "telephoneNumber" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "telephoneNumber"`);
    }

}

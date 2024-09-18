import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedAutoIncrementToPolicy1726670087892 implements MigrationInterface {
    name = 'AddedAutoIncrementToPolicy1726670087892'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "policy" ADD "policyNumber" SERIAL NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "policy" DROP COLUMN "policyNumber"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedNumberToMessage1741269335015 implements MigrationInterface {
    name = 'AddedNumberToMessage1741269335015'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" ADD "messageNumber" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "messageNumber"`);
    }

}

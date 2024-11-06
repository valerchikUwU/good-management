import { MigrationInterface, QueryRunner } from "typeorm";

export class NewPropToMessage1730731996183 implements MigrationInterface {
    name = 'NewPropToMessage1730731996183'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" ADD "nextPostId" uuid`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "nextPostId"`);
    }

}

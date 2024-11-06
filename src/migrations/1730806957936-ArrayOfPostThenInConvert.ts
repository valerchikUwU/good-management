import { MigrationInterface, QueryRunner } from "typeorm";

export class ArrayOfPostThenInConvert1730806957936 implements MigrationInterface {
    name = 'ArrayOfPostThenInConvert1730806957936'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "nextPostId"`);
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "pathOfPosts"`);
        await queryRunner.query(`ALTER TABLE "convert" ADD "pathOfPosts" uuid array`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "convert" DROP COLUMN "pathOfPosts"`);
        await queryRunner.query(`ALTER TABLE "message" ADD "pathOfPosts" uuid array`);
        await queryRunner.query(`ALTER TABLE "message" ADD "nextPostId" uuid`);
    }

}

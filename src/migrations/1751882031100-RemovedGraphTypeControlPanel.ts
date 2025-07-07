import { MigrationInterface, QueryRunner } from "typeorm";

export class RemovedGraphTypeControlPanel1751882031100 implements MigrationInterface {
    name = 'RemovedGraphTypeControlPanel1751882031100'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "post_roleId_fkey"`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_376552d942487d3c1953ad9304c" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_376552d942487d3c1953ad9304c"`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "post_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}

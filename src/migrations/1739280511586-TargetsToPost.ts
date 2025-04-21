import { MigrationInterface, QueryRunner } from "typeorm";

export class TargetsToPost1739280511586 implements MigrationInterface {
    name = 'TargetsToPost1739280511586'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "target" DROP CONSTRAINT "FK_c4c07ec516381bc0013a48cb143"`);
        await queryRunner.query(`ALTER TABLE "target" DROP CONSTRAINT "UQ_c4c07ec516381bc0013a48cb143"`);
        await queryRunner.query(`ALTER TABLE "target" ADD CONSTRAINT "FK_c4c07ec516381bc0013a48cb143" FOREIGN KEY ("senderPostId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "target" DROP CONSTRAINT "FK_c4c07ec516381bc0013a48cb143"`);
        await queryRunner.query(`ALTER TABLE "target" ADD CONSTRAINT "UQ_c4c07ec516381bc0013a48cb143" UNIQUE ("senderPostId")`);
        await queryRunner.query(`ALTER TABLE "target" ADD CONSTRAINT "FK_c4c07ec516381bc0013a48cb143" FOREIGN KEY ("senderPostId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

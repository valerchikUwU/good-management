import { MigrationInterface, QueryRunner } from "typeorm";

export class FixedPolicyToPolicyDirectoryRelation1732008625867 implements MigrationInterface {
    name = 'FixedPolicyToPolicyDirectoryRelation1732008625867'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "policy" ADD "organizationId" uuid`);
        await queryRunner.query(`ALTER TABLE "policy" ADD CONSTRAINT "FK_7727efb9fd8b4ca0f8dd425698f" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "policy" DROP CONSTRAINT "FK_7727efb9fd8b4ca0f8dd425698f"`);
        await queryRunner.query(`ALTER TABLE "policy" DROP COLUMN "organizationId"`);
    }

}

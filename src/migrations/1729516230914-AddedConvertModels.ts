import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedConvertModels1729516230914 implements MigrationInterface {
    name = 'AddedConvertModels1729516230914'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "message" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "convertId" uuid, "senderId" uuid NOT NULL, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "convert_to_user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "convertId" uuid, CONSTRAINT "PK_072cb2050a9b5a3ca06b858ed0f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8a3ffd8a8b3f0fba74d8b55fb7" ON "convert_to_user" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c0349cb2122bbead9be72369e6" ON "convert_to_user" ("convertId") `);
        await queryRunner.query(`CREATE TABLE "convert" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "convertTheme" character varying NOT NULL, "expirationTime" character varying NOT NULL, "dateFinish" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "hostId" uuid NOT NULL, "accountId" uuid NOT NULL, CONSTRAINT "PK_ce49f01f9693806a247239d0504" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "target" ALTER COLUMN "dateStart" SET DEFAULT '"2024-10-21T13:10:33.405Z"'`);
        await queryRunner.query(`ALTER TABLE "statistic_data" ALTER COLUMN "valueDate" SET DEFAULT '"2024-10-21T13:10:33.411Z"'`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_61fb800fdf4d052881ce8b1da29" FOREIGN KEY ("convertId") REFERENCES "convert"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_bc096b4e18b1f9508197cd98066" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "convert_to_user" ADD CONSTRAINT "FK_8a3ffd8a8b3f0fba74d8b55fb7d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "convert_to_user" ADD CONSTRAINT "FK_c0349cb2122bbead9be72369e67" FOREIGN KEY ("convertId") REFERENCES "convert"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "convert" ADD CONSTRAINT "FK_5b57abe08f540888eaefac1c342" FOREIGN KEY ("hostId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "convert" ADD CONSTRAINT "FK_92f0a21f1966cee5f74a004f1c5" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "convert" DROP CONSTRAINT "FK_92f0a21f1966cee5f74a004f1c5"`);
        await queryRunner.query(`ALTER TABLE "convert" DROP CONSTRAINT "FK_5b57abe08f540888eaefac1c342"`);
        await queryRunner.query(`ALTER TABLE "convert_to_user" DROP CONSTRAINT "FK_c0349cb2122bbead9be72369e67"`);
        await queryRunner.query(`ALTER TABLE "convert_to_user" DROP CONSTRAINT "FK_8a3ffd8a8b3f0fba74d8b55fb7d"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_bc096b4e18b1f9508197cd98066"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_61fb800fdf4d052881ce8b1da29"`);
        await queryRunner.query(`ALTER TABLE "statistic_data" ALTER COLUMN "valueDate" SET DEFAULT '2024-10-16 12:44:40.843'`);
        await queryRunner.query(`ALTER TABLE "target" ALTER COLUMN "dateStart" SET DEFAULT '2024-10-16 12:44:40.833'`);
        await queryRunner.query(`DROP TABLE "convert"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c0349cb2122bbead9be72369e6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8a3ffd8a8b3f0fba74d8b55fb7"`);
        await queryRunner.query(`DROP TABLE "convert_to_user"`);
        await queryRunner.query(`DROP TABLE "message"`);
    }

}

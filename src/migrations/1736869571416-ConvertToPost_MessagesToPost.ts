import { MigrationInterface, QueryRunner } from "typeorm";

export class ConvertToPostMessagesToPost1736869571416 implements MigrationInterface {
    name = 'ConvertToPostMessagesToPost1736869571416'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_bc096b4e18b1f9508197cd98066"`);
        await queryRunner.query(`ALTER TABLE "convert" DROP CONSTRAINT "FK_5b57abe08f540888eaefac1c342"`);
        await queryRunner.query(`CREATE TABLE "convert_to_post" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "postId" uuid, "convertId" uuid, CONSTRAINT "PK_7d85995785f6e182efb13a8199e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_24115eb24ec160fa1a07adbdbe" ON "convert_to_post" ("postId") `);
        await queryRunner.query(`CREATE INDEX "IDX_88fc2f96827f4d58ff1e86d653" ON "convert_to_post" ("convertId") `);
        await queryRunner.query(`ALTER TABLE "convert" DROP COLUMN "activeUserId"`);
        await queryRunner.query(`CREATE TYPE "public"."convert_convertpath_enum" AS ENUM('Прямой', 'Согласование', 'Запрос')`);
        await queryRunner.query(`ALTER TABLE "convert" ADD "convertPath" "public"."convert_convertpath_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "convert" ADD "convertStatus" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "convert" ADD "activePostId" uuid`);
        await queryRunner.query(`ALTER TABLE "convert" DROP COLUMN "expirationTime"`);
        await queryRunner.query(`ALTER TABLE "convert" ADD "expirationTime" integer NOT NULL`);
        await queryRunner.query(`ALTER TYPE "public"."convert_converttype_enum" RENAME TO "convert_converttype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."convert_converttype_enum" AS ENUM('Переписка', 'Приказ', 'Заявка')`);
        await queryRunner.query(`ALTER TABLE "convert" ALTER COLUMN "convertType" TYPE "public"."convert_converttype_enum" USING "convertType"::"text"::"public"."convert_converttype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."convert_converttype_enum_old"`);
        await queryRunner.query(`ALTER TABLE "convert" ALTER COLUMN "convertType" SET NOT NULL`);
        await queryRunner.query(`ALTER TYPE "public"."target_type_enum" RENAME TO "target_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."target_type_enum" AS ENUM('Обычная', 'Статистика', 'Правила', 'Продукт', 'Организационные мероприятия', 'Приказ', 'Личная')`);
        await queryRunner.query(`ALTER TABLE "target" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "target" ALTER COLUMN "type" TYPE "public"."target_type_enum" USING "type"::"text"::"public"."target_type_enum"`);
        await queryRunner.query(`ALTER TABLE "target" ALTER COLUMN "type" SET DEFAULT 'Обычная'`);
        await queryRunner.query(`DROP TYPE "public"."target_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_bc096b4e18b1f9508197cd98066" FOREIGN KEY ("senderId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "convert_to_post" ADD CONSTRAINT "FK_24115eb24ec160fa1a07adbdbef" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "convert_to_post" ADD CONSTRAINT "FK_88fc2f96827f4d58ff1e86d6537" FOREIGN KEY ("convertId") REFERENCES "convert"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "convert" ADD CONSTRAINT "FK_5b57abe08f540888eaefac1c342" FOREIGN KEY ("hostId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "convert" DROP CONSTRAINT "FK_5b57abe08f540888eaefac1c342"`);
        await queryRunner.query(`ALTER TABLE "convert_to_post" DROP CONSTRAINT "FK_88fc2f96827f4d58ff1e86d6537"`);
        await queryRunner.query(`ALTER TABLE "convert_to_post" DROP CONSTRAINT "FK_24115eb24ec160fa1a07adbdbef"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_bc096b4e18b1f9508197cd98066"`);
        await queryRunner.query(`CREATE TYPE "public"."target_type_enum_old" AS ENUM('Обычная', 'Статистика', 'Правила', 'Продукт', 'Организационные мероприятия')`);
        await queryRunner.query(`ALTER TABLE "target" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "target" ALTER COLUMN "type" TYPE "public"."target_type_enum_old" USING "type"::"text"::"public"."target_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "target" ALTER COLUMN "type" SET DEFAULT 'Обычная'`);
        await queryRunner.query(`DROP TYPE "public"."target_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."target_type_enum_old" RENAME TO "target_type_enum"`);
        await queryRunner.query(`ALTER TABLE "convert" ALTER COLUMN "convertType" DROP NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."convert_converttype_enum_old" AS ENUM('Прямой', 'Приказ', 'Согласование')`);
        await queryRunner.query(`ALTER TABLE "convert" ALTER COLUMN "convertType" TYPE "public"."convert_converttype_enum_old" USING "convertType"::"text"::"public"."convert_converttype_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."convert_converttype_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."convert_converttype_enum_old" RENAME TO "convert_converttype_enum"`);
        await queryRunner.query(`ALTER TABLE "convert" DROP COLUMN "expirationTime"`);
        await queryRunner.query(`ALTER TABLE "convert" ADD "expirationTime" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "convert" DROP COLUMN "activePostId"`);
        await queryRunner.query(`ALTER TABLE "convert" DROP COLUMN "convertStatus"`);
        await queryRunner.query(`ALTER TABLE "convert" DROP COLUMN "convertPath"`);
        await queryRunner.query(`DROP TYPE "public"."convert_convertpath_enum"`);
        await queryRunner.query(`ALTER TABLE "convert" ADD "activeUserId" uuid`);
        await queryRunner.query(`DROP INDEX "public"."IDX_88fc2f96827f4d58ff1e86d653"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_24115eb24ec160fa1a07adbdbe"`);
        await queryRunner.query(`DROP TABLE "convert_to_post"`);
        await queryRunner.query(`ALTER TABLE "convert" ADD CONSTRAINT "FK_5b57abe08f540888eaefac1c342" FOREIGN KEY ("hostId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_bc096b4e18b1f9508197cd98066" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

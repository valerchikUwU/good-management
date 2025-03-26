import { MigrationInterface, QueryRunner } from "typeorm";

export class DefaultForUnssenWatcherCount1742984912986 implements MigrationInterface {
    name = 'DefaultForUnssenWatcherCount1742984912986'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "watchers_to_convert" ALTER COLUMN "lastSeenNumber" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "watchers_to_convert" ALTER COLUMN "lastSeenNumber" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "watchers_to_convert" ALTER COLUMN "lastSeenNumber" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "watchers_to_convert" ALTER COLUMN "lastSeenNumber" DROP NOT NULL`);
    }

}

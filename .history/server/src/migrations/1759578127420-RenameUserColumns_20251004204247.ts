import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameUserColumns1759578127420 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.renameColumn('place', 'phone', 'phoneNumber');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}

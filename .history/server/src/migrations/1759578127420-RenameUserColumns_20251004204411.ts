import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameUserColumns1759578127420 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameColumn('user', 'phone', 'phoneNumber');
        await queryRunner.renameColumn('user', 'road_address_name', 'roadAddress');
        await queryRunner.renameColumn('user', 'category_group_name', 'categoryGroupName');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameColumn('user', 'phoneNumber', 'phone');
        await queryRunner.renameColumn('user', 'roadAddress', 'road_address_name');
        await queryRunner.renameColumn('user', 'categoryGroupName', 'category_group_name');
    }

}

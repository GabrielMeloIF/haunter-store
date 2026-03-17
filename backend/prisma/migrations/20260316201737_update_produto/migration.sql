/*
  Warnings:

  - You are about to drop the column `ativo` on the `produto` table. All the data in the column will be lost.
  - You are about to drop the column `dataUpdate` on the `produto` table. All the data in the column will be lost.
  - You are about to alter the column `preco` on the `produto` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.

*/
-- AlterTable
ALTER TABLE `produto` DROP COLUMN `ativo`,
    DROP COLUMN `dataUpdate`,
    MODIFY `preco` DOUBLE NOT NULL;

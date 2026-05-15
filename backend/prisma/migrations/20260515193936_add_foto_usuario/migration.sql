/*
  Warnings:

  - You are about to drop the column `tipo_produto` on the `produto` table. All the data in the column will be lost.
  - You are about to drop the column `cpf` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the column `endereco` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the column `telefone` on the `usuario` table. All the data in the column will be lost.
  - Added the required column `imagem_url` to the `produto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `confirmar_senha` to the `usuario` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Usuario_cpf_key` ON `usuario`;

-- AlterTable
ALTER TABLE `produto` DROP COLUMN `tipo_produto`,
    ADD COLUMN `imagem_url` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `usuario` DROP COLUMN `cpf`,
    DROP COLUMN `endereco`,
    DROP COLUMN `telefone`,
    ADD COLUMN `confirmar_senha` VARCHAR(191) NOT NULL,
    ADD COLUMN `foto` VARCHAR(191) NULL;

-- RenameIndex
ALTER TABLE `_usuarioconversas` RENAME INDEX `_UsuarioConversas_AB_unique` TO `_usuarioconversas_AB_unique`;

-- RenameIndex
ALTER TABLE `_usuarioconversas` RENAME INDEX `_UsuarioConversas_B_index` TO `_usuarioconversas_B_index`;

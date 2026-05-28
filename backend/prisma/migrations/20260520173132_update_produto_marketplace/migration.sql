-- DropForeignKey
ALTER TABLE `produto` DROP FOREIGN KEY `produto_categoriaId_fkey`;

-- AlterTable
ALTER TABLE `produto` ADD COLUMN `cep` VARCHAR(191) NULL,
    ADD COLUMN `cidade` VARCHAR(191) NULL,
    ADD COLUMN `condicao` VARCHAR(191) NULL,
    ADD COLUMN `contatos` JSON NULL,
    ADD COLUMN `id_usuario` INTEGER NULL,
    ADD COLUMN `imagens` JSON NULL,
    ADD COLUMN `marketplace` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `negociavel` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `categoriaId` INTEGER NULL,
    MODIFY `estoque` INTEGER NULL,
    MODIFY `imagem_url` TEXT NULL;

-- CreateIndex
CREATE INDEX `produto_id_usuario_idx` ON `produto`(`id_usuario`);

-- AddForeignKey
ALTER TABLE `produto` ADD CONSTRAINT `produto_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `produto` ADD CONSTRAINT `produto_categoriaId_fkey` FOREIGN KEY (`categoriaId`) REFERENCES `categoria`(`id_categoria`) ON DELETE SET NULL ON UPDATE CASCADE;

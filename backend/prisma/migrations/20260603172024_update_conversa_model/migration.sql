/*
  Warnings:

  - You are about to drop the `_usuarioconversas` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `participante1Id` to the `conversa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `participante2Id` to the `conversa` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_usuarioconversas` DROP FOREIGN KEY `_usuarioconversas_A_fkey`;

-- DropForeignKey
ALTER TABLE `_usuarioconversas` DROP FOREIGN KEY `_usuarioconversas_B_fkey`;

-- DropForeignKey
ALTER TABLE `avaliacao` DROP FOREIGN KEY `avaliacao_id_produto_fkey`;

-- DropForeignKey
ALTER TABLE `avaliacao` DROP FOREIGN KEY `avaliacao_id_usuario_fkey`;

-- DropForeignKey
ALTER TABLE `carrinho` DROP FOREIGN KEY `carrinho_id_produto_fkey`;

-- DropForeignKey
ALTER TABLE `carrinho` DROP FOREIGN KEY `carrinho_id_usuario_fkey`;

-- DropForeignKey
ALTER TABLE `cupomusuario` DROP FOREIGN KEY `cupomusuario_id_cupom_fkey`;

-- DropForeignKey
ALTER TABLE `cupomusuario` DROP FOREIGN KEY `cupomusuario_id_usuario_fkey`;

-- DropForeignKey
ALTER TABLE `itempedido` DROP FOREIGN KEY `itemPedido_id_pedido_fkey`;

-- DropForeignKey
ALTER TABLE `itempedido` DROP FOREIGN KEY `itemPedido_id_produto_fkey`;

-- DropForeignKey
ALTER TABLE `notificacao` DROP FOREIGN KEY `notificacao_id_usuario_fkey`;

-- DropForeignKey
ALTER TABLE `pedido` DROP FOREIGN KEY `pedido_id_usuario_fkey`;

-- DropForeignKey
ALTER TABLE `produto` DROP FOREIGN KEY `produto_categoriaId_fkey`;

-- AlterTable
ALTER TABLE `conversa` ADD COLUMN `participante1Id` INTEGER NOT NULL,
    ADD COLUMN `participante2Id` INTEGER NOT NULL;

-- DropTable
DROP TABLE `_usuarioconversas`;

-- AddForeignKey
ALTER TABLE `avaliacao` ADD CONSTRAINT `Avaliacao_id_produto_fkey` FOREIGN KEY (`id_produto`) REFERENCES `produto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `avaliacao` ADD CONSTRAINT `Avaliacao_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `carrinho` ADD CONSTRAINT `Carrinho_id_produto_fkey` FOREIGN KEY (`id_produto`) REFERENCES `produto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `carrinho` ADD CONSTRAINT `Carrinho_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conversa` ADD CONSTRAINT `conversa_participante1Id_fkey` FOREIGN KEY (`participante1Id`) REFERENCES `usuario`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conversa` ADD CONSTRAINT `conversa_participante2Id_fkey` FOREIGN KEY (`participante2Id`) REFERENCES `usuario`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cupomusuario` ADD CONSTRAINT `CupomUsuario_id_cupom_fkey` FOREIGN KEY (`id_cupom`) REFERENCES `cupom`(`id_cupom`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cupomusuario` ADD CONSTRAINT `CupomUsuario_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `itempedido` ADD CONSTRAINT `ItemPedido_id_pedido_fkey` FOREIGN KEY (`id_pedido`) REFERENCES `pedido`(`id_pedido`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `itempedido` ADD CONSTRAINT `ItemPedido_id_produto_fkey` FOREIGN KEY (`id_produto`) REFERENCES `produto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notificacao` ADD CONSTRAINT `Notificacao_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pedido` ADD CONSTRAINT `Pedido_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `produto` ADD CONSTRAINT `Produto_categoriaId_fkey` FOREIGN KEY (`categoriaId`) REFERENCES `categoria`(`id_categoria`) ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `avaliacao` RENAME INDEX `avaliacao_id_produto_fkey` TO `Avaliacao_id_produto_fkey`;

-- RenameIndex
ALTER TABLE `avaliacao` RENAME INDEX `avaliacao_id_usuario_fkey` TO `Avaliacao_id_usuario_fkey`;

-- RenameIndex
ALTER TABLE `carrinho` RENAME INDEX `carrinho_id_produto_fkey` TO `Carrinho_id_produto_fkey`;

-- RenameIndex
ALTER TABLE `carrinho` RENAME INDEX `carrinho_id_usuario_fkey` TO `Carrinho_id_usuario_fkey`;

-- RenameIndex
ALTER TABLE `categoria` RENAME INDEX `categoria_nome_categoria_key` TO `Categoria_nome_categoria_key`;

-- RenameIndex
ALTER TABLE `cupom` RENAME INDEX `cupom_codigo_key` TO `Cupom_codigo_key`;

-- RenameIndex
ALTER TABLE `cupomusuario` RENAME INDEX `cupomusuario_id_cupom_fkey` TO `CupomUsuario_id_cupom_fkey`;

-- RenameIndex
ALTER TABLE `cupomusuario` RENAME INDEX `cupomusuario_id_usuario_fkey` TO `CupomUsuario_id_usuario_fkey`;

-- RenameIndex
ALTER TABLE `itempedido` RENAME INDEX `itemPedido_id_pedido_fkey` TO `ItemPedido_id_pedido_fkey`;

-- RenameIndex
ALTER TABLE `itempedido` RENAME INDEX `itemPedido_id_produto_fkey` TO `ItemPedido_id_produto_fkey`;

-- RenameIndex
ALTER TABLE `mensagem` RENAME INDEX `mensagem_id_conversa_fkey` TO `mensagem_id_conversa_idx`;

-- RenameIndex
ALTER TABLE `mensagem` RENAME INDEX `mensagem_id_remetente_fkey` TO `mensagem_id_remetente_idx`;

-- RenameIndex
ALTER TABLE `notificacao` RENAME INDEX `notificacao_id_usuario_fkey` TO `Notificacao_id_usuario_fkey`;

-- RenameIndex
ALTER TABLE `pedido` RENAME INDEX `pedido_id_usuario_fkey` TO `Pedido_id_usuario_fkey`;

-- RenameIndex
ALTER TABLE `produto` RENAME INDEX `produto_categoriaId_fkey` TO `Produto_categoriaId_fkey`;

-- RenameIndex
ALTER TABLE `usuario` RENAME INDEX `usuario_email_key` TO `Usuario_email_key`;

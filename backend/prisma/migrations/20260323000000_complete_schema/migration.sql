-- ============================================================
-- Migration: complete_schema
-- Adiciona tipo_usuario ao Usuario, tipo_produto ao Produto,
-- e cria as tabelas Carrinho, Pedido e ItemPedido.
-- ============================================================

-- Enums (MySQL usa ENUM nativo)
-- Alterar usuario: adicionar data_cadastro e tipo_usuario
ALTER TABLE `usuario`
  ADD COLUMN `data_cadastro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  ADD COLUMN `tipo_usuario`  ENUM('CLIENTE', 'ADMIN') NOT NULL DEFAULT 'CLIENTE';

-- Alterar produto: adicionar tipo_produto
ALTER TABLE `produto`
  ADD COLUMN `tipo_produto` VARCHAR(191) NULL;

-- Criar tabela carrinho
CREATE TABLE `carrinho` (
    `id_carrinho`     INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario`      INTEGER NOT NULL,
    `id_produto`      INTEGER NOT NULL,
    `quantidade`      INTEGER NOT NULL,
    `data_adicionado` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_carrinho`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Criar tabela pedido
CREATE TABLE `pedido` (
    `id_pedido`   INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario`  INTEGER NOT NULL,
    `data_pedido` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `valor_total` DOUBLE NOT NULL,
    `status`      ENUM('PENDENTE', 'CONFIRMADO', 'ENVIADO', 'ENTREGUE', 'CANCELADO') NOT NULL DEFAULT 'PENDENTE',

    PRIMARY KEY (`id_pedido`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Criar tabela itemPedido
CREATE TABLE `itemPedido` (
    `id_item`        INTEGER NOT NULL AUTO_INCREMENT,
    `id_pedido`      INTEGER NOT NULL,
    `id_produto`     INTEGER NOT NULL,
    `quantidade`     INTEGER NOT NULL,
    `preco_unitario` DOUBLE NOT NULL,

    PRIMARY KEY (`id_item`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Foreign Keys: carrinho
ALTER TABLE `carrinho`
  ADD CONSTRAINT `carrinho_id_usuario_fkey`
    FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id_usuario`)
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `carrinho`
  ADD CONSTRAINT `carrinho_id_produto_fkey`
    FOREIGN KEY (`id_produto`) REFERENCES `produto`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE;

-- Foreign Keys: pedido
ALTER TABLE `pedido`
  ADD CONSTRAINT `pedido_id_usuario_fkey`
    FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id_usuario`)
    ON DELETE RESTRICT ON UPDATE CASCADE;

-- Foreign Keys: itemPedido
ALTER TABLE `itemPedido`
  ADD CONSTRAINT `itemPedido_id_pedido_fkey`
    FOREIGN KEY (`id_pedido`) REFERENCES `pedido`(`id_pedido`)
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `itemPedido`
  ADD CONSTRAINT `itemPedido_id_produto_fkey`
    FOREIGN KEY (`id_produto`) REFERENCES `produto`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE;

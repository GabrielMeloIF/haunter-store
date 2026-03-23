-- ============================================================
-- Migration: complete_schema
-- Adiciona tipo_usuario ao Usuario, tipo_produto ao Produto,
-- e cria as tabelas Carrinho, Pedido e ItemPedido.
-- ============================================================

-- Enums (MySQL usa ENUM nativo)
-- Alterar Usuario: adicionar data_cadastro e tipo_usuario
ALTER TABLE `Usuario`
  ADD COLUMN `data_cadastro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  ADD COLUMN `tipo_usuario`  ENUM('CLIENTE', 'ADMIN') NOT NULL DEFAULT 'CLIENTE';

-- Alterar Produto: adicionar tipo_produto
ALTER TABLE `Produto`
  ADD COLUMN `tipo_produto` VARCHAR(191) NULL;

-- Criar tabela Carrinho
CREATE TABLE `Carrinho` (
    `id_carrinho`     INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario`      INTEGER NOT NULL,
    `id_produto`      INTEGER NOT NULL,
    `quantidade`      INTEGER NOT NULL,
    `data_adicionado` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_carrinho`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Criar tabela Pedido
CREATE TABLE `Pedido` (
    `id_pedido`   INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario`  INTEGER NOT NULL,
    `data_pedido` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `valor_total` DOUBLE NOT NULL,
    `status`      ENUM('PENDENTE', 'CONFIRMADO', 'ENVIADO', 'ENTREGUE', 'CANCELADO') NOT NULL DEFAULT 'PENDENTE',

    PRIMARY KEY (`id_pedido`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Criar tabela ItemPedido
CREATE TABLE `ItemPedido` (
    `id_item`        INTEGER NOT NULL AUTO_INCREMENT,
    `id_pedido`      INTEGER NOT NULL,
    `id_produto`     INTEGER NOT NULL,
    `quantidade`     INTEGER NOT NULL,
    `preco_unitario` DOUBLE NOT NULL,

    PRIMARY KEY (`id_item`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Foreign Keys: Carrinho
ALTER TABLE `Carrinho`
  ADD CONSTRAINT `Carrinho_id_usuario_fkey`
    FOREIGN KEY (`id_usuario`) REFERENCES `Usuario`(`id_usuario`)
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `Carrinho`
  ADD CONSTRAINT `Carrinho_id_produto_fkey`
    FOREIGN KEY (`id_produto`) REFERENCES `Produto`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE;

-- Foreign Keys: Pedido
ALTER TABLE `Pedido`
  ADD CONSTRAINT `Pedido_id_usuario_fkey`
    FOREIGN KEY (`id_usuario`) REFERENCES `Usuario`(`id_usuario`)
    ON DELETE RESTRICT ON UPDATE CASCADE;

-- Foreign Keys: ItemPedido
ALTER TABLE `ItemPedido`
  ADD CONSTRAINT `ItemPedido_id_pedido_fkey`
    FOREIGN KEY (`id_pedido`) REFERENCES `Pedido`(`id_pedido`)
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `ItemPedido`
  ADD CONSTRAINT `ItemPedido_id_produto_fkey`
    FOREIGN KEY (`id_produto`) REFERENCES `Produto`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE;

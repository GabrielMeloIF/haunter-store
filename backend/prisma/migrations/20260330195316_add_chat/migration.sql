-- CreateTable
CREATE TABLE `Conversa` (
    `id_conversa` INTEGER NOT NULL AUTO_INCREMENT,
    `criada_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_conversa`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Mensagem` (
    `id_mensagem` INTEGER NOT NULL AUTO_INCREMENT,
    `id_conversa` INTEGER NOT NULL,
    `id_remetente` INTEGER NOT NULL,
    `conteudo` TEXT NOT NULL,
    `lida` BOOLEAN NOT NULL DEFAULT false,
    `enviada_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_mensagem`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notificacao` (
    `id_notificacao` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NOT NULL,
    `tipo` ENUM('MENSAGEM', 'CONVERSA', 'SISTEMA') NOT NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `descricao` TEXT NOT NULL,
    `lida` BOOLEAN NOT NULL DEFAULT false,
    `criada_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_notificacao`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_UsuarioConversas` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_UsuarioConversas_AB_unique`(`A`, `B`),
    INDEX `_UsuarioConversas_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Mensagem` ADD CONSTRAINT `Mensagem_id_conversa_fkey` FOREIGN KEY (`id_conversa`) REFERENCES `Conversa`(`id_conversa`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mensagem` ADD CONSTRAINT `Mensagem_id_remetente_fkey` FOREIGN KEY (`id_remetente`) REFERENCES `Usuario`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notificacao` ADD CONSTRAINT `Notificacao_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `Usuario`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UsuarioConversas` ADD CONSTRAINT `_UsuarioConversas_A_fkey` FOREIGN KEY (`A`) REFERENCES `Conversa`(`id_conversa`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UsuarioConversas` ADD CONSTRAINT `_UsuarioConversas_B_fkey` FOREIGN KEY (`B`) REFERENCES `Usuario`(`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

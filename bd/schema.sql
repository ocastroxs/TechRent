-- =============================================
-- TECHRENT - SISTEMA DE CHAMADOS DE TI
-- =============================================
-- Script SQL completo e atualizado para o banco de dados TechRent.
-- Inclui tabelas e views, com correções e melhorias.
--
-- INSTRUÇÕES:
-- 1. Conecte-se ao seu servidor MySQL (ex: MySQL Workbench, terminal).
-- 2. Execute este script completo para criar/recriar o banco de dados e todas as suas estruturas.
--    CUIDADO: Se o banco 'techrent_db' já existir, ele será DROPPADO e recriado, apagando todos os dados!
-- =============================================

DROP DATABASE IF EXISTS techrent_db;
CREATE DATABASE IF NOT EXISTS techrent_db;
USE techrent_db;

-- =============================================
-- 1. USUÁRIOS
-- =============================================
-- Armazena todos os perfis do sistema.
-- nivel_acesso define o que cada usuário pode fazer:
--   'cliente'  -> abre chamados
--   'tecnico'  -> atende chamados
--   'admin'    -> gerencia tudo
CREATE TABLE usuarios (
    id           INT PRIMARY KEY AUTO_INCREMENT,
    nome         VARCHAR(100)  NOT NULL,
    email        VARCHAR(100)  UNIQUE NOT NULL,
    senha        VARCHAR(255)  NOT NULL, -- sempre salvar o HASH (bcrypt), nunca a senha em texto
    nivel_acesso ENUM('cliente', 'admin', 'tecnico') DEFAULT 'cliente',
    criado_em    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 
-- =============================================
-- 2. EQUIPAMENTOS
-- =============================================
-- Inventário de máquinas/dispositivos do laboratório.
-- O campo 'status' indica a condição operacional do equipamento:
--   'operacional'   -> funcionando normalmente; cliente pode abrir chamado
--   'em_manutencao' -> com chamado aberto / sendo atendido pelo técnico
--   'desativado'    -> aposentado ou descartado; fora do sistema
CREATE TABLE equipamentos (
    id          INT PRIMARY KEY AUTO_INCREMENT,
    nome        VARCHAR(100) NOT NULL,
    categoria   VARCHAR(50),              -- Ex: Notebook, Projetor, Impressora, Servidor
    patrimonio  VARCHAR(50) UNIQUE,       -- número de patrimônio (etiqueta física)
    status      ENUM('operacional', 'em_manutencao', 'desativado') DEFAULT 'operacional',
    descricao   TEXT
);

-- =============================================
-- 3. CHAMADOS
-- =============================================
-- Registro central de cada solicitação de atendimento.
-- Um chamado vincula um cliente a um equipamento com problema.
-- O campo 'tecnico_id' é preenchido quando um técnico assume o chamado.
--
-- Fluxo de status:
--   aberto -> em_atendimento -> resolvido
--                           -> cancelado
CREATE TABLE chamados (
    id             INT PRIMARY KEY AUTO_INCREMENT,
    titulo         VARCHAR(150) NOT NULL,           -- breve descrição do problema
    descricao      TEXT,                             -- detalhes informados pelo cliente
    cliente_id     INT NOT NULL,                     -- quem abriu o chamado
    equipamento_id INT NOT NULL,                     -- equipamento com problema
    tecnico_id     INT,                              -- técnico responsável (pode ser NULL no início)
    prioridade     ENUM('baixa', 'media', 'alta', 'critica') DEFAULT 'media', -- 'critica' adicionado
    status         ENUM('aberto', 'em_atendimento', 'resolvido', 'cancelado') DEFAULT 'aberto',
    aberto_em      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    resolvido_em   TIMESTAMP NULL,                   -- Novo campo para registrar quando o chamado foi resolvido

    -- Um chamado pertence a um cliente
    CONSTRAINT fk_chamado_cliente   FOREIGN KEY (cliente_id)
        REFERENCES usuarios(id) ON DELETE CASCADE,

    -- Um chamado está vinculado a um equipamento
    CONSTRAINT fk_chamado_equip     FOREIGN KEY (equipamento_id)
        REFERENCES equipamentos(id) ON DELETE CASCADE,

    -- Um chamado pode (ou não) ter um técnico responsável
    CONSTRAINT fk_chamado_tecnico   FOREIGN KEY (tecnico_id)
        REFERENCES usuarios(id) ON DELETE SET NULL
);

-- =============================================
-- 4. HISTÓRICO DE MANUTENÇÃO
-- =============================================
-- Cada registro descreve uma ação realizada pelo técnico
-- em um equipamento, vinculado ao chamado correspondente.
CREATE TABLE historico_manutencao (
    id             INT PRIMARY KEY AUTO_INCREMENT,
    chamado_id     INT NOT NULL,                     -- qual chamado originou o registro
    equipamento_id INT NOT NULL,
    tecnico_id     INT NOT NULL,
    descricao      TEXT NOT NULL,                    -- o que foi feito
    registrado_em  DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_hist_chamado FOREIGN KEY (chamado_id)
        REFERENCES chamados(id) ON DELETE CASCADE,

    CONSTRAINT fk_hist_equip   FOREIGN KEY (equipamento_id)
        REFERENCES equipamentos(id) ON DELETE CASCADE,

    CONSTRAINT fk_hist_tecnico FOREIGN KEY (tecnico_id)
        REFERENCES usuarios(id)
);

-- =============================================
-- VIEW 1: EQUIPAMENTOS OPERACIONAIS
-- =============================================
-- Usada ao abrir um novo chamado.
-- Mostra apenas equipamentos com status 'operacional'
-- (ou seja, que ainda não têm um chamado em andamento).
CREATE VIEW view_equipamentos_operacionais AS
SELECT
    id,
    nome,
    categoria,
    patrimonio,
    descricao
FROM equipamentos
WHERE status = 'operacional';


-- =============================================
-- VIEW 2: PAINEL DO TÉCNICO
-- =============================================
-- Lista os chamados que precisam de atenção:
-- status 'aberto' ou 'em_atendimento'.
-- Inclui nome do solicitante, equipamento e técnico responsável (se já atribuído).
CREATE VIEW view_painel_tecnico AS
SELECT
    c.id              AS chamado_id,
    c.titulo,
    c.prioridade,
    c.status,
    u_cliente.nome    AS solicitante,
    e.nome            AS equipamento,
    e.categoria,
    e.patrimonio,
    u_tec.nome        AS tecnico_responsavel,  -- NULL se ainda não atribuído
    c.aberto_em,
    c.atualizado_em
FROM chamados c
JOIN usuarios     u_cliente ON c.cliente_id     = u_cliente.id
JOIN equipamentos e          ON c.equipamento_id = e.id
LEFT JOIN usuarios u_tec     ON c.tecnico_id     = u_tec.id  -- LEFT JOIN: técnico pode ser NULL
WHERE c.status IN ('aberto', 'em_atendimento')
ORDER BY
    FIELD(c.prioridade, 'critica', 'alta', 'media', 'baixa'),  -- urgentes primeiro
    c.aberto_em ASC;                                 -- mais antigos primeiro (mesma prioridade)


-- =============================================
-- VIEW 3: RESUMO DO ADMINISTRADOR
-- =============================================

-- 3a. Total de chamados agrupados por status
CREATE VIEW view_resumo_chamados AS
SELECT
    status,
    COUNT(*) AS total
FROM chamados
GROUP BY status;

-- 3b. Total de equipamentos agrupados por status operacional
CREATE VIEW view_resumo_equipamentos AS
SELECT
    status,
    COUNT(*) AS total
FROM equipamentos
GROUP BY status;

-- Opcional: Adicionar índices para melhorar a performance de consultas
CREATE INDEX idx_chamados_status ON chamados(status);
CREATE INDEX idx_chamados_prioridade ON chamados(prioridade);

-- =============================================
-- TECHRENT - DADOS INICIAIS (SEED)
-- =============================================
-- Este script insere dados de exemplo no banco de dados techrent_db.
-- Ideal para popular o sistema para testes e demonstrações.
--
-- INSTRUÇÕES:
-- 1. Certifique-se de que o banco de dados 'techrent_db' e todas as tabelas
--    (usuarios, equipamentos, chamados, historico_manutencao) já foram criados
--    usando o script 'schema_completo_atualizado.sql'.
-- 2. Execute este script no seu MySQL Workbench ou terminal.
-- =============================================

USE techrent_db;

-- Senha para todos os usuários: 123456 (hash bcrypt)
SET @senha_hash = 
'$2b$12$eK21PJkPnUqG5hs7X7unb.9ZwCwcGot.vri9S2v.F64IP9vMFMI6q';

-- 1. Inserir Usuários de Exemplo
INSERT INTO usuarios (nome, email, senha, nivel_acesso) VALUES
('Admin Geral', 'admin@techrent.com', @senha_hash, 'admin'),
('Alice Técnica', 'alice@techrent.com', @senha_hash, 'tecnico'),
('Bob Cliente', 'bob@techrent.com', @senha_hash, 'cliente'),
('Carlos Cliente', 'carlos@techrent.com', @senha_hash, 'cliente');

-- 2. Inserir Equipamentos de Exemplo
INSERT INTO equipamentos (nome, categoria, patrimonio, status, descricao) VALUES
('Notebook Dell XPS 15', 'Notebook', 'NTB-001', 'operacional', 'Notebook de alta performance para desenvolvimento.'),
('Projetor Epson PowerLite', 'Projetor', 'PRJ-002', 'operacional', 'Projetor para salas de reunião.'),
('Impressora HP LaserJet', 'Impressora', 'IMP-003', 'operacional', 'Impressora a laser monocromática.'),
('Servidor Dell PowerEdge', 'Servidor', 'SRV-004', 'operacional', 'Servidor para aplicações internas.'),
('Monitor LG Ultrawide', 'Monitor', 'MON-005', 'operacional', 'Monitor ultrawide para estação de trabalho.'),
('Notebook Lenovo ThinkPad', 'Notebook', 'NTB-006', 'em_manutencao', 'Notebook com problema na bateria.'),
('Impressora Brother Multifuncional', 'Impressora', 'IMP-007', 'desativado', 'Impressora antiga, desativada para descarte.');

-- 3. Inserir Chamados de Exemplo
-- IDs dos usuários e equipamentos serão obtidos dinamicamente
SET @admin_id = (SELECT id FROM usuarios WHERE email = 'admin@techrent.com');
SET @alice_id = (SELECT id FROM usuarios WHERE email = 'alice@techrent.com');
SET @bob_id = (SELECT id FROM usuarios WHERE email = 'bob@techrent.com');
SET @carlos_id = (SELECT id FROM usuarios WHERE email = 'carlos@techrent.com');

SET @ntb_dell_id = (SELECT id FROM equipamentos WHERE patrimonio = 'NTB-001');
SET @prj_epson_id = (SELECT id FROM equipamentos WHERE patrimonio = 'PRJ-002');
SET @imp_hp_id = (SELECT id FROM equipamentos WHERE patrimonio = 'IMP-003');
SET @srv_dell_id = (SELECT id FROM equipamentos WHERE patrimonio = 'SRV-004');
SET @ntb_lenovo_id = (SELECT id FROM equipamentos WHERE patrimonio = 'NTB-006');

INSERT INTO chamados (titulo, descricao, cliente_id, equipamento_id, tecnico_id, prioridade, status, aberto_em, resolvido_em) VALUES
('Monitor não liga', 'O monitor do Notebook Dell XPS 15 não está ligando após atualização de driver.', @bob_id, @ntb_dell_id, NULL, 'alta', 'aberto', NOW() - INTERVAL 2 DAY, NULL),
('Projetor com imagem distorcida', 'A imagem do projetor Epson está com cores estranhas e distorcidas.', @carlos_id, @prj_epson_id, @alice_id, 'media', 'em_atendimento', NOW() - INTERVAL 1 DAY, NULL),
('Impressora não imprime', 'A impressora HP LaserJet não está respondendo aos comandos de impressão.', @bob_id, @imp_hp_id, NULL, 'critica', 'aberto', NOW() - INTERVAL 3 HOUR, NULL),
('Servidor lento', 'O servidor Dell PowerEdge está apresentando lentidão excessiva nas últimas horas.', @admin_id, @srv_dell_id, @alice_id, 'media', 'resolvido', NOW() - INTERVAL 5 DAY, NOW() - INTERVAL 4 DAY),
('Notebook Lenovo com bateria viciada', 'A bateria do Notebook Lenovo não segura carga por mais de 30 minutos.', @carlos_id, @ntb_lenovo_id, NULL, 'baixa', 'aberto', NOW() - INTERVAL 1 WEEK, NULL);

-- 4. Inserir Histórico de Manutenção (para chamados resolvidos/em atendimento)
INSERT INTO historico_manutencao (chamado_id, equipamento_id, tecnico_id, descricao, registrado_em) VALUES
((SELECT id FROM chamados WHERE titulo = 'Servidor lento'), @srv_dell_id, @alice_id, 'Realizado diagnóstico e otimização de banco de dados. Servidor voltou ao normal.', NOW() - INTERVAL 4 DAY),
((SELECT id FROM chamados WHERE titulo = 'Projetor com imagem distorcida'), @prj_epson_id, @alice_id, 'Verificado cabo HDMI e atualizado firmware do projetor. Problema persiste, aguardando peça.', NOW() - INTERVAL 10 HOUR);

-- Opcional: Selecionar dados para verificar a inserção
-- SELECT * FROM usuarios;
-- SELECT * FROM equipamentos;
-- SELECT * FROM chamados;
-- SELECT * FROM historico_manutencao;

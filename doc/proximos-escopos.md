# R20 NOC — Próximos Escopos

**Base:** protótipo Sprint 01 (Dias 1–7) já entregue — Dashboard, Mapa (4 tipos), Cadastro OLT/PON/CTO/Cliente, Detalhes, Monitoramento simulado.

**Objetivo deste arquivo:** listar **somente o que ainda falta** em relação à visão completa do cliente (14 módulos + Fase 1–3), organizado em **sprints de 7 dias**.

**Princípio:** evoluir sem reescrever o front; plugar telemetria, regras e módulos novos sobre a arquitetura atual (Firebase + React).

---

## Já entregue (não repetir)

- Auth e-mail/senha + layout NOC + menu
- Dashboard com KPIs da sprint + extras (rompimentos, CTOs lotadas, PPPoE, alarmes, SLA)
- Mapa: Cliente, CTO, OLT, POP + cores + filtros + deep link
- CRUD OLT / PON / CTO / Cliente + lotação 🟢🟡🔴 + sugestão de CTO
- Detalhe CTO / Cliente (campos da sprint)
- Monitoramento AO VIVO (offline, oscilação, potência) + simulador + contratos de integração
- Polish / script de demo / documentação da Sprint 01

---

## Visão das sprints futuras

| Sprint | Nome | Foco | Prazo |
|--------|------|------|-------|
| 02 | Tempo real operacional | Mikrotik + status real + Rules | 7 dias |
| 03 | OLT ZTE + eventos ricos | Telemetria óptica + feed | 7 dias |
| 04 | Mapa avançado | Camadas de rede no mapa | 7 dias |
| 05 | Gestão de CTO completa | Fotos, reserva, docs | 7 dias |
| 06 | Chamados NOC | CRUD tickets + fluxo | 7 dias |
| 07 | Documentação de rede (base) | Ativos extras + arquivos | 7 dias |
| 08 | Ordens de Serviço | OS web + checklist | 7 dias |
| 09 | App técnico MVP | Mobile leitura + OS | 7 dias |
| 10 | Integrações e alertas | SGP/Telegram/E-mail | 7 dias |
| 11 | Segurança e perfis | 2FA, auditoria, roles | 7 dias |
| 12 | OTDR Inteligente (MVP) | Cadastro + gráfico | 7 dias |
| 13 | Engenharia | Cobertura / penetração | 7 dias |
| 14 | Relatórios e exportação | PDF / Excel / dashboards | 7 dias |
| 15 | Painel financeiro (base) | MRR / churn / inadimplência | 7 dias |
| 16 | IA operacional (MVP) | Consultas sobre a rede | 7 dias |

> **Fase 1 (MVP 60–90 dias)** ≈ Sprints 02–10.  
> **Fase 2** ≈ Sprints 11–13 (+ aprofundar 07/08/12).  
> **Fase 3** ≈ Sprints 14–16.

---

# Sprint 02 — Tempo real operacional (Mikrotik)

**Objetivo:** clientes online/offline de verdade no Dashboard, Mapa e Monitoramento.

### Dia 1
- [ ] Adapter `IRadiusAdapter` / Mikrotik API (PPP / active sessions)
- [ ] Credenciais e config segura (env / Secret Manager)
- [ ] Job ou Cloud Function de sync (ou polling autenticado)

### Dia 2
- [ ] Normalizar sessão → `NetworkEvent` + update `clients.status`
- [ ] Publicar em `events` (client_offline / client_online)
- [ ] Atualizar `metrics/noc` a partir dos dados reais (online/offline)

### Dia 3
- [ ] Dashboard: KPIs online/offline derivados da sync (não só seed)
- [ ] Mapa: cor do marcador reflete status Mikrotik
- [ ] Listagem de clientes: badge coerente

### Dia 4
- [ ] Monitoramento: eventos reais no feed
- [ ] Filtro “só offline agora”
- [ ] Remover dependência da demo automática em ambiente “produção demo”

### Dia 5
- [ ] Latência / última sessão (se API permitir) em detalhe do cliente
- [ ] Tratamento de falha da API (fallback + alerta no painel)

### Dia 6
- [ ] Firestore Rules: leitura autenticada; escrita de telemetria só service account
- [ ] Logs de sync + página Configurações (status da integração)

### Dia 7
- [ ] QA ponta a ponta Mikrotik → UI
- [ ] Doc de operação + seed “modo híbrido” (real + fictício)

**Critério de aceite:** desconectar um PPPoE e ver offline no Dashboard/Mapa/Monitoramento em &lt; 1–2 min.

---

# Sprint 03 — OLT ZTE + eventos ópticos

**Objetivo:** potência e ONU a partir da OLT; enriquecer o feed.

### Dia 1
- [ ] `IOltVendorAdapter` implementação ZTE (API/SNMP básico)
- [ ] Inventário ONU ↔ cliente (serial/MAC)

### Dia 2
- [ ] Leitura de potência óptica → `clients.powerDbm`
- [ ] Eventos `power_alert` quando &lt; −26 dBm

### Dia 3
- [ ] Oscilação / reboot ONU se telemetria permitir
- [ ] Cards Dashboard: sinal ruim e alarmes com dados reais

### Dia 4
- [ ] Detalhe Cliente: potência e último acesso reais
- [ ] Detalhe CTO: potência média real dos clientes

### Dia 5
- [ ] Histórico de sinal (série temporal simples em Firestore ou Timescale depois)
- [ ] Sparkline com dados reais (substituir fake)

### Dia 6
- [ ] Multi-vendor stub Huawei/Fiberhome (interface + 1 mock)
- [ ] Doc `integracoes-telemetria.md` atualizado

### Dia 7
- [ ] QA + alertas Telegram stub (opcional)
- [ ] Entrega demo “rede viva”

**Critério de aceite:** cliente com potência ruim aparece no KPI e no monitoramento sem simulador.

---

# Sprint 04 — Mapa avançado (camadas)

**Objetivo:** aproximar o Mapa Inteligente da visão completa (ainda sem DWG/Shapefile pesado).

### Dia 1
- [ ] Modelo `networkAssets` (poste, splitter, cabo, backbone, DIO, caixa subterrânea, empresa)
- [ ] CRUD mínimo + lat/lng

### Dia 2
- [ ] Camadas no mapa (toggle) — postes, cabo, backbone, splitter
- [ ] Legenda expandida

### Dia 3
- [ ] Desenho de linha (cabo/backbone) no Leaflet
- [ ] Popup resumido por tipo

### Dia 4
- [ ] Clusterização de clientes/CTOs
- [ ] Performance com 1k+ pontos

### Dia 5
- [ ] Import GeoJSON / KML básico
- [ ] Export GeoJSON dos ativos

### Dia 6
- [ ] Filtros avançados (por PON, por status, por camada)
- [ ] Deep link para asset genérico

### Dia 7
- [ ] QA mobile do mapa
- [ ] Camadas futuras restantes (empresas, DIO) se der tempo

**Critério de aceite:** operador liga/desliga cabo + postes + CTOs e navega com fluidez.

---

# Sprint 05 — Gestão de CTO completa

**Objetivo:** fechar o Módulo 7 além do já existente.

### Dia 1
- [ ] Firebase Storage (Blaze) + upload de fotos CTO
- [ ] Galeria no detalhe da CTO

### Dia 2
- [ ] Reserva técnica (portas reservadas vs ocupadas)
- [ ] Regras de ocupação atualizadas na UI

### Dia 3
- [ ] Documentação anexada (PDF) na CTO
- [ ] Histórico de alterações da CTO (audit simples)

### Dia 4
- [ ] Sugestão de CTO aprimorada (mesma PON + distância + reserva)
- [ ] Tela “todas as CTOs” com mapa embutido opcional

### Dia 5
- [ ] Fotos no Cliente (instalação)
- [ ] Placeholders OS/chamados viram links reais (se Sprint 06 pronta em paralelo — senão stubs)

### Dia 6
- [ ] Relatório rápido de lotação (PDF simples ou print)

### Dia 7
- [ ] QA + permissões de upload por role

**Critério de aceite:** CTO com fotos, reserva e sugestão utilizável na operação.

---

# Sprint 06 — Chamados NOC

**Objetivo:** sair do placeholder `/chamados`.

### Dia 1
- [ ] Modelo `tickets` completo (prioridade, status, ativo, técnico, SLA)
- [ ] CRUD listagem + detalhe

### Dia 2
- [ ] Abrir chamado a partir do Cliente / CTO / Evento
- [ ] Deep links

### Dia 3
- [ ] Workflow: aberto → em andamento → resolvido → fechado
- [ ] Dashboard: card Chamados com contagem real

### Dia 4
- [ ] Filtros (status, prioridade, técnico, período)
- [ ] Comentários / timeline do chamado

### Dia 5
- [ ] Notificação stub (e-mail ou Telegram) ao criar/atribuir
- [ ] SLA do dia ligado a tickets

### Dia 6
- [ ] Relatório simples de chamados
- [ ] Mobile usável

### Dia 7
- [ ] QA fluxo completo evento → chamado → resolução

**Critério de aceite:** NOC abre chamado a partir de um offline e fecha com histórico.

---

# Sprint 07 — Documentação da Rede (base)

**Objetivo:** início do Módulo 3 (cadastro completo + arquivos).

### Dia 1
- [ ] Cadastros: VLAN, Splitter, DIO, Backbone, Emenda/Fusão (CRUD)
- [ ] Associação à hierarquia existente

### Dia 2
- [ ] Cor da fibra, tubulação, reserva técnica (campos)
- [ ] Listagens + busca

### Dia 3
- [ ] Upload PDF / foto / vídeo (Storage)
- [ ] Viewer básico de PDF

### Dia 4
- [ ] Upload KMZ/KML → preview no mapa
- [ ] Limite de tamanho e validação

### Dia 5
- [ ] Metadados e pastas por ativo
- [ ] Permissões por perfil

### Dia 6
- [ ] DWG: upload + download (viewer completo depois)
- [ ] Índice de documentação

### Dia 7
- [ ] QA + doc de uso para equipe de campo/engenharia

**Critério de aceite:** anexar KMZ/PDF a uma CTO/backbone e abrir no sistema.

---

# Sprint 08 — Ordens de Serviço (web)

**Objetivo:** Módulo 9 na web (app fica na Sprint 09).

### Dia 1
- [ ] Tipos: instalação, mudança, retirada, troca ONU/CTO, manutenção
- [ ] CRUD + status

### Dia 2
- [ ] Checklist configurável por tipo
- [ ] Fotos obrigatórias

### Dia 3
- [ ] Assinatura digital (canvas)
- [ ] Geolocalização no fechamento

### Dia 4
- [ ] Atribuição a técnico
- [ ] Agenda do dia

### Dia 5
- [ ] Vínculo Cliente/CTO/Chamado
- [ ] Notificações

### Dia 6
- [ ] Relatório de OS concluídas
- [ ] Mobile web responsivo

### Dia 7
- [ ] QA ponta a ponta instalação

**Critério de aceite:** técnico fecha OS no browser com checklist + foto + GPS.

---

# Sprint 09 — App técnico MVP

**Objetivo:** Módulo 10 básico (Android/iOS).

### Dia 1
- [ ] Escolha RN ou Flutter + setup + Auth Firebase
- [ ] Login e lista de OS do técnico

### Dia 2
- [ ] Detalhe OS + checklist + fotos
- [ ] Modo offline (fila local)

### Dia 3
- [ ] Mapa + navegação (deep link Google/Waze)
- [ ] QR Code (ler serial ONU)

### Dia 4
- [ ] Leitura potência (manual ou via API se existir)
- [ ] Abrir/fechar chamado

### Dia 5
- [ ] Sync offline → online
- [ ] Push notification básica

### Dia 6
- [ ] Build interno (TestFlight / Play internal)
- [ ] Hardening UX campo

### Dia 7
- [ ] QA com 2–3 técnicos piloto

**Critério de aceite:** técnico conclui 1 OS no app com rede instável.

---

# Sprint 10 — Integrações e alertas (SGP / canais)

**Objetivo:** Módulo 6 parcial — canais + SGP/IXC leve.

### Dia 1
- [ ] `INotificationChannel`: Telegram + E-mail
- [ ] Templates de alerta (offline, potência, chamado)

### Dia 2
- [ ] WhatsApp (API oficial ou provedor) — se viável; senão stub documentado
- [ ] Preferências de notificação por usuário

### Dia 3
- [ ] Integração SGP/IXC: sync clientes/planos (leitura)
- [ ] Mapeamento IDs externos

### Dia 4
- [ ] Webhooks inbound (evento externo → `events`)
- [ ] Painel de saúde das integrações

### Dia 5
- [ ] Rate limit / retry / dead letter
- [ ] Auditoria de envios

### Dia 6
- [ ] QA com canais reais de homologação
- [ ] Runbook operacional

### Dia 7
- [ ] Entrega Fase 1 consolidada (demo executiva)

**Critério de aceite:** offline crítico gera Telegram + ticket opcional; clientes SGP refletem no cadastro.

---

# Sprint 11 — Segurança e perfis

**Objetivo:** Módulo 12.

### Dia 1
- [ ] Roles: admin, noc, tecnico, financeiro, comercial
- [ ] Rules Firestore por collection/ação

### Dia 2
- [ ] 2FA (Firebase / TOTP)
- [ ] Sessão e timeout

### Dia 3
- [ ] Logs de auditoria (quem alterou o quê)
- [ ] Histórico de alterações em ativos críticos

### Dia 4
- [ ] Backup automático Firestore (export agendado)
- [ ] Restore documentado

### Dia 5
- [ ] Tela Configurações: usuários e permissões
- [ ] Convite de usuário

### Dia 6
- [ ] Penetration checklist básico
- [ ] Secrets fora do client

### Dia 7
- [ ] QA de matriz de permissões

**Critério de aceite:** técnico não apaga OLT; admin audita alterações.

---

# Sprint 12 — OTDR Inteligente (MVP)

**Objetivo:** Módulo 4 diferencial (MVP).

### Dia 1
- [ ] Modelo OTDR: traçado, eventos, emenda, splitter, conector, perda, reflexão, distância
- [ ] CRUD + upload de arquivo bruto (se houver)

### Dia 2
- [ ] Parser básico / entrada manual de pontos
- [ ] Associação a cabo/CTO/backbone

### Dia 3
- [ ] Gráfico automático (Canvas/SVG)
- [ ] Zoom e marcadores de evento

### Dia 4
- [ ] Histórico de testes por trecho
- [ ] Comparação teste antigo × novo

### Dia 5
- [ ] Alerta de aumento de atenuação
- [ ] Evento no monitoramento

### Dia 6
- [ ] Relatório PDF do OTDR
- [ ] Mobile view

### Dia 7
- [ ] QA com dados reais de campo (amostra R20)

**Critério de aceite:** comparar 2 OTDRs e alertar atenuação acima do limiar.

---

# Sprint 13 — Engenharia de rede

**Objetivo:** Módulo 8.

### Dia 1
- [ ] Projetos futuros / expansão (CRUD)
- [ ] Áreas no mapa (polígonos)

### Dia 2
- [ ] Casas vs clientes (penetração)
- [ ] Área saturada × disponível

### Dia 3
- [ ] Distância da fibra e custo estimado por expansão
- [ ] Dashboard de engenharia

### Dia 4
- [ ] Mapa de cobertura
- [ ] Export para planejamento

### Dia 5
- [ ] Integração com sugestão de CTO / PON
- [ ] Priorização de obras

### Dia 6–7
- [ ] QA + apresentação para time de engenharia

**Critério de aceite:** mapa mostra penetração por bairro/área e custo estimado de expansão.

---

# Sprint 14 — Relatórios e exportação

**Objetivo:** Módulo 14.

### Dia 1
- [ ] Relatórios: clientes, CTO, OLT, PON, ONU, sinal
- [ ] Filtros de período

### Dia 2
- [ ] Relatórios: OTDR, chamados, disponibilidade, SLA
- [ ] Agendamento

### Dia 3
- [ ] Export PDF
- [ ] Export Excel

### Dia 4
- [ ] Conector Power BI / BigQuery (ou CSV agendado)
- [ ] Mapa em relatório (print/export)

### Dia 5
- [ ] Financeiro (se Sprint 15 ainda não: stubs)
- [ ] Biblioteca de templates

### Dia 6–7
- [ ] QA + permissões de relatório

**Critério de aceite:** gerar PDF de disponibilidade/SLA e Excel de clientes offline.

---

# Sprint 15 — Painel financeiro (base)

**Objetivo:** Módulo 13 (base; integração billing depois).

### Dia 1
- [ ] Modelo: mensalidade, inadimplência, instalações, cancelamentos
- [ ] Import CSV ou sync SGP

### Dia 2
- [ ] KPIs: receita, MRR, churn, ticket médio, novos clientes
- [ ] Dashboard financeiro

### Dia 3
- [ ] Mapa financeiro (ARPU / inadimplência por área)
- [ ] Filtros

### Dia 4
- [ ] Vínculo leve com churn técnico (offline crônico)
- [ ] Alertas comerciais

### Dia 5–7
- [ ] QA + papéis financeiro/comercial
- [ ] Doc de limites (não substitui ERP)

**Critério de aceite:** gestor vê MRR/churn e mapa de inadimplência sem sair do NOC.

---

# Sprint 16 — IA operacional (MVP)

**Objetivo:** Módulo 11 (consultas sobre dados já existentes).

### Dia 1
- [ ] Camada de tools/queries sobre Firestore (CTO lotada, sinal &lt; −26, offline 24h)
- [ ] Prompt system + guardrails

### Dia 2
- [ ] Chat no painel (“pergunte à rede”)
- [ ] Respostas com links para ativos

### Dia 3
- [ ] Sugestões: troca splitter/ONU, balanceamento PON, expansão
- [ ] Log de perguntas

### Dia 4
- [ ] “Qual técnico resolve mais rápido?” (se OS/chamados existirem)
- [ ] “Qual cabo com mais rompimentos?”

### Dia 5
- [ ] Avaliação de qualidade das respostas
- [ ] Limites de custo/token

### Dia 6–7
- [ ] QA + demo executiva Fase 3 inicial

**Critério de aceite:** 5 perguntas do briefing do cliente respondidas com dados reais do sistema.

---

## Backlog transversal (encaixar quando couber)

- [ ] Consumo da rede / upload / download / Links (Dashboard Módulo 1) — depende de SNMP/NetFlow
- [ ] Ataques, loop, broadcast, cliente infectado, ping/jitter/perda (Monitoramento)
- [ ] Vendors restantes: Huawei, Fiberhome, Nokia, Datacom, Cisco, Juniper (além de ZTE/Mikrotik)
- [ ] Hubsoft / Radius Manager parity connectors
- [ ] Shapefile / DWG viewer completo
- [ ] MQTT bridge de telemetria
- [ ] Migração opcional PostgreSQL+PostGIS / Timescale (se escala exigir)
- [ ] Kubernetes / Prometheus / Grafana da própria plataforma

---

## Como usar este arquivo

1. Ao fechar uma sprint, marcar checkboxes e criar um `CHECKLIST-YYYY-MM-DD.md` da sessão.
2. Não misturar escopo de 2 sprints na mesma entrega ao cliente.
3. Sempre demonstrar valor no Dia 7 da sprint (demo curta).
4. Manter `documentation.md` e este arquivo sincronizados na seção “próximos passos”.

---

## Resumo executivo para o cliente

| Já tem (Sprint 01) | Próximo valor (Sprints 02–10 = Fase 1) | Depois (Fases 2–3) |
|--------------------|----------------------------------------|---------------------|
| Dashboard, Mapa base, Cadastro, Detalhes, Monitoramento simulado | Mikrotik/ZTE reais, mapa avançado, fotos CTO, chamados, docs base, OS, app técnico, alertas/SGP | Segurança avançada, OTDR, engenharia, relatórios, financeiro, IA |

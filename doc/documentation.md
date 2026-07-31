# R20 NOC — Documentação do Projeto

## 1. Visão Geral

**Produto:** R20 NOC — Plataforma Inteligente para Provedores FTTH  
**Cliente:** R20 Telecom  
**Objetivo:** Plataforma WEB responsiva para gestão operacional técnica de provedores de internet FTTH, com foco em rede, mapa, clientes, equipamentos, documentação e monitoramento.

A visão de longo prazo é competir com soluções como IXC, Hubsoft, Sonic, Radius Manager e The Dude, porém com **ênfase na operação técnica (NOC)**, não apenas no ERP/financeiro.

**Status da Sprint 01 (7 dias):** protótipo entregue e navegável — Dashboard, Mapa, Cadastros, Detalhes e Monitoramento AO VIVO (dados simulados + Firebase).

---

## 2. O que o cliente realmente deseja

### 2.1 Problema de negócio
Operar uma rede FTTH exige visibilidade imediata de:
- quem está online/offline
- onde está o problema (CTO, PON, OLT, cabo)
- capacidade e lotação das caixas
- histórico técnico (sinal, OTDR, fotos, documentação)
- ação rápida do técnico em campo

### 2.2 Produto desejado (visão completa — 14 módulos)

| Módulo | Nome | Valor para o cliente |
|--------|------|----------------------|
| 1 | Dashboard NOC | Visão em tempo real da saúde da rede |
| 2 | Mapa Inteligente | Geolocalização de toda a infraestrutura |
| 3 | Documentação da Rede | Cadastro completo de ativos + arquivos (KMZ, DWG, fotos) |
| 4 | OTDR Inteligente | Diferencial: gráficos, comparação e alertas de atenuação |
| 5 | Monitoramento | Eventos operacionais em tempo real |
| 6 | Integrações | ZTE, Huawei, Mikrotik, Radius, SGP, IXC, etc. |
| 7 | Gestão de CTO | Ocupação, cores e sugestão automática de caixa |
| 8 | Engenharia | Expansão, penetração e custo |
| 9 | Ordem de Serviço | Instalação, manutenção, checklist, GPS |
| 10 | App Técnico | Android/iOS offline |
| 11 | Inteligência Artificial | Consultas e sugestões operacionais |
| 12 | Segurança | Perfis, 2FA, auditoria |
| 13 | Painel Financeiro | MRR, churn, inadimplência |
| 14 | Relatórios | PDF, Excel, Power BI |

### 2.3 Escopo da Sprint (Protótipo — 7 dias)
O cliente enviou uma sprint explícita de 7 etapas. Essa sprint **não entrega a plataforma completa**; entrega um **MVP visual e navegável** com dados simulados, capaz de demonstrar valor e validar a arquitetura.

**Entregável dos 7 dias:** protótipo web responsivo com Dashboard, Mapa, Cadastros, Detalhes de ativos e Monitoramento inicial — base sólida para as próximas fases.

---

## 3. O que foi entregue de fato (Sprint 01)

| Área | Entrega |
|------|---------|
| Auth | Login e-mail/senha (Firebase Auth) + rotas protegidas + stub de roles |
| Layout | Sidebar responsiva, topbar, breadcrumbs, versão `v0.1.0-sprint1` |
| Dashboard | 6 KPIs + 5 operação, listener `metrics/noc`, últimos eventos, atalhos |
| Mapa | Leaflet · Cliente/CTO/OLT/POP · filtros · deep link `?type=&id=` |
| Cadastro | CRUD OLT/PON/CTO/Cliente · Zod · exclusão com vínculos · lotação |
| Detalhes | CTO e Cliente com hierarquia, OccupancyBar, PowerIndicator |
| Monitoramento | Feed AO VIVO · filtros · reconhecer · simulador UI + CLI |
| Seed | 2 POPs · 4 OLTs · 10 PONs · 20 CTOs · 50 clientes · eventos |
| Arquitetura | Repositórios + contratos `infra/integrations/` (SNMP/OLT/RADIUS) |
| Hosting | Firebase Hosting — `https://rogerio-48623.web.app` |

Credenciais de demo (uso interno / apresentação): ver `web/README.md` e botão **Criar usuário demo** no login. Não versionar senhas em canais públicos além do README de setup.

---

## 4. Estratégia de entrega

### Princípio
Maximizar **valor perceptível** nos primeiros 7 dias (telas que o cliente abre e “sente” o produto), sem travar a evolução futura.

### Fases do produto

| Fase | Prazo estimado | Foco |
|------|----------------|------|
| **Fase 0 — Protótipo (esta sprint)** | 7 dias | UI + Firebase + dados simulados + fluxo Dashboard → Mapa → Cadastros → Monitoramento |
| **Fase 1 — MVP operacional** | +60 a 90 dias | Tempo real, integrações Mikrotik/ZTE/SGP, app técnico básico |
| **Fase 2 — Rede avançada** | seguinte | Engenharia, OTDR, OS, documentação completa, estoque |
| **Fase 3 — Inteligência** | seguinte | IA, previsão de falhas, balanceamento, dashboards executivos |

### Próximos 30 dias (priorizado)

1. Integração Mikrotik (online/offline real via API/PPP)
2. Integração OLT ZTE (leitura básica de ONU/status)
3. Roles e Security Rules no Firestore (endurecer além de `auth != null`)
4. Upload de fotos em CTO/Cliente (Storage — plano Blaze)
5. Chamados (CRUD simples ligado a cliente/CTO)
6. Camadas extras no mapa (cabo / backbone)

### Proposta Fase 1 (60–90 dias) — alinhada aos 14 módulos

Foco: transformar o protótipo em **MVP operacional** sem reescrever o front.

- Telemetria real (Mikrotik + OLT ZTE) alimentando `events` e status de clientes
- Security Rules por papel (`admin` / `noc` / `tecnico`)
- Módulo Chamados (CRUD + vínculo a ativo)
- Upload de fotos/docs em CTO e Cliente
- Camadas de cabo/backbone no mapa
- App técnico básico (React Native ou Flutter) — leitura + OS simples
- Observabilidade (Performance + Sentry)

Módulos 4, 8, 11, 13 ficam para Fases 2–3.

---

## 5. Stack tecnológica (definida)

> Decisão do time: **Firebase** (não Supabase).

| Camada | Tecnologia |
|--------|------------|
| Frontend | React + TypeScript + Vite |
| UI | Tailwind CSS + componentes próprios (layout NOC) |
| Backend / BaaS | Firebase (Auth, Firestore, Storage, Cloud Functions) |
| Tempo real | Firestore listeners + (futuro) Cloud Functions / MQTT bridge |
| Mapas | Leaflet + OpenStreetMap (Mapbox opcional depois) |
| Geo | Coordenadas no Firestore + GeoJSON no cliente |
| Estado | Hooks + listeners Firestore (React Query/Zustand se necessário depois) |
| Deploy | Firebase Hosting |
| Observabilidade (futuro) | Firebase Performance + Sentry |

### Por que Firebase neste projeto
- Auth + perfis (Admin, NOC, Técnico) de forma rápida
- Firestore com listeners nativos para dashboard “ao vivo”
- Storage para fotos, PDFs, KMZ/KML
- Cloud Functions para futuras integrações SNMP/API/Telegram
- Hosting simples para o protótipo
- Escala gradual sem reescrever o front

### Modelo de dados inicial (Firestore)

```
users/
olts/
pons/          (oltId)
ctos/          (oltId, ponId)
clients/       (ctoId, oltId, ponId)
events/        (tipo, severidade, ativoId, timestamp)
tickets/       (chamados — estrutura inicial)
metrics/noc    (KPIs do dashboard)
```

Campos geográficos (`lat`, `lng`) em CTO, Cliente, OLT e POP para o mapa.

---

## 6. Hierarquia da rede FTTH (domínio)

```
POP / Site
  └── OLT
        └── PON
              └── CTO (caixa)
                    └── Porta / Splitter
                          └── Cliente (ONU)
```

Associações mínimas no protótipo:
- OLT → várias PONs
- PON → várias CTOs
- CTO → vários Clientes
- Status por cor: Verde (online) · Amarelo (alerta) · Vermelho (offline) · Cinza (desativado)

---

## 7. Critérios de sucesso do protótipo (Dia 7)

- [x] Layout admin responsivo com menu lateral dos módulos principais
- [x] Dashboard NOC com cards de KPIs (dados simulados / seed Firebase)
- [x] Mapa com marcadores de Clientes, CTOs, OLTs e POPs coloridos por status
- [x] CRUD/listagem de OLT, PON, CTO e Cliente com associações
- [x] Tela de detalhes de CTO e Cliente
- [x] Tela de monitoramento com eventos simulados
- [x] Navegação coerente entre Dashboard ↔ Mapa ↔ Cadastros ↔ Detalhes
- [x] Documentação e seed de dados para demonstração ao cliente
- [x] Deploy em Firebase Hosting (recomendado)

---

## 8. Escopo entregue vs. fora do escopo

### Entregue (Sprint 01)
- Dashboard NOC ao vivo (seed)
- Mapa Inteligente com 4 tipos de ativos
- Cadastro de Rede completo (4 entidades)
- Detalhamento CTO / Cliente
- Monitoramento AO VIVO + simulador
- Contratos de integração (tomada arquitetural)

### Fora do escopo dos 7 dias (explícito)

- Integrações reais (ZTE, Huawei, Mikrotik, Radius, SGP, IXC)
- OTDR inteligente com gráfico real
- App mobile Android/iOS
- Módulo financeiro / MRR / churn
- IA conversacional
- SNMP/MQTT em produção
- Engenharia de expansão e cobertura
- Ordens de serviço completas com assinatura
- 2FA e auditoria avançada
- Importação DWG / Shapefile
- Clusterização de marcadores · Cloud Functions agendadas · Storage/upload

Esses itens entram nas Fases 1–3 e devem constar na proposta comercial como roadmap.

---

## 9. Estrutura de pastas do plano

```
doc/
├── documentation.md              ← este arquivo
├── script-demo.md                ← roteiro 5–8 min
├── dia-01-estrutura-inicial.md
├── dia-02-dashboard-operacional.md
├── dia-03-mapa-inteligente.md
├── dia-04-cadastro-de-rede.md
├── dia-05-detalhamento-ativos.md
├── dia-06-monitoramento-inicial.md
├── dia-07-refinamentos-entrega.md
└── integracoes-telemetria.md
```

---

## 10. Riscos e mitigações

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Escopo completo confundido com sprint | Expectativa irreal | Documentar “protótipo vs produto” na entrega |
| Dados geográficos sem PostGIS | Limite de queries geo | Leaflet + filtros no cliente no MVP; Geo queries depois |
| Tempo real sem equipamentos | Demo fraca | Seed + simulador de eventos no Firestore |
| UI genérica demais | Baixo “wow” | Visual NOC escuro/operacional, cards claros, mapa em destaque |

---

## 11. Próximos passos após o Dia 7

1. Apresentação do protótipo ao cliente (demo guiada — ver `script-demo.md`)
2. Coleta de feedback e priorização da Fase 1
3. Definição de integrações prioritárias (Mikrotik / OLT ZTE / SGP)
4. Modelagem definitiva de segurança (Rules + roles)
5. Planejamento de app técnico (React Native / Flutter)

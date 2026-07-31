# R20 NOC — Estimativa Completa por Sprints (7 dias)

## 1. Objetivo deste documento

Organizar o **sistema completo** solicitado pelo cliente em sprints de **7 dias úteis**, com tópicos de implementação e descrição de cada item.

Inclui:
- a **Sprint 01** (protótipo) já detalhada em `dia-01` … `dia-07`
- todas as sprints seguintes até cobrir os **14 módulos** da visão do produto

**Stack assumida:** React + TypeScript, Firebase (Auth, Firestore, Storage, Cloud Functions, Hosting), Leaflet/OSM, app mobile (React Native) nas sprints do Módulo 10.

---

## 2. Resumo executivo

| Fase | Sprints | Dias úteis | O que o cliente ganha |
|------|---------|------------|------------------------|
| **Fase 0 — Protótipo** | 01 | 7 | Demo navegável com dados simulados |
| **Fase 1 — MVP Operacional** | 02 → 13 | 84 | Tempo real, mapa avançado, docs, CTO, monitoramento, integrações prioritárias |
| **Fase 2 — Rede Avançada** | 14 → 21 | 56 | OS, app técnico, OTDR, engenharia, estoque |
| **Fase 3 — Inteligência & Fechamento** | 22 → 28 | 49 | Financeiro, relatórios, segurança avançada, IA, hardenização |

| Total | **28 sprints** | **196 dias úteis** | Plataforma completa alinhada ao escopo |

> **Nota comercial:** 196 dias úteis ≈ **9–10 meses** com 1 squad full-time (ou menos com paralelização). A Sprint 01 sozinha já gera valor para validação e fechamento da Fase 1.

### Mapa módulo × sprints

| Módulo | Nome | Sprints principais |
|--------|------|--------------------|
| 1 | Dashboard NOC | 01, 03, 24 |
| 2 | Mapa Inteligente | 01, 04 |
| 3 | Documentação da Rede | 05, 06 |
| 4 | OTDR Inteligente | 18, 19 |
| 5 | Monitoramento | 01, 08, 09 |
| 6 | Integrações | 10 → 13 |
| 7 | Gestão de CTO | 01, 07 |
| 8 | Engenharia | 20 |
| 9 | Ordem de Serviço | 14, 15 |
| 10 | App Técnico | 16, 17 |
| 11 | Inteligência Artificial | 26, 27 |
| 12 | Segurança | 02, 25 |
| 13 | Painel Financeiro | 22 |
| 14 | Relatórios | 23, 24 |
| — | Estoque / Materiais | 21 |
| — | Protótipo base | 01 |
| — | Fechamento / UAT | 28 |

---

## 3. Sprints detalhadas

---

# FASE 0 — PROTÓTIPO

---

## Sprint 01 — Estrutura, Dashboard, Mapa, Cadastro, Detalhes e Monitoramento Inicial

**Duração:** 7 dias  
**Referência:** `doc/dia-01` … `doc/dia-07`  
**Objetivo:** Entregar protótipo web responsivo demonstrável, com Firebase e dados simulados.

### Dia 1 — Estrutura Inicial da Plataforma
| Tópico | Descrição |
|--------|-----------|
| Bootstrap React + TS + Vite | Criar o projeto front, lint, aliases e estrutura por features |
| Firebase (Auth, Firestore, Storage, Hosting) | Configurar projeto, SDK e ambiente |
| Collections e tipos de ativos | Modelar OLT, PON, CTO, Cliente, POP, events, tickets |
| Seed inicial | Popular dados fictícios para demo |
| Auth básica | Login e-mail/senha + rotas protegidas |
| Layout admin responsivo | Sidebar, topbar, conteúdo, drawer mobile |
| Menu lateral | Dashboard, Mapa, Cadastro, Monitoramento + placeholders |
| Shell do Dashboard NOC | Grid de cards skeleton pronto para KPIs |

### Dia 2 — Dashboard Operacional
| Tópico | Descrição |
|--------|-----------|
| Serviço de métricas | Ler/agregar indicadores via Firestore (`metrics/noc`) |
| Listener em tempo real | `onSnapshot` para atualização ao vivo (mesmo com seed) |
| Cards da sprint | Online, Offline, Sinal ruim, OLTs, Chamados, Disponibilidade |
| Cards extras (se der tempo) | Rompimentos, CTOs lotadas, PPPoE, Alarmes, SLA |
| Organização visual | Grid responsivo, seções, últimos eventos, timestamp |
| Abstração de repositório | Preparar troca futura seed → telemetria real |
| Navegação pelos cards | Atalhos para monitoramento, OLTs e mapa |

### Dia 3 — Mapa Inteligente (Protótipo)
| Tópico | Descrição |
|--------|-----------|
| Leaflet + OSM | Mapa base em tela cheia no painel |
| Marcadores | Clientes, CTOs, OLTs, POPs |
| Cores de status | Verde / Amarelo / Vermelho / Cinza |
| Legenda e filtros | Por tipo e por status |
| Popups | Resumo do ativo + link para detalhes |
| Navegação | Pan, zoom, geolocation, enquadrar todos, busca flyTo |
| Camadas futuras (UI) | Postes, cabo, backbone etc. desabilitados |

### Dia 4 — Cadastro de Rede
| Tópico | Descrição |
|--------|-----------|
| CRUD OLT | Nome, vendor, IP, POP, status, coordenadas |
| CRUD PON | Porta/nome ligado à OLT |
| CRUD CTO | Capacidade, portas, splitter, distância, lotação |
| CRUD Cliente | Plano, ONU, potência, IP, equipamento, vínculo CTO |
| Associações de domínio | OLT → PON → CTO → Cliente com regras de exclusão |
| Listagens | Busca, filtros, ações editar/excluir/ver no mapa |
| Validação Zod | Formulários tipados e seguros |

### Dia 5 — Detalhamento dos Ativos
| Tópico | Descrição |
|--------|-----------|
| Detalhe CTO | Capacidade, portas ocupadas/livres, splitter, distância, ocupação |
| Lista de clientes da CTO | Vínculo operacional direto |
| Detalhe Cliente | Nome, plano, ONU, potência, último acesso, IP, equipamento |
| Indicadores visuais | StatusBadge, OccupancyBar, PowerIndicator (limiar -26 dBm) |
| Navegação cruzada | Mapa ↔ Detalhe ↔ Listagem ↔ OLT/PON |
| Seções placeholder | Fotos, histórico, OS, chamados (preparação) |

### Dia 6 — Monitoramento Inicial
| Tópico | Descrição |
|--------|-----------|
| Tela de monitoramento | Feed AO VIVO + filtros + resumo |
| Modelo de eventos | Offline, oscilação, alerta de potência (+ severidade) |
| Simulador de eventos | Script/Function gerando eventos no Firestore |
| Reconhecer alerta | Campo `acknowledged` |
| Contratos de integração | Interfaces SNMP, OLT vendor, Radius, notificações |
| Ligação com Dashboard | Últimos eventos compartilhados |

### Dia 7 — Refinamentos e Entrega
| Tópico | Descrição |
|--------|-----------|
| Polish visual e responsivo | Consistência de UI, skeletons, empty states |
| QA do fluxo completo | Dashboard → Monitoramento → Cliente → Mapa → CTO → Cadastros |
| Deploy Firebase Hosting | URL de demo + usuário seed |
| Materiais de entrega | Roteiro de demo, escopo entregue vs roadmap |
| Base para Fase 1 | Prioridades dos próximos 30 dias documentadas |

**Entregável da Sprint 01:** protótipo demonstrável com valor perceptível alto.

---

# FASE 1 — MVP OPERACIONAL

---

## Sprint 02 — Segurança Base, Perfis e Fundação Operacional

**Objetivo:** Tornar o protótipo seguro e multi-perfil antes de integrar equipamentos reais.

| Tópico | Descrição |
|--------|-----------|
| Perfis de acesso | Admin, NOC, Técnico, Financeiro, Comercial com claims/custom claims |
| Firestore Security Rules | Regras por perfil e por coleção |
| Storage Rules | Upload restrito por papel e pasta |
| Gestão de usuários | Convite, ativar/desativar, trocar perfil |
| Tela de Configurações | Preferências da operadora (nome, área, limiares dBm) |
| Auditoria mínima | Log de login e de alterações críticas |
| Ambientes | Separar `dev` / `staging` / `prod` no Firebase |
| Observabilidade inicial | Sentry + logs estruturados nas Functions |

**Entregável:** sistema multi-usuário com isolamento básico por perfil.

---

## Sprint 03 — Dashboard NOC em Tempo Real (dados reais agregados)

**Objetivo:** Evoluir o Dashboard da simulação para agregação confiável e indicadores completos do Módulo 1.

| Tópico | Descrição |
|--------|-----------|
| Pipeline de agregação | Cloud Functions calculando `metrics/noc` a partir de clients/events |
| Indicadores completos | Rompimentos, CTOs lotadas, Links, Consumo, Upload anormal, Download, PPPoE, Alarmes, SLA |
| Histórico de métricas | Série temporal leve (docs diários/horários no Firestore) |
| Gráficos de tendência | Online/offline e disponibilidade nas últimas 24h |
| Limiares configuráveis | Ex.: sinal ruim < -26 dBm; disponibilidade alvo |
| Drill-down | Clique no card abre lista filtrada real |
| Painel de saúde | Status das coletas (última sync por integração) |

**Entregável:** Dashboard NOC com KPIs alinhados ao escopo completo do módulo, prontos para receber integrações.

---

## Sprint 04 — Mapa Inteligente Avançado

**Objetivo:** Expandir o mapa do protótipo para a visão completa do Módulo 2.

| Tópico | Descrição |
|--------|-----------|
| Camadas de infraestrutura | Postes, CTO, splitters, cabo, backbone, fibras, clientes, empresas, POPs, OLT, DIO, caixas subterrâneas |
| Estilos por camada | Ícones/cores distintos e legenda completa |
| Desenho de cabos/rotas | Polylines GeoJSON (backbone e drops) |
| Importação GeoJSON/KML | Upload e renderização no mapa |
| Popup rico CTO | Clientes, portas, splitter, potência média, distância, atalhos fotos/docs/histórico |
| Popup rico Cliente | Plano, ONU, potência, MAC, serial, IP, OS, chamados |
| Cluster e performance | Agrupamento e carregamento por viewport |
| Modo satélite/ruas | Alternância de tiles (OSM / satélite se disponível) |

**Entregável:** mapa operacional próximo ao “Google Maps da rede”.

---

## Sprint 05 — Documentação da Rede (cadastros avançados)

**Objetivo:** Completar o cadastro estrutural do Módulo 3 (além de OLT/PON/CTO/Cliente).

| Tópico | Descrição |
|--------|-----------|
| VLAN | Cadastro e vínculo com PON/OLT |
| Splitter | Tipo, razão (1:8, 1:16…), posição, CTO |
| Reserva técnica | Portas/reservas por CTO |
| DIO | Cadastro, localização, vínculos |
| Backbone | Trechos, metragem, origem/destino |
| Emenda / Fusão | Registro técnico com perda estimada |
| Cor da fibra / Tubulação | Padronização visual e documental |
| Hierarquia visual | Árvore POP → OLT → PON → CTO → Cliente |

**Entregável:** inventário estrutural completo da rede no sistema.

---

## Sprint 06 — Documentação da Rede (arquivos e mídia)

**Objetivo:** Anexar e versionar evidências técnicas da rede.

| Tópico | Descrição |
|--------|-----------|
| Upload Firebase Storage | Fotos, vídeos, PDF, KMZ, KML, DWG |
| Galeria por ativo | CTO, Cliente, OLT, trecho de cabo |
| Preview de imagens/PDF | Visualização no painel |
| Metadados de arquivo | Tipo, autor, data, descrição, GPS da foto |
| Import KMZ/KML → mapa | Converter e plotar camadas |
| Versionamento simples | Histórico de substituições de arquivo |
| Permissões de download | Conforme perfil |

**Entregável:** documentação multimídia anexada aos ativos e utilizável no mapa.

---

## Sprint 07 — Gestão Avançada de CTO

**Objetivo:** Fechar o Módulo 7 com ocupação inteligente e sugestão automática.

| Tópico | Descrição |
|--------|-----------|
| Painel “Todas as CTOs” | Capacidade, clientes, portas, reserva, splitter, distância, fotos |
| Semáforo de ocupação | 🟢 ≤60% · 🟡 60–80% · 🔴 >80% |
| Filtros operacionais | Por bairro, PON, OLT, lotação, status |
| Sugestão automática de CTO | Algoritmo: menor ocupação + distância + mesma PON/área |
| Wizard “novo cliente” | Fluxo guiado escolhendo CTO sugerida |
| Alertas de saturação | Evento quando CTO cruza 80% |
| Relatório rápido de ocupação | Export CSV da sprint (PDF na Sprint 23) |
| Mapa filtrado por lotação | Camada só CTOs críticas |

**Entregável:** operação de CTO com recomendação automática para novas instalações.

---

## Sprint 08 — Monitoramento Operacional Avançado

**Objetivo:** Expandir o Módulo 5 além do protótipo (offline/oscilação/potência).

| Tópico | Descrição |
|--------|-----------|
| Catálogo de eventos | ONU reiniciando, ataques, loop, broadcast, upload anormal, cliente infectado |
| Métricas de qualidade | Ping, latência, jitter, perda (modelo + UI; fonte via integração depois) |
| Correlação de eventos | Agrupar offline em massa por CTO/PON (rompimento suspeito) |
| Timeline por ativo | Histórico filtrável no detalhe |
| Regras de severidade | Configuração Admin/NOC |
| Silenciamento / manutenção | Janela de manutenção sem falso positivo |
| Painel de incidentes | Agrupa eventos em “incidente” com status aberto/resolvido |
| Export do feed | CSV dos eventos filtrados |

**Entregável:** NOC com monitoramento rico e correlação básica de falhas.

---

## Sprint 09 — Motor de Eventos e Notificações

**Objetivo:** Fechar o ciclo alerta → notificação (parte do Módulo 5 e 6).

| Tópico | Descrição |
|--------|-----------|
| Event Bus interno | Normalização única de eventos (independente da fonte) |
| Canais Telegram | Bot + chat IDs por equipe |
| Canais WhatsApp | Integração via API parceira (Meta/BSP) |
| Canais E-mail | Templates de alerta crítico |
| Preferências por usuário | Quais alertas receber |
| Deduplicação | Evitar flood do mesmo cliente offline |
| Retentativa e DLQ | Fila de falhas de envio |
| Teste de canais | Botão “enviar teste” nas configurações |

**Entregável:** alarmes chegando nos canais reais da operação.

---

## Sprint 10 — Integração Mikrotik

**Objetivo:** Primeira integração de rede real (prioridade típica de provedor).

| Tópico | Descrição |
|--------|-----------|
| Adapter Mikrotik | API/RouterOS ou protocolo definido com o cliente |
| Coleta PPPoE / sessões | Ativos, desconectados, tempo de sessão |
| Mapeamento Cliente ↔ sessão | Cruzar com cadastro local |
| Atualização online/offline | Status real no Firestore |
| Consumo / tráfego | Upload/Download para Dashboard |
| Detecção upload anormal | Regra + evento |
| Healthcheck da integração | Última coleta, erros, reautenticação |
| Documentação operacional | Como cadastrar roteadores e credenciais |

**Entregável:** Dashboard e monitoramento refletindo dados reais do Mikrotik.

---

## Sprint 11 — Integração OLT ZTE

**Objetivo:** Telemetria óptica da OLT prioritária do cliente.

| Tópico | Descrição |
|--------|-----------|
| Adapter OLT ZTE | SNMP e/ou API vendor conforme disponível |
| Inventário óptico | ONUs por PON, status, potência RX/TX |
| Sync Cliente ↔ ONU | Serial/MAC |
| Alertas de potência | Eventos reais de sinal ruim |
| Desconexões por PON | Ranking de PONs problemáticas |
| Reboot ONU (opcional controlado) | Ação privilegiada com auditoria |
| Jobs de coleta | Functions agendadas + rate limit |
| Painel da OLT | Status por PON em tempo quase real |

**Entregável:** visão óptica real da rede ZTE no NOC.

---

## Sprint 12 — Radius + OLTs adicionais (Huawei / Fiberhome base)

**Objetivo:** Ampliar o Módulo 6 com autenticação e segundo/terceiro vendor.

| Tópico | Descrição |
|--------|-----------|
| Adapter Radius | Sessões, accounting, status de autenticação |
| Cruzamento Radius × Cliente | Fonte de verdade de conexão |
| Adapter Huawei (base) | Leitura de status/potência (escopo mínimo viável) |
| Adapter Fiberhome (base) | Idem |
| Interface `IOltVendorAdapter` | Padronizar vendors (já esboçada no Dia 06) |
| Normalização de telemetria | Mesmo schema de evento para todos |
| Configuração multi-vendor | Cadastro de OLT com tipo de adapter |
| Testes de homologação | Ambiente staging com equipamentos/lab |

**Entregável:** autenticação Radius integrada + base multi-vendor OLT.

---

## Sprint 13 — Integrações ERP/ISP + vendors restantes (MVP)

**Objetivo:** Fechar a Fase 1 com ponte para SGP/IXC/Hubsoft e stubs dos demais vendors.

| Tópico | Descrição |
|--------|-----------|
| Integração SGP | Sync de clientes/planos prioritário |
| Conector IXC (leitura) | Clientes/chamados conforme API disponível |
| Conector Hubsoft (leitura) | Idem |
| Radius Manager (bridge) | Se ainda usado em paralelo |
| Stubs Nokia / Datacom / Cisco / Juniper | Contratos + UI “em configuração” |
| Mapa de campos | De-para entre ERP e R20 NOC |
| Job de sincronização | Incremental, conflito e log |
| Homologação Fase 1 | UAT com operação real limitada |

**Entregável:** MVP operacional conectado às fontes prioritárias do provedor.

---

# FASE 2 — REDE AVANÇADA

---

## Sprint 14 — Ordens de Serviço (núcleo)

**Objetivo:** Iniciar o Módulo 9 com o ciclo básico de OS.

| Tópico | Descrição |
|--------|-----------|
| Tipos de OS | Instalação, Mudança, Retirada, Troca ONU, Troca CTO, Manutenção |
| CRUD de OS | Abertura, prioridade, status, técnico, cliente, CTO |
| Workflow de status | Aberta → Deslocamento → Em execução → Concluída / Cancelada |
| SLA de OS | Prazos por tipo |
| Fila do NOC | Distribuição manual para técnico |
| Vínculo com chamados | Abrir OS a partir de ticket/evento |
| Histórico no cliente/CTO | Timeline de OS |
| Notificação de OS | E-mail/Telegram ao técnico |

**Entregável:** gestão web de ordens de serviço ponta a ponta (sem app ainda).

---

## Sprint 15 — Ordens de Serviço (campo: checklist, mídia, GPS, assinatura)

**Objetivo:** Completar evidências de campo do Módulo 9.

| Tópico | Descrição |
|--------|-----------|
| Checklist por tipo de OS | Itens obrigatórios configuráveis |
| Fotos obrigatórias | Upload com carimbo de data/hora |
| Assinatura digital | Canvas + armazenamento |
| Localização GPS | Captura no início/fim do atendimento |
| Materiais utilizados | Baixa simples (estoque pleno na Sprint 21) |
| Relatório de conclusão | PDF resumido da OS |
| Validação NOC | Aprovar/reprovar conclusão |
| Indicadores de OS | Tempo médio, reabertura, OS por técnico |

**Entregável:** OS com evidência completa para auditoria operacional.

---

## Sprint 16 — App Técnico (base Android/iOS)

**Objetivo:** Iniciar o Módulo 10 com app nativo/híbrido autenticado.

| Tópico | Descrição |
|--------|-----------|
| App React Native | Projeto Android + iOS |
| Login Firebase | Mesmos perfis do web |
| Home do técnico | OS do dia, alertas, atalhos |
| Lista e detalhe de OS | Status e ações básicas |
| Navegação para endereço | Deep link mapas |
| Leitura de dados do cliente | Visão resumida segura |
| Push notifications | Nova OS / OS urgente |
| Publicação interna | Build de teste (TestFlight / Internal testing) |

**Entregável:** app técnico básico em testes internos.

---

## Sprint 17 — App Técnico (offline, QR, mapa, potencia/ONU)

**Objetivo:** Fechar capacidades de campo do Módulo 10.

| Tópico | Descrição |
|--------|-----------|
| Modo offline | Fila local + sync ao reconectar |
| Mapa no app | Ativos próximos e rota |
| QR Code | Identificar CTO/ONU/cliente |
| Fotos e checklist offline | Persistência local |
| Potência / leitura ONU | Via API backend quando online |
| Abrir/fechar chamado | Do app para o NOC |
| Captura OTDR (anexo) | Upload de arquivo/teste (edição gráfica na Sprint 18) |
| Hardening mobile | Biometria opcional, sessão segura |

**Entregável:** app utilizável em campo com offline e identificação por QR.

---

## Sprint 18 — OTDR Inteligente (cadastro e gráfico)

**Objetivo:** Entregar o diferencial do Módulo 4 (base).

| Tópico | Descrição |
|--------|-----------|
| Cadastro de traçado OTDR | Trecho, fibra, técnico, data |
| Eventos OTDR | Emenda, splitter, conector, perda, reflexão, distância |
| Parser/import de arquivo | Formatos acordados com o cliente (SOR/CSV/etc.) |
| Gráfico automático | Render do traço de atenuação × distância |
| Vínculo com cabo/CTO/PON | Contexto de rede |
| Galeria de testes | Por trecho |
| Permissões | Quem pode inserir/editar OTDR |
| UI de análise | Zoom, marcadores de eventos no gráfico |

**Entregável:** OTDR cadastrado com gráfico visual no sistema.

---

## Sprint 19 — OTDR Inteligente (comparação, histórico e alertas)

**Objetivo:** Completar o diferencial do Módulo 4.

| Tópico | Descrição |
|--------|-----------|
| Comparação teste antigo × novo | Overlay de curvas |
| Detecção de aumento de atenuação | Regra + alerta automático |
| Histórico completo | Timeline por trecho |
| Incidentes ópticos | Ligar alerta OTDR a rompimento/manutenção |
| Relatório OTDR | PDF técnico |
| Baseline de referência | Definir “traço ouro” da fibra |
| Integração com OS | Abrir manutenção a partir do alerta |
| Dashboard óptico | Trechos com degradação |

**Entregável:** OTDR comparativo com alertas de degradação.

---

## Sprint 20 — Engenharia de Rede e Expansão

**Objetivo:** Entregar o Módulo 8.

| Tópico | Descrição |
|--------|-----------|
| Projetos futuros | Cadastro de expansões planejadas |
| Mapa de cobertura | Áreas atendidas vs disponíveis |
| Área saturada | Heatmap por ocupação de CTO/PON |
| Casas × clientes | Estimativa de mercado por polígono |
| Taxa de penetração | Indicador por bairro/região |
| Distância da fibra | Cálculo aproximado até área alvo |
| Custo por expansão | Estimativa parametrizável (cabo, CTO, mão de obra) |
| Priorização de obras | Ranking de ROI operacional simples |

**Entregável:** visão de engenharia para decidir onde expandir.

---

## Sprint 21 — Estoque, Materiais e Fechamento da Fase 2

**Objetivo:** Gestão de materiais ligada a OS e rede; consolidar Fase 2.

| Tópico | Descrição |
|--------|-----------|
| Cadastro de materiais | ONU, splitter, cabo, conector, etc. |
| Estoque por depósito/técnico | Saldos e transferências |
| Baixa automática na OS | Consumo no fechamento |
| Alertas de estoque mínimo | Notificação |
| Serialização de ONU | Rastreio por serial/MAC |
| Inventário × rede | ONU instalada vs estoque |
| UAT Fase 2 | Validação OS + App + OTDR + Engenharia |
| Ajustes de integração | Correções pós-homologação |

**Entregável:** ciclo de campo completo (estoque + OS + app + OTDR + engenharia).

---

# FASE 3 — INTELIGÊNCIA E FECHAMENTO

---

## Sprint 22 — Painel Financeiro

**Objetivo:** Entregar o Módulo 13 (com dados próprios e/ou sync do ERP).

| Tópico | Descrição |
|--------|-----------|
| Indicadores | Receita, mensalidade, inadimplência, instalações, cancelamentos |
| Novos clientes / Churn / MRR / Ticket médio | Cálculos e séries |
| Mapa financeiro | Receita/inadimplência por região |
| Fontes de dados | Manual + integração SGP/IXC quando existir |
| Perfis Financeiro/Comercial | Visões segregadas |
| Metas e alertas | Quedas de MRR, churn alto |
| Exportação | CSV dos indicadores |
| Dashboard executivo (base) | Cards C-level |

**Entregável:** painel financeiro operacional para gestão.

---

## Sprint 23 — Relatórios (PDF / Excel)

**Objetivo:** Cobrir a maior parte do Módulo 14.

| Tópico | Descrição |
|--------|-----------|
| Motor de relatórios | Templates por entidade |
| Relatórios | Clientes, CTO, OLT, PON, ONU, Sinal, OTDR, Chamados, Disponibilidade, SLA, Mapa, Financeiro |
| Export PDF | Layout padronizado R20 |
| Export Excel | Planilhas filtráveis |
| Agendamento | Envio periódico por e-mail |
| Filtros salvos | “Meus relatórios” |
| Permissões | Quem gera o quê |
| Auditoria de exportação | Log de quem baixou dados sensíveis |

**Entregável:** geração self-service de relatórios operacionais.

---

## Sprint 24 — Power BI, Dashboards Executivos e Indicadores Avançados

**Objetivo:** Fechar analytics do Módulo 14 + evolução do Dashboard.

| Tópico | Descrição |
|--------|-----------|
| Dataset exportável | Views/coleções analíticas estáveis |
| Conector Power BI | Documentação + endpoint/arquivo agendado |
| Dashboards executivos no produto | Visões direção (disponibilidade, churn, penetração) |
| SLA avançado | Cumprimento por período/equipe |
| Heatmaps operacionais | Chamados, offline, rompimentos |
| Benchmark interno | Comparar PONs/OLTs/bairros |
| Performance de consultas | Índices e caches Redis (se adotado) ou agregações |
| Treinamento analítico | Guia para o time do cliente |

**Entregável:** camada analítica pronta para Power BI e C-level.

---

## Sprint 25 — Segurança Avançada, Auditoria e Backup

**Objetivo:** Completar o Módulo 12 em nível produção.

| Tópico | Descrição |
|--------|-----------|
| 2FA | Totp/SMS/e-mail para perfis sensíveis |
| Logs de auditoria completos | Quem alterou o quê (before/after) |
| Histórico de alterações de rede | Versionamento de ativos críticos |
| Backup automático | Firestore export agendado + Storage |
| Restore testado | Runbook de recuperação |
| Políticas de senha / sessão | Timeout, rotação, bloqueio |
| LGPD básico | Consentimento, exportação e exclusão de dados pessoais |
| Penetration checklist | Revisão de Rules, Functions e headers |

**Entregável:** plataforma endurecida para operação em produção.

---

## Sprint 26 — Inteligência Artificial (consultas)

**Objetivo:** Iniciar o Módulo 11 com perguntas em linguagem natural.

| Tópico | Descrição |
|--------|-----------|
| Assistente NOC (chat) | UI no painel |
| Camada de tools/queries | Traduzir pergunta → consulta Firestore/agregações |
| Perguntas do escopo | CTO quase cheia, sinal < -26 dBm, PON com mais drops, offline 24h, bairro com mais chamados, cabo com rompimentos, técnico mais rápido |
| Respostas com links | Ir direto ao ativo/mapa/lista |
| Controle de acesso | IA respeita perfil do usuário |
| Telemetria de uso | Quais perguntas mais feitas |
| Guardrails | Não inventar dados; citar fonte |
| Base de conhecimento interna | Docs de operação R20 |

**Entregável:** IA respondendo perguntas operacionais reais do NOC.

---

## Sprint 27 — Inteligência Artificial (sugestões e previsão)

**Objetivo:** Fechar o diferencial de IA do Módulo 11.

| Tópico | Descrição |
|--------|-----------|
| Sugestão troca de splitter | Com base em ocupação/perda |
| Sugestão troca de ONU | Histórico de oscilação/potência |
| Sugestão troca de cabo | OTDR + incidentes |
| Balanceamento de PON | Recomendação de redistribuição |
| Melhor rota / expansão | Apoio ao módulo de engenharia |
| Previsão de falhas | Modelo simples (regras + tendência) antes de ML pesado |
| Card “Recomendações do dia” | No Dashboard |
| Feedback humano | Técnico aceita/recusa sugestão (melhoria contínua) |

**Entregável:** IA prescritiva apoiando operação e expansão.

---

## Sprint 28 — Hardening Final, Performance e Aceite do Sistema Completo

**Objetivo:** Fechar o produto completo com qualidade de produção.

| Tópico | Descrição |
|--------|-----------|
| Performance | Índices Firestore, paginação, caches, bundle front |
| Testes E2E críticos | Login, mapa, OS, integrações, relatórios |
| Correção de débitos técnicos | Itens acumulados das sprints |
| Documentação final | Manual NOC, técnico, admin e runbooks |
| Treinamento | Workshops por perfil |
| Go-live | Cutover, monitoramento 24/48h |
| Aceite formal | Checklist dos 14 módulos |
| Roadmap pós-entrega | Melhorias contínuas acordadas |

**Entregável:** sistema completo aceito, documentado e em produção.

---

## 4. Visão consolidada por fase (para proposta comercial)

### Fase 0 — Protótipo (Sprint 01 · 7 dias)
Validação visual e de fluxo: Dashboard, Mapa, Cadastros, Detalhes, Monitoramento simulado.

### Fase 1 — MVP Operacional (Sprints 02–13 · 84 dias)
Segurança, dashboard real, mapa completo, documentação de rede, gestão de CTO, monitoramento avançado, notificações e integrações prioritárias (Mikrotik, ZTE, Radius, SGP/ERP).

### Fase 2 — Rede Avançada (Sprints 14–21 · 56 dias)
Ordens de serviço, app técnico offline, OTDR inteligente, engenharia de expansão e estoque.

### Fase 3 — Inteligência & Fechamento (Sprints 22–28 · 49 dias)
Financeiro, relatórios, Power BI, segurança avançada, IA consultiva/prescritiva e go-live.

---

## 5. Premissas da estimativa

1. **1 squad** dedicado (ex.: 1–2 front, 1 backend/functions, 1 mobile nas sprints 16–17, design sob demanda).
2. **Acesso tempestivo** a equipamentos (Mikrotik, OLT ZTE), APIs (SGP/IXC/Hubsoft) e credenciais.
3. **Escopo de vendors** além de Mikrotik/ZTE/Radius pode variar conforme homologação — sprints 12–13 têm margem de adaptação.
4. **WhatsApp** depende de BSP/aprovação Meta; se bloquear, mantém-se Telegram + E-mail.
5. **OTDR**: formatos de arquivo devem ser definidos com o cliente no início da Sprint 18.
6. **IA**: usa APIs de LLM + tools sobre dados do Firebase; qualidade depende da higiene dos dados das fases anteriores.
7. Sprints são de **7 dias úteis**; feriados/paralisações empurram o calendário.
8. Itens “stub” (Nokia, Cisco, Juniper, DWG avançado) podem virar sprints extras se o cliente exigir profundidade de produção.

---

## 6. Riscos que mais impactam prazo

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Atraso em acesso a OLT/API do ERP | Escorrega Sprints 10–13 | Começar homologação na Sprint 08 |
| Qualidade/georreferência dos dados legados | Mapa e docs fracos | Importação assistida + correção em campo (app) |
| Escopo de todos os vendors “completos” | Estoura Fase 1 | Priorizar ZTE + Mikrotik + 1 ERP; demais em backlog |
| App offline complexo | Estoura Sprint 17 | Sync mínimo viável primeiro |
| Expectativa de IA “mágica” cedo | Frustração | Só após dados reais estáveis (pós Fase 1–2) |

---

## 7. Pacotes sugeridos para comercial

| Pacote | Sprints | Dias | Conteúdo |
|--------|---------|------|----------|
| **A — Protótipo** | 01 | 7 | Demo atual (`dia-01`…`dia-07`) |
| **B — MVP Operacional** | 01 → 13 | 91 | Pacote A + Fase 1 completa |
| **C — Operação de Campo** | 01 → 21 | 147 | Pacote B + OS + App + OTDR + Engenharia + Estoque |
| **D — Plataforma Completa** | 01 → 28 | 196 | Todos os 14 módulos + IA + go-live |

---

## 8. Relação com os documentos da Sprint 01

| Documento | Uso |
|-----------|-----|
| `documentation.md` | Visão do produto, stack, domínio, fora de escopo do protótipo |
| `dia-01` … `dia-07` | Detalhamento operacional da **Sprint 01** |
| `estimativa.md` (este) | Visão financeira/temporal do **sistema completo** em sprints de 7 dias |

---

## 9. Próximo passo recomendado

1. Validar com o cliente o **Pacote A** (Sprint 01) como entrega imediata.  
2. Congelar prioridades da **Fase 1** (quais integrações são dia-1 obrigatórias).  
3. Converter este documento em proposta comercial (valores/hora ou valor por sprint).  
4. Iniciar implementação seguindo `doc/dia-01-estrutura-inicial.md`.

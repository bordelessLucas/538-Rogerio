# Checklist — 29/07/2026

Sessão: fechamento do Dia 04 (gaps) + Dia 05 (detalhamento) + Dia 06 (monitoramento) · push · deploy Firebase.

---

## Dia 04 — Gaps fechados

- [x] “Ver no mapa” com deep link `/mapa?type=&id=` e foco (`flyTo`) no ativo
- [x] Validação de domínio: PON deve pertencer à OLT no create/update de CTO
- [x] Badge de lotação alinhado (🟢 ≤60% · 🟡 60–80% · 🔴 >80%)
- [x] Links de detalhes nas listagens apontando para `/:id`

---

## Dia 05 — Detalhamento dos ativos

### Rotas e navegação
- [x] `/rede/ctos/:id` e `/rede/clientes/:id`
- [x] Deep link a partir do mapa (popup) e das listagens
- [x] Breadcrumb Rede → CTOs/Clientes → nome
- [x] Links hierárquicos OLT → PON → CTO → Cliente
- [x] Botão Voltar (`navigate(-1)`)

### Detalhe CTO
- [x] Nome, código, status, capacidade, portas, splitter, distância
- [x] `OccupancyBar` + badge de lotação
- [x] Lista de clientes da CTO
- [x] Botões: Ver no mapa · Editar · Monitoramento filtrado (`?ctoId=`)
- [x] Extras: potência média, eventos, fotos/docs placeholder, CTO recomendada

### Detalhe Cliente
- [x] Plano, ONU, potência (highlight &lt; −26 dBm), IP, equipamento, MAC/serial
- [x] Status + hierarquia OLT/PON/CTO
- [x] Botões: Ver no mapa · Editar · Histórico → `/monitoramento?clientId=`
- [x] Extras: sparkline fake, eventos, placeholders de OS/chamados/fotos

### Componentes
- [x] `StatusBadge`, `OccupancyBar`, `PowerIndicator`, `EntityMeta`, `DetailSection`

---

## Dia 06 — Monitoramento inicial

### Tela `/monitoramento`
- [x] Feed AO VIVO (`onSnapshot` em `events`) + badge “Ao vivo”
- [x] Layout feed + filtros laterais
- [x] Filtros: tipo, severidade, período (1h/24h/7d), busca, não reconhecidos
- [x] Deep link `?ctoId=` / `?clientId=`
- [x] Ação Reconhecer + link para detalhe do ativo
- [x] Cards: offline agora · potência · oscilações 1h · críticos abertos

### Simulador (sem Blaze / sem Cloud Functions)
- [x] UI admin: Simular evento + Demo automática
- [x] CLI: `npm run simulate:events`
- [x] Eventos: offline · oscilação · potência (+ online)
- [x] Atualiza status no Firestore → mapa/listagens refletem ao vivo

### Arquitetura futura
- [x] Contratos em `web/src/infra/integrations/` (SNMP, OLT, RADIUS, notificações)
- [x] Doc local `doc/integracoes-telemetria.md` (pasta `doc/` permanece gitignored)

---

## Fora de escopo (conscientemente)

- [ ] Firebase Storage / upload de fotos (exige plano Blaze)
- [ ] Cloud Functions agendadas
- [ ] SNMP/RADIUS reais
- [ ] Dia 07 (polish / QA / apresentação)

---

## Entrega desta sessão

- [x] Checklist do dia (`CHECKLIST-2026-07-29.md`)
- [x] Push no GitHub (`main`)
- [x] Deploy Firebase Hosting (`rogerio-48623` → https://rogerio-48623.web.app)

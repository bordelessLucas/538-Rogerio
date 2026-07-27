# Checklist — 27/07/2026

Sessão: validação do Dia 01 + implementação do Dia 02 (Dashboard Operacional).

---

## Dia 01 — Estrutura inicial (validado 100%)

- [x] App React + TypeScript + Vite
- [x] Path aliases (`@/`), lint e estrutura por feature
- [x] Firebase Auth / Firestore / Storage / Hosting
- [x] Login e-mail/senha + rotas protegidas
- [x] Layout admin (sidebar, topbar, footer `v0.1.0-proto`)
- [x] Menu: Dashboard, Mapa, Rede, Monitoramento, Chamados, Configurações
- [x] Shell do Dashboard NOC
- [x] Types + seed das collections (`olts`, `pons`, `ctos`, `clients`, `events`, `tickets`, `pops`)

---

## Dia 02 — Dashboard operacional (implementado)

### Dados
- [x] `IMetricsRepository` + implementação Firestore
- [x] `dashboardService` / `useNocMetrics` / `useRecentEvents` com `onSnapshot`
- [x] Documento `metrics/noc` com KPIs da demo

### UI
- [x] 6 cards principais (online, offline, sinal ruim, OLTs, chamados, disponibilidade)
- [x] 5 cards de operação (rompimentos, CTOs lotadas, PPPoE, alarmes, SLA)
- [x] Grid responsivo 2 / 3 / 4 colunas
- [x] Lista “Últimos eventos” (5 itens)
- [x] Loading / empty / error + “Atualizado há Xs”
- [x] Navegação nos cards + botão “Ver no mapa”

### Seed / ops
- [x] Seed enriquecido (4 OLTs, métricas realistas, 5 eventos)
- [x] Script `npm run seed:dashboard`
- [x] Reset de métricas no painel (admin)

---

## Entrega desta sessão

- [x] Checklist do dia
- [x] Push no GitHub (`main`)
- [x] Deploy Firebase Hosting

## Fora do escopo hoje

- Cadastro de Rede funcional (Dia 04) — adiado
- Mapa Inteligente (Dia 03)

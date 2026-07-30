# R20 NOC — Web (Protótipo)

Plataforma operacional FTTH — Sprint 01 / Dias 01–06 (estrutura → monitoramento AO VIVO).

## Stack

- React + TypeScript + Vite
- Tailwind CSS v4
- Leaflet + React Leaflet
- Firebase (Auth, Firestore, Storage, Hosting)
- React Router + Zod

## Setup

```bash
cd web
cp .env.example .env   # já existe .env local com o projeto rogerio-48623
npm install
npm run dev
```

App em `http://localhost:5173`.

## Firebase (`rogerio-48623`)

1. No [Console Firebase](https://console.firebase.google.com/project/rogerio-48623):
   - **Authentication** → ative o provedor **E-mail/senha**
   - **Firestore** → crie o banco (modo produção) e publique as regras de `firestore.rules`
   - **Storage** → ative e publique `storage.rules` (opcional; upload real na Sprint 02 / Blaze)
2. Na tela de login:
   - Clique em **Criar usuário demo (primeira vez)**  
     Credenciais: `admin@r20noc.com` / `R20noc@2026`
   - Ou use **Entrar** se o usuário já existir
3. No Dashboard (perfil admin):
   - **Reaplicar seed Firebase** — POPs, OLTs, PONs, CTOs, clientes, events, tickets e `metrics/noc`
   - **Reset métricas** — só `metrics/noc` (ou via CLI abaixo)

```bash
npm run seed:dashboard
npm run simulate:events
```

## Rotas principais

| Rota | Módulo |
|------|--------|
| `/` | Dashboard NOC |
| `/mapa` | Mapa Inteligente (`?type=&id=` deep link) |
| `/rede` | Visão geral do cadastro |
| `/rede/olts` · `/rede/pons` · `/rede/ctos` · `/rede/clientes` | CRUD |
| `/rede/ctos/:id` · `/rede/clientes/:id` | Detalhes |
| `/monitoramento` | Feed AO VIVO (`?ctoId=` / `?clientId=`) |
| `/chamados` · `/configuracoes` | Placeholders |

## Estrutura

```
src/
  app/              # layout e rotas
  features/         # auth, dashboard, map, network, monitoring
  infra/firebase    # client, seed
  infra/integrations # contratos SNMP/OLT/RADIUS/notificações
  shared/           # types, ui, utils
```

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Dev server |
| `npm run build` | Build produção |
| `npm run preview` | Preview do build |
| `npm run seed:dashboard` | Reseta `metrics/noc` com valores da demo |
| `npm run simulate:events` | Loop local de eventos AO VIVO (Dia 06) |
| `npm run deploy` | Build + Firebase Hosting |

## Entrega (Dias 01–06)

### Dia 01 — Estrutura inicial
- [x] App React + TS + Vite + path aliases
- [x] Firebase via `.env` (Auth / Firestore / Storage / Hosting)
- [x] Auth e-mail/senha + rotas protegidas + stub de perfis
- [x] Layout admin responsivo + menu
- [x] Shell Dashboard NOC
- [x] Types + seed das collections de rede

### Dia 02 — Dashboard operacional
- [x] KPIs ao vivo via `onSnapshot` (`metrics/noc`)
- [x] 6 cards principais + 5 de operação
- [x] Lista de últimos eventos
- [x] `IMetricsRepository` + `npm run seed:dashboard`

### Dia 03 — Mapa Inteligente
- [x] Leaflet + marcadores Cliente / CTO / OLT / POP
- [x] Cores por status, legenda, filtros, busca (flyTo)
- [x] Deep link `/mapa?type=&id=` + popup → detalhes
- [x] `IMapAssetsRepository` + listener de status

### Dia 04 — Cadastro de Rede
- [x] CRUD OLT / PON / CTO / Cliente (Zod + drawer + toast)
- [x] Associações OLT → PON → CTO → Cliente + exclusão com vínculos
- [x] Badge de lotação · seed 2 POPs · 4 OLTs · 10 PONs · 20 CTOs · 50 clientes

### Dia 05 — Detalhamento dos ativos
- [x] `/rede/ctos/:id` e `/rede/clientes/:id`
- [x] OccupancyBar, PowerIndicator, EntityMeta, breadcrumbs
- [x] Links mapa / editar / monitoramento filtrado

### Dia 06 — Monitoramento inicial
- [x] Feed AO VIVO + filtros + cards-resumo + reconhecer
- [x] Simulador UI (admin) + `npm run simulate:events`
- [x] Contratos em `infra/integrations/` (tomada para SNMP/OLT/RADIUS)

## Fora de escopo (consciente)

- Clusterização de marcadores · Storage/upload de fotos · Cloud Functions · SNMP/RADIUS reais

## Dia 07 — Refinamentos e entrega

- [x] Polish UX (skeletons, empty states, favicon, breadcrumbs, atalhos)
- [x] Documentação de entrega (`doc/documentation.md`, `doc/script-demo.md`)
- [x] Seed **Modo apresentação** no Dashboard (admin)
- [x] Versão `v0.1.0-sprint1`

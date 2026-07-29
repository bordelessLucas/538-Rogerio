# R20 NOC — Web (Protótipo)

Plataforma operacional FTTH — Sprint 01 / Dia 02.

## Stack

- React + TypeScript + Vite
- Tailwind CSS v4
- Firebase (Auth, Firestore, Storage, Analytics)
- React Router

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
   - **Storage** → ative e publique `storage.rules` (opcional no Dia 01)
2. Na tela de login:
   - Clique em **Criar usuário demo (primeira vez)**  
     Credenciais: `admin@r20noc.com` / `R20noc@2026`
   - Ou use **Entrar** se o usuário já existir
3. No Dashboard (perfil admin):
   - **Aplicar seed Firebase** — POPs, OLTs, PONs, CTOs, clientes, events, tickets e `metrics/noc`
   - **Reset métricas** — só `metrics/noc` (ou via CLI abaixo)

```bash
npm run seed:dashboard
npm run simulate:events
```

## Estrutura

```
src/
  app/           # layout e rotas
  features/      # auth, dashboard, network, ...
  infra/firebase # client, seed
  shared/        # types, ui, utils
```

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Dev server |
| `npm run build` | Build produção |
| `npm run preview` | Preview do build |
| `npm run seed:dashboard` | Reseta `metrics/noc` com valores da demo |
| `npm run simulate:events` | Loop local de eventos AO VIVO (Dia 06) |

## Entrega

### Dia 01
- [x] App React + TS + Vite
- [x] Firebase via `.env`
- [x] Auth e-mail/senha + rotas protegidas
- [x] Layout admin responsivo + menu
- [x] Shell Dashboard NOC
- [x] Types + seed das collections de rede

### Dia 02
- [x] KPIs ao vivo via `onSnapshot` (`metrics/noc`)
- [x] Cards principais + extras de operação
- [x] Lista de últimos eventos
- [x] `IMetricsRepository` + `npm run seed:dashboard`

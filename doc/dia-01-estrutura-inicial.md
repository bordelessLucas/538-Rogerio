# Dia 01 — Estrutura Inicial da Plataforma

**Objetivo do dia:** Deixar o projeto “de pé”: arquitetura, Firebase, layout administrativo responsivo, menu lateral e shell do Dashboard NOC, com a base de dados dos ativos.

**Valor para o cliente:** Já visualiza a identidade do produto (painel NOC) e a navegação entre módulos.

---

## Checklist de implementação

### 1. Bootstrap do projeto
- [x] Criar app React + TypeScript + Vite
- [x] Configurar ESLint, Prettier e path aliases (`@/`)
- [x] Estrutura de pastas por feature (Clean Architecture leve):
  - `src/app` — rotas, providers, layout
  - `src/features` — dashboard, map, network, monitoring, auth
  - `src/shared` — UI, hooks, utils, types
  - `src/infra/firebase` — config e clients
- [x] Tema visual NOC (CSS variables): fundo operacional, contraste alto para status

### 2. Firebase
- [x] Criar projeto Firebase (Auth, Firestore, Storage, Hosting)
- [x] Configurar SDK no front (`firebaseApp`, `auth`, `db`, `storage`)
- [x] Regras iniciais do Firestore (dev abertas / prod com auth)
- [x] Collections iniciais:
  - `olts`, `pons`, `ctos`, `clients`, `events`, `tickets`, `pops`
- [x] Script de seed com dados fictícios da R20 (para demo)

### 3. Autenticação básica
- [x] Login com e-mail/senha (Firebase Auth)
- [x] Rota protegida do painel
- [x] Stub de perfis: `admin` | `noc` | `tecnico` (campo em `users`)

### 4. Layout administrativo responsivo
- [x] Shell: sidebar + topbar + área de conteúdo
- [x] Sidebar colapsável no mobile (drawer)
- [x] Topbar com nome do usuário, status da sessão e breadcrumb simples
- [x] Footer discreto com versão do protótipo (`v0.1.0-proto`)

### 5. Menu lateral — módulos principais
Itens visíveis (mesmo que alguns sejam “em breve”):
- [x] Dashboard NOC
- [x] Mapa Inteligente
- [x] Cadastro de Rede (OLT / PON / CTO / Cliente)
- [x] Monitoramento
- [x] Chamados (placeholder)
- [x] Configurações (placeholder)

### 6. Tela inicial — Dashboard NOC (shell)
- [x] Grid responsivo de cards vazios/skeleton
- [x] Título + subtítulo (“Visão operacional da rede”)
- [x] Área reservada para KPIs (preenchidos no Dia 02)
- [x] Link rápido para Mapa e Cadastros

### 7. Banco — estrutura de ativos
Definir e tipar no TypeScript + criar docs no Firestore:

**OLT**
- `name`, `vendor`, `ip`, `status`, `lat`, `lng`, `popId`, `createdAt`

**PON**
- `name`, `oltId`, `port`, `status`, `createdAt`

**CTO**
- `name`, `code`, `oltId`, `ponId`, `capacity`, `occupiedPorts`, `freePorts`, `splitter`, `distanceMeters`, `status`, `lat`, `lng`, `occupancyPercent`

**Cliente**
- `name`, `plan`, `onuModel`, `powerDbm`, `lastAccessAt`, `ip`, `equipment`, `mac`, `serial`, `status`, `ctoId`, `oltId`, `ponId`, `lat`, `lng`

**POP**
- `name`, `address`, `lat`, `lng`, `status`

### 8. Entrega do Dia 01
- [x] App roda localmente (`npm run dev`)
- [x] Login funciona
- [x] Layout + menu navegáveis
- [x] Collections criadas e seed básico aplicado
- [x] README mínimo de setup (env Firebase)

---

## Critério de aceite
O cliente consegue logar e ver o layout do NOC com menu lateral e dashboard skeleton, mesmo sem KPIs preenchidos.

## Dependências para o Dia 02
Seed Firebase + layout de cards prontos para receber indicadores.

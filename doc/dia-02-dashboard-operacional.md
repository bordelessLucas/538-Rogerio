# Dia 02 — Dashboard Operacional

**Objetivo do dia:** Transformar o shell do Dashboard em um painel operacional útil, com indicadores claros (dados simulados/seed) e organização visual preparada para tempo real.

**Valor para o cliente:** Em 10 segundos entende a saúde da rede — o “coração” do produto.

---

## Checklist de implementação

### 1. Camada de dados dos indicadores
- [x] Serviço `dashboardService` lendo do Firestore (agregações no cliente ou docs `metrics/noc`)
- [x] Documento `metrics/noc` atualizado pelo seed / simulador:
  - `clientsOnline`
  - `clientsOffline`
  - `clientsBadSignal`
  - `oltsCount`
  - `ticketsOpen`
  - `networkAvailabilityPercent`
- [x] Hook `useNocMetrics` com listener em tempo real (`onSnapshot`) — mesmo com dados simulados, o painel “pisca” ao vivo

### 2. Cards obrigatórios da sprint
Implementar cards com ícone, valor, variação opcional e cor de status:

| Card | Campo | Cor sugerida |
|------|-------|--------------|
| Clientes Online | `clientsOnline` | verde |
| Clientes Offline | `clientsOffline` | vermelho |
| Clientes com Sinal Ruim | `clientsBadSignal` | amarelo |
| OLTs cadastradas | `oltsCount` | azul/neutro |
| Chamados | `ticketsOpen` | laranja |
| Disponibilidade da Rede | `networkAvailabilityPercent` | verde se ≥ 99% |

### 3. Cards extras de alto impacto (recomendados — visão do cliente)
Incluir se der tempo (aumentam percepção de produto completo):
- [x] Rompimentos detectados
- [x] CTOs com lotação (> 80%)
- [x] PPPoE ativos
- [x] Alarmes ativos
- [x] SLA do dia

> Se o tempo apertar, priorizar os 6 cards da sprint e deixar os extras como “placeholder com valor seed”.

### 4. Organização visual do painel
- [x] Grid responsivo: 2 cols mobile / 3 tablet / 4 desktop
- [x] Seção “Indicadores principais” no topo
- [x] Seção “Operação” (chamados, alarmes) abaixo
- [x] Mini-lista “Últimos eventos” (preview do Dia 06) — 5 itens do seed
- [x] Empty/loading/error states em todos os cards
- [x] Timestamp “Atualizado há Xs” com listener

### 5. Preparação para tempo real futuro
- [x] Abstrair fonte de dados atrás de interface (`IMetricsRepository`)
- [x] Comentário/arquitetura: amanhã SNMP/API só trocam o repositório
- [x] Não hardcodar números no JSX — tudo via service/hook

### 6. Navegação a partir dos cards
- [x] Clique em “Offline” → filtro futuro / link para Monitoramento
- [x] Clique em “OLTs” → listagem de OLTs
- [x] Clique em “Chamados” → placeholder de tickets
- [x] Botão “Ver no mapa” no header do dashboard

### 7. Seed de demonstração
- [x] Popular métricas realistas (ex.: 1.240 online, 37 offline, 12 sinal ruim, 4 OLTs, 18 chamados, 99,4% disponibilidade)
- [x] Script `npm run seed:dashboard` para resetar demo

### 8. Entrega do Dia 02
- [x] Dashboard preenchido e responsivo
- [x] Listener Firestore funcionando
- [x] Visual coerente com status (verde/amarelo/vermelho)

---

## Critério de aceite
Cliente abre o sistema e imediatamente vê os principais KPIs da operação FTTH, com aparência de painel NOC profissional.

## Dependências para o Dia 03
Dados de lat/lng nos ativos do seed para plotar no mapa.

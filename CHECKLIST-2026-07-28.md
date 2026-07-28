# Checklist — 28/07/2026

Sessão: validação do Dia 02 + implementação do Dia 03 (Mapa Inteligente) e Dia 04 (Cadastro de Rede).

---

## Dia 02 — Dashboard operacional (validado 100%)

- [x] `IMetricsRepository` + implementação Firestore
- [x] `dashboardService` / `useNocMetrics` / `useRecentEvents` com `onSnapshot`
- [x] Documento `metrics/noc` com KPIs da demo
- [x] 6 cards principais + 5 cards de operação
- [x] Grid responsivo, eventos, loading/error, navegação
- [x] Seed + `npm run seed:dashboard` + reset admin

---

## Dia 03 — Mapa Inteligente (implementado)

### Base
- [x] Leaflet + React Leaflet + tiles OpenStreetMap
- [x] Página `/mapa` em tela cheia dentro do layout
- [x] Centro demo + zoom de bairro/cidade

### Marcadores
- [x] Clientes, CTOs, OLTs, POPs
- [x] Formas distintas por tipo (casa / círculo / losango / prédio)
- [x] Cores por status: online · alerta · offline · desativado
- [x] Popup resumido + botão “Ver detalhes”
- [x] Listener Firestore (status ao vivo)

### Controles
- [x] Legenda fixa (tipos + cores)
- [x] Filtros por tipo e status + contador de visíveis
- [x] Busca por nome (flyTo)
- [x] Botão “Minha localização”
- [x] Botão “Enquadrar todos os ativos”
- [x] Camadas futuras desabilitadas na UI

### Arquitetura
- [x] `IMapAssetsRepository` + `mapService` + `useMapAssets`

### Adiado (opcional)
- [ ] Clusterização de marcadores (seed ainda pequeno)

---

## Dia 04 — Cadastro de Rede (implementado)

### Módulo
- [x] Tabs: Visão geral · OLTs · PONs · CTOs · Clientes
- [x] Rotas `/rede/olts`, `/rede/pons`, `/rede/ctos`, `/rede/clientes`

### CRUD
- [x] OLT — nome, vendor, IP, POP, status, lat/lng
- [x] PON — nome/porta, OLT, status
- [x] CTO — nome/código, OLT, PON, capacidade, ocupação, splitter, distância, status, lat/lng
- [x] Cliente — dados técnicos + associação à CTO
- [x] Validação Zod nos formulários
- [x] Drawer de formulário + toast de sucesso/erro
- [x] Loading nos submits

### Listagens
- [x] Tabela no desktop / cards no mobile
- [x] Busca + filtros + paginação
- [x] Ações: editar, excluir, ver no mapa, detalhes
- [x] Empty state com CTA de cadastro
- [x] Visão geral com contadores e alertas rápidos

### Domínio
- [x] Associações OLT → PON → CTO → Cliente
- [x] Cliente herda `oltId` / `ponId` da CTO
- [x] CTO calcula `freePorts` + `occupancyPercent`
- [x] Badge de lotação 🟢 ≤60% · 🟡 60–80% · 🔴 >80%
- [x] Exclusão bloqueada quando há vínculos

### Seed
- [x] 2 POPs · 4 OLTs · 10 PONs · 20 CTOs · 50 clientes
- [x] “Reaplicar seed Firebase” (force) no dashboard admin

---

## Entrega desta sessão

- [x] Checklist do dia
- [x] Push no GitHub (`main`)
- [x] Deploy Firebase Hosting

## Fora do escopo hoje

- Detalhamento de ativos (Dia 05)
- Monitoramento AO VIVO (Dia 06)
- Clusterização do mapa (opcional do Dia 03)

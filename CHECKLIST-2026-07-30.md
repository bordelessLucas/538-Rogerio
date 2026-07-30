# Checklist — 30/07/2026

Sessão: Dia 07 — refinamentos, QA, documentação e entrega do protótipo.

---

## Dia 07 — Refinamentos e entrega

### Visual / UX
- [x] Favicon NOC + título “R20 NOC” + IBM Plex Sans
- [x] Skeletons: Dashboard (já), Mapa, listagens (`ListSkeleton`), detalhes (`DetailSkeleton`)
- [x] Empty states com CTA (rede, mapa, monitoramento, eventos)
- [x] Versão `v0.1.0-sprint1`

### Navegação
- [x] Breadcrumbs topbar para rotas aninhadas de Rede
- [x] Atalhos Dashboard: Mapa · Monitoramento · Cadastros
- [x] Card “Atalhos da demo” com fluxo guiado
- [x] Eventos do Dashboard linkam para `/monitoramento`
- [x] Seed renomeado para **Modo apresentação (seed)**

### Fluxo / QA
- [x] Domínio e listeners já cobrem status coerente + CRUD ao vivo
- [x] Removido estado morto no detalhe de cliente (`signalStubOpen`)
- [x] Build `tsc -b && vite build` ok

### Documentação
- [x] `doc/documentation.md` — entregue de fato, próximos 30 dias, Fase 1, escopo
- [x] `doc/script-demo.md` — roteiro 5–8 min
- [x] `doc/dia-07-refinamentos-entrega.md` checklist marcado
- [x] `web/README.md` já cobre Dias 01–06 (+ referência Dia 07)

---

## Fora de escopo / opcional

- [ ] Capturas ou vídeo curto da demo
- [ ] Clusterização, Storage real, Cloud Functions, SNMP

---

## Entrega desta sessão

- [x] Checklist do Dia 07
- [ ] Push no GitHub (`main`) — sob demanda
- [ ] Deploy Firebase Hosting — `cd web && npm run deploy` (URL: https://rogerio-48623.web.app)

Build local validado (`npm run build`).

# Dia 07 — Refinamentos e Entrega do Protótipo

**Objetivo do dia:** Polir UX, corrigir bugs, validar o fluxo ponta a ponta e preparar a base/documentação para as próximas fases.

**Valor para o cliente:** Demo confiável, profissional e com narrativa clara do que já existe vs. roadmap.

---

## Checklist de implementação

### 1. Ajustes visuais
- [x] Revisar espaçamentos, tipografia e contraste dos status
- [x] Uniformizar cards, tabelas, badges e botões
- [x] Loading skeletons em Dashboard, Mapa, Listagens e Detalhes
- [x] Empty states com CTA
- [x] Favicon + título da aba “R20 NOC”
- [x] Responsividade: testar mobile, tablet e desktop

### 2. Melhorias de navegação
- [x] Fluxo guiado da demo:
  1. Login
  2. Dashboard (KPIs)
  3. Card Offline → Monitoramento
  4. Evento → Cliente
  5. Cliente → Mapa
  6. CTO no mapa → Detalhe CTO
  7. Cadastros → criar/editar registro
- [x] Menu ativo destacado pela rota
- [x] Breadcrumbs consistentes
- [x] Atalhos no Dashboard para Mapa / Cadastro / Monitoramento

### 3. Revisão do fluxo Dashboard ↔ Mapa ↔ Cadastros
- [x] Todo ativo com coordenadas aparece no mapa
- [x] Status coerente entre Dashboard, Mapa, Lista e Detalhe
- [x] Associações OLT → PON → CTO → Cliente íntegras
- [x] Após CRUD, UI atualiza sem refresh manual

### 4. Correções e testes
- [x] Checklist manual de QA (abaixo)
- [x] Corrigir bugs bloqueadores da demo
- [x] Validar formulários (campos obrigatórios, lat/lng inválidos)
- [x] Validar regras de exclusão com vínculos
- [x] Testar login/logout e rota protegida

### 5. QA — roteiro mínimo
- [x] Login com usuário seed
- [x] Dashboard carrega 6+ cards
- [x] Listener atualiza métricas/eventos
- [x] Mapa: 4 tipos de marcadores + filtros + popup
- [x] CRUD OLT, PON, CTO, Cliente
- [x] Detalhe CTO: capacidade, portas, splitter, distância
- [x] Detalhe Cliente: nome, plano, ONU, potência, último acesso, IP, equipamento
- [x] Monitoramento: offline, oscilação, potência
- [x] Mobile: sidebar e tabelas usáveis

### 6. Preparação da base para próximas fases
- [x] Atualizar `documentation.md` com o que foi entregue de fato
- [x] Lista “Próximos 30 dias” priorizada
- [x] Seed de demo “modo apresentação” estável
- [x] Deploy Firebase Hosting + URL de acesso ao cliente
- [x] Credenciais de demo documentadas em `web/README.md` / script-demo

### 7. Materiais de entrega
- [x] Script de demo (5–8 minutos) em tópicos — `doc/script-demo.md`
- [ ] Capturas ou vídeo curto (opcional)
- [x] Escopo entregue vs. fora do escopo (transparência) — `documentation.md` §8
- [x] Proposta de Fase 1 (60–90 dias) alinhada à visão dos 14 módulos

### 8. Entrega do Dia 07
- [x] Protótipo validado
- [x] Deploy disponível (URL existente; republicar com `npm run deploy` após push)
- [x] Documentação atualizada
- [x] Apresentação pronta (`script-demo.md`)

---

## Critério de aceite
Protótipo estável para demonstração ao cliente, cobrindo a sprint de 7 dias, com Firebase, fluxo operacional claro e roadmap para evolução sem reescrita.

## Encerramento da Sprint
Celebrar o que gera valor agora (Dashboard + Mapa + Cadastro + Detalhes + Monitoramento) e ancorar a conversa comercial nas Fases 1–3 descritas em `documentation.md`.

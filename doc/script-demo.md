# Script de demo — R20 NOC (5–8 minutos)

URL: https://rogerio-48623.web.app  
Login demo: `admin@r20noc.com` / `R20noc@2026` (ou botão **Criar usuário demo**)

Antes da call: Dashboard → **Modo apresentação (seed)** (admin).

---

## Roteiro

### 1. Login (30s)
- Abrir a URL, entrar com o usuário demo.
- Mostrar identidade R20 NOC e versão no rodapé.

### 2. Dashboard — saúde da rede (60–90s)
- Apontar os 6 KPIs (online, offline, sinal ruim, OLTs, chamados, disponibilidade).
- Mostrar cards de operação e “Atualizado há Xs” (listener Firestore).
- Clicar em **Clientes Offline** → cai no Monitoramento.

### 3. Monitoramento AO VIVO (90s)
- Badge **AO VIVO** + feed.
- Filtrar por severidade / tipo (offline, oscilação, potência).
- (Opcional) **Simular evento** ou **Demo automática** — status muda no mapa depois.
- Clicar **Ver ativo** em um evento de cliente.

### 4. Detalhe do Cliente (60s)
- Plano, ONU, potência (highlight se &lt; −26 dBm), IP, equipamento, hierarquia OLT/PON/CTO.
- **Ver no mapa**.

### 5. Mapa Inteligente (90s)
- 4 formas/cores: Cliente, CTO, OLT, POP.
- Filtros + legenda + busca.
- Abrir popup de uma **CTO** → **Ver detalhes**.

### 6. Detalhe da CTO (60s)
- Capacidade, portas, splitter, distância, OccupancyBar, lista de clientes.
- CTO recomendada na mesma PON (se houver).
- Mencionar **Editar** e **Monitoramento filtrado**.

### 7. Cadastro de Rede (60–90s)
- `/rede` → visão geral.
- Abrir OLTs ou CTOs: criar/editar rápido (drawer + toast).
- Frisar: associações OLT → PON → CTO → Cliente e bloqueio de exclusão com vínculos.

### 8. Fechamento (45s)
- **Entregue agora:** Dashboard + Mapa + Cadastro + Detalhes + Monitoramento.
- **Próximos 30 dias:** Mikrotik, OLT ZTE, Rules, fotos, Chamados, camadas de cabo.
- **Fase 1 (60–90 dias):** MVP operacional sem reescrever o front.

---

## Frases úteis

- “Isso já é o painel que o NOC abre de manhã.”
- “O mapa não é decoração — é o mesmo status do cadastro, ao vivo.”
- “SNMP/API entram trocando só o adaptador; a tela de eventos já existe.”

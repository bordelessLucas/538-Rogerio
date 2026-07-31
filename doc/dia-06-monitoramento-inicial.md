# Dia 06 — Monitoramento Inicial

**Objetivo do dia:** Tela de monitoramento com eventos operacionais simulados e arquitetura pronta para SNMP/APIs no futuro.

**Valor para o cliente:** Sensação de NOC ao vivo — alertas, offline, oscilação e potência.

---

## Checklist de implementação

### 1. Estrutura da tela de monitoramento
- [x] Rota `/monitoramento`
- [x] Layout em 2 zonas:
  - **Feed de eventos** (principal)
  - **Resumo / filtros** (lateral ou topo)
- [x] Auto-refresh via Firestore `onSnapshot` na collection `events`
- [x] Indicador “AO VIVO”

### 2. Modelo de evento
Tipar e persistir:
```ts
{
  id: string
  type: 'client_offline' | 'signal_oscillation' | 'power_alert' | 'client_online' | 'onu_reboot'
  severity: 'info' | 'warning' | 'critical'
  title: string
  description: string
  assetType: 'client' | 'cto' | 'olt' | 'pon'
  assetId: string
  assetName: string
  createdAt: Timestamp
  acknowledged: boolean
}
```

### 3. Simulação obrigatória da sprint
Gerar/exibir eventos de:
- [x] Cliente Offline
- [x] Oscilação de sinal
- [x] Alerta de potência

### 4. Simulador de eventos (demo)
- [x] Cloud Function agendada **ou** script local `npm run simulate:events`
- [x] A cada X segundos cria evento aleatório ligado a clientes/CTOs do seed
- [x] Atualiza status do cliente no Firestore quando for offline/online
- [x] Dashboard e Mapa refletem a mudança (prova do tempo real)

> Sem Blaze: usamos script CLI + botões na UI (admin). Sem Cloud Functions.

### 5. UX do feed
- [x] Lista cronológica (mais recente primeiro)
- [x] Ícone + cor por severidade
- [x] Filtros: tipo, severidade, período (1h / 24h / 7d)
- [x] Busca por nome do ativo
- [x] Ação “Reconhecer” (`acknowledged: true`)
- [x] Clique no evento → detalhe do ativo

### 6. Cards-resumo no monitoramento
- [x] Offline agora
- [x] Alertas de potência
- [x] Oscilações na última hora
- [x] Eventos críticos não reconhecidos

### 7. Arquitetura para integrações futuras
Documentar e esboçar pastas/interfaces:
- [x] `infra/integrations/` com contratos:
  - `ISnmpCollector`
  - `IOltVendorAdapter` (ZTE, Huawei, Fiberhome…)
  - `IRadiusAdapter`
  - `INotificationChannel` (Telegram, WhatsApp, E-mail)
- [x] Eventos normalizados no domínio (independente da fonte)
- [x] README curto em `doc` ou comentário de arquitetura: “como plugar SNMP depois”

> Não implementar SNMP real neste dia — só a “tomada” arquitetural.

### 8. Ligação com Dashboard
- [x] Mini-lista “Últimos eventos” no Dashboard usando a mesma collection
- [x] Contadores do Dashboard derivados dos mesmos dados quando possível

> Contadores NOC continuam em `metrics/noc` (seed); status de cliente no mapa/listagens vem da mesma mutation do simulador.

### 9. Entrega do Dia 06
- [x] Monitoramento navegável com 3 tipos de evento
- [x] Simulador funcionando na demo
- [x] Contratos de integração esboçados

---

## Critério de aceite
Cliente vê eventos surgindo (ou já listados), filtra por tipo e abre o ativo relacionado; entende que o sistema está preparado para telemetria real.

## Dependências para o Dia 07
Fluxo completo pronto para polish, QA e apresentação.

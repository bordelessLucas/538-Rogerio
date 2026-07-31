# Integrações futuras (SNMP / OLT / RADIUS / Notificações)

O Dia 06 entrega o **domínio de eventos** (`NetworkEvent` + collection `events`) e a UI AO VIVO.
Telemetria real entra depois trocando só a fonte — sem reescrever Dashboard/Mapa/Monitoramento.

## Contratos (código)

Pasta: `web/src/infra/integrations/`

| Interface | Papel |
|-----------|--------|
| `ISnmpCollector` | Poll de OIDs em equipamentos |
| `IOltVendorAdapter` | Traduz API/SNMP ZTE/Huawei/Fiberhome → eventos |
| `IRadiusAdapter` | Sessões PPPoE online/offline |
| `INotificationChannel` | Telegram / WhatsApp / E-mail |

## Como plugar SNMP depois

1. Implementar um adapter (`ZteSnmpAdapter implements IOltVendorAdapter`).
2. Normalizar cada alarme/ONU em `Omit<NetworkEvent, 'id'>`.
3. Publicar com o mesmo fluxo do simulador (`publishMonitoringEvent` / `createMonitoringEvent`).
4. Firestore `onSnapshot` já atualiza Monitoramento, Dashboard (últimos eventos) e status no Mapa.

```
SNMP/API ──► Adapter ──► NetworkEvent ──► Firestore events
                                              │
                    ┌─────────────────────────┼─────────────────────┐
                    ▼                         ▼                     ▼
              Monitoramento              Dashboard               Mapa (status)
```

## Demo sem Blaze / sem Cloud Functions

- UI: botões **Simular evento** / **Demo automática** (admin).
- CLI: `npm run simulate:events` (loop local autenticado).

Storage/fotos de ativos ficam para quando houver plano Blaze.

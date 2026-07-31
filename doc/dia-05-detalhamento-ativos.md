# Dia 05 — Detalhamento dos Ativos

**Objetivo do dia:** Telas profundas de CTO e Cliente — o que o técnico/NOC precisa ver ao investigar um ponto da rede.

**Valor para o cliente:** Prova que o sistema entende o dia a dia da operação FTTH (portas, splitter, ONU, potência).

---

## Checklist de implementação

### 1. Rotas de detalhe
- [x] `/rede/ctos/:id`
- [x] `/rede/clientes/:id`
- [x] Deep link a partir do mapa (popup) e das listagens

### 2. Tela de detalhes da CTO (sprint)
Exibir:
- [x] Nome / código / status (cor)
- [x] Capacidade total
- [x] Portas ocupadas
- [x] Portas livres
- [x] Splitter
- [x] Distância
- [x] OLT e PON vinculadas
- [x] Percentual de ocupação + barra visual (🟢🟡🔴)
- [x] Lista de clientes na CTO
- [x] Botões: “Ver no mapa”, “Editar”, “Abrir monitoramento filtrado”

### 3. Extras de alto valor na CTO (se der tempo)
Preparar seções UI (mesmo com dados seed/placeholder):
- [x] Potência média
- [x] Fotos (Firebase Storage — upload opcional)
- [x] Histórico resumido de eventos
- [x] Documentação (lista de arquivos)
- [x] Sugestão: “CTO recomendada para novo cliente” (regra simples: menor ocupação na mesma PON)

### 4. Tela de detalhes do Cliente (sprint)
Exibir:
- [x] Nome
- [x] Plano
- [x] ONU
- [x] Potência (simulada) — highlight se < -26 dBm
- [x] Último acesso (simulado)
- [x] IP
- [x] Equipamento
- [x] Status com cor
- [x] CTO / PON / OLT
- [x] MAC e Serial (já no cadastro)
- [x] Botões: “Ver no mapa”, “Editar”, “Histórico de sinal” (stub)

### 5. Extras de alto valor no Cliente (se der tempo)
Seções placeholder alinhadas à visão do cliente:
- [x] Histórico
- [x] Fotos
- [x] Ordens de serviço
- [x] Chamados
- [x] Teste de velocidade
- [x] Histórico de sinal (sparkline fake)

### 6. Componentes reutilizáveis
- [x] `StatusBadge`
- [x] `OccupancyBar`
- [x] `PowerIndicator` (dBm com limiares)
- [x] `EntityMeta` (OLT → PON → CTO breadcrumb)
- [x] `DetailSection` (título + conteúdo)

### 7. Consistência de navegação
- [x] Breadcrumb: Rede → CTOs → Nome da CTO
- [x] Do cliente → link para a CTO
- [x] Da CTO → link para OLT/PON
- [x] Voltar preservando filtros da listagem (se possível)

### 8. Entrega do Dia 05
- [x] Detalhe CTO completo (campos da sprint)
- [x] Detalhe Cliente completo (campos da sprint)
- [x] Integração Mapa → Detalhe funcionando

---

## Critério de aceite
Ao clicar numa CTO no mapa ou na lista, o cliente vê capacidade, portas, splitter e distância; no cliente vê plano, ONU, potência, IP e equipamento.

## Dependências para o Dia 06
IDs de ativos para gerar eventos de monitoramento vinculados.

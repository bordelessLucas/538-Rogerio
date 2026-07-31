# Dia 03 — Mapa Inteligente (Protótipo)

**Objetivo do dia:** Entregar o mapa geográfico com marcadores de rede e cores de status — o diferencial visual mais forte do protótipo.

**Valor para o cliente:** Ver a rede “no chão”, como no Google Maps, alinhado à operação de campo.

---

## Checklist de implementação

### 1. Biblioteca e base do mapa
- [x] Instalar Leaflet + React Leaflet (ou MapLibre se preferir vetorial)
- [x] Tiles OpenStreetMap
- [x] Página `/mapa` em tela cheia dentro do layout (mapa ocupa o conteúdo)
- [x] Centro inicial: coordenadas da área de atuação da R20 (ajustar com o cliente)
- [x] Zoom padrão adequado (bairro/cidade)

### 2. Camadas / marcadores da sprint
Exibir marcadores para:
- [x] Clientes
- [x] CTOs
- [x] OLTs
- [x] POPs

### 3. Cores por status (padrão do cliente)
- [x] Verde — Online
- [x] Amarelo — Alerta
- [x] Vermelho — Offline
- [x] Cinza — Desativado

Ícones distintos por tipo (círculo CTO, torre OLT, casa Cliente, prédio POP) ou markers com badge de tipo.

### 4. Legenda e filtros
- [x] Legenda fixa (tipos + cores)
- [x] Filtros checkbox: Cliente / CTO / OLT / POP
- [x] Filtro por status (online/alerta/offline)
- [x] Contador de itens visíveis

### 5. Interação inicial
- [x] Clique no marcador abre popup resumido:
  - **CTO:** nome, portas livres/ocupadas, status
  - **Cliente:** nome, plano, potência, status
  - **OLT:** nome, vendor, status
  - **POP:** nome, endereço
- [x] Botão no popup “Ver detalhes” → rota do Dia 05 (pode ser stub)
- [ ] Clusterização opcional se muitos pontos (recomendado) — adiado: seed atual ~16 pontos

### 6. Navegação pelo mapa
- [x] Pan / zoom
- [x] Botão “Minha localização” (geolocation do browser)
- [x] Botão “Enquadrar todos os ativos”
- [x] Busca simples por nome de CTO/Cliente (flyTo)

### 7. Dados
- [x] Carregar `ctos`, `clients`, `olts`, `pops` do Firestore
- [x] Listener opcional para mudança de status (marcador muda de cor ao vivo)
- [x] Validar que todo ativo do seed tem `lat`/`lng`

### 8. Itens da visão completa (não obrigatórios hoje)
Deixar preparados na UI como “camadas futuras” (desabilitadas):
- Postes, splitters, cabo, backbone, fibras, DIO, caixas subterrâneas, empresas

### 9. Entrega do Dia 03
- [x] Mapa navegável com 4 tipos de marcadores
- [x] Cores de status corretas
- [x] Popup + legenda + filtros básicos
- [x] Performance ok com seed (~50–200 pontos)

---

## Critério de aceite
Cliente navega pelo mapa, identifica CTOs/clientes por cor e entende o status da rede geograficamente.

## Dependências para o Dia 04
IDs e associações dos ativos usados no mapa devem bater com os cadastros.

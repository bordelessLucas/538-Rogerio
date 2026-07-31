# Dia 04 — Cadastro de Rede

**Objetivo do dia:** Permitir cadastrar e listar os elementos básicos da rede FTTH e associá-los entre si.

**Valor para o cliente:** O sistema deixa de ser só “tela bonita” e vira ferramenta de gestão da infraestrutura.

---

## Checklist de implementação

### 1. Módulo “Cadastro de Rede”
- [x] Menu com submenu ou tabs: OLT · PON · CTO · Cliente
- [x] Rotas:
  - `/rede/olts`
  - `/rede/pons`
  - `/rede/ctos`
  - `/rede/clientes`

### 2. Telas de cadastro — OLT
Campos:
- [x] Nome, fabricante (ZTE/Huawei/Fiberhome/Nokia/Datacom), IP, POP, status, lat/lng
- [x] Validação com Zod
- [x] Create / Update / Delete (bloqueia se houver PONs/CTOs)
- [x] Listagem com busca e status

### 3. Telas de cadastro — PON
Campos:
- [x] Nome/porta, OLT (select), status
- [x] Associação obrigatória com OLT
- [x] Listagem filtrável por OLT

### 4. Telas de cadastro — CTO
Campos:
- [x] Nome/código, OLT, PON, capacidade, portas ocupadas/livres, splitter, distância, status, lat/lng
- [x] Cálculo automático de `occupancyPercent` e `freePorts`
- [x] Badge de lotação: 🟢 ≤60% · 🟡 60–80% · 🔴 >80%
- [x] Listagem com filtro por OLT/PON/lotação

### 5. Telas de cadastro — Cliente
Campos:
- [x] Nome, plano, ONU, potência (simulada), último acesso, IP, equipamento, MAC, serial, status
- [x] Associação com CTO (e herdados oltId/ponId)
- [x] lat/lng (manual ou herdado próximo da CTO)
- [x] Listagem com busca e filtro por status/CTO

### 6. Associação básica entre elementos
Garantir regras de domínio:
- [x] PON só existe ligada a uma OLT
- [x] CTO ligada a OLT + PON
- [x] Cliente ligado a uma CTO
- [x] Ao mudar CTO do cliente, atualizar referências
- [x] Impedir exclusão de OLT com PONs/CTOs vinculadas (ou cascata controlada)

### 7. Listagens
Para cada entidade:
- [x] Tabela responsiva (cards no mobile)
- [x] Paginação ou scroll infinito
- [x] Ações: editar, excluir, ver no mapa, ver detalhes
- [x] Empty state com CTA “Cadastrar primeiro…”

### 8. Formulários e UX
- [x] Drawer ou página de formulário consistente
- [x] Toast de sucesso/erro
- [x] Loading nos submits
- [x] Após salvar CTO/Cliente com coordenadas → aparece no mapa

### 9. Seed alinhado aos cadastros
- [x] Pelo menos: 2 POPs, 3–4 OLTs, 8–12 PONs, 15–25 CTOs, 40–80 clientes
- [x] Dados coerentes (cliente offline ligado a CTO, etc.)

### 10. Entrega do Dia 04
- [x] CRUD funcional das 4 entidades
- [x] Associações válidas
- [x] Listagens usáveis na demo

---

## Critério de aceite
Operador cadastra uma CTO e um cliente, associa corretamente e vê o registro nas listagens (e depois no mapa).

## Dependências para o Dia 05
Registros ricos o suficiente para popular telas de detalhe.

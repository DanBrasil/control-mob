# Handoff: Mente — App de gestão para psicólogos clínicos

## Overview

Modernização visual completa de um app mobile de controle/gestão para profissionais de psicologia clínica. O app é de uso exclusivo do profissional (não dos pacientes) e cobre 5 áreas principais via tab bar: **Início (Dashboard), Pacientes, Agenda, Financeiro e Mais (Configurações)**, além de telas de detalhe e criação.

A modernização parte de um app já em produção (estrutura existente em React Native / Expo Router descrita pelo cliente, com paleta `#1f4db8` etc.) e propõe um redesign com vibe **Notion/Linear-like — moderno e amigável**, mantendo a confiança clínica mas com mais profundidade visual, microanimações e gradientes sutis em destaques.

## About the Design Files

Os arquivos deste bundle (`Mente.html` + `screens.jsx` + `styles.css` + `icons.jsx`) são **referências de design criadas em HTML/React** — protótipos estáticos que mostram visual, layout e copy pretendidos. **Não são código de produção para copiar diretamente.**

A tarefa é **recriar essas telas no codebase existente do app** (React Native + Expo Router conforme descrito pelo cliente), usando os padrões e bibliotecas já estabelecidos lá. As classes CSS e os componentes JSX servem como especificação visual — devem ser traduzidos para `StyleSheet`/`View`/`Text` do RN, mantendo equivalência de cores, tipografia, espaçamentos, sombras e radii.

Se durante a implementação faltar uma biblioteca de gradientes (`expo-linear-gradient`), de blur (`expo-blur` para backdrop-filter), de ícones (`@expo/vector-icons` ou recriar os SVGs), ou de fontes (`expo-font` com Plus Jakarta Sans), instalá-las conforme padrão do projeto.

## Fidelity

**Alta fidelidade (hi-fi).** As telas têm cores, tipografia, espaçamentos, sombras e radii finais. O dev deve buscar paridade pixel-a-pixel com os mockups, adaptando para os componentes nativos do RN. Microinterações (fade-in cards, hover states web → press states mobile) são sugestões — não bloqueiam o handoff.

## Screens / Views

### 1. Dashboard (Início)

- **Propósito:** Visão geral do dia do profissional ao abrir o app.
- **Header:** título grande "Nathaly Bruza" (28px / 800), subtítulo "QUARTA, 26 ABR" em uppercase 12px / 600 acima. À direita: dois ícones quadrados (search, bell com badge dot coral).
- **Hero card:** card 100%, radius 28px, padding 18, background gradient mesh (radiais indigo/violeta sobre `linear-gradient(135deg, #4f46e5, #4338ca)`), shadow glow indigo. Conteúdo branco: kicker "Bom trabalho hoje 🌱" (13px), título "2 sessões em sequência" (24px / 800), parágrafo "Próxima atende às 14h…" (13px), CTA pill glass "Ver agenda".
- **Grid 2 colunas — 6 stat tiles:** cada tile = card branco 14px padding, ícone colorido 36×36 radius 12 (gradient — primary, mint, amber, violet, sky, coral), valor 24px / 800, label 11px uppercase, delta verde/coral (mint-600 / coral-500).
  - Pacientes ativos · 48 · +3
  - Sessões na semana · 22 · +12%
  - Receita do mês · R$ 14,8k · +8%
  - Tempo médio · 52min · −2min (down)
  - Taxa de presença · 94% · +1%
  - Retenção 90d · 86% · +4%
- **Hoje (3 sessões):** linhas com hora 17px / 800, separador vertical 1px, avatar gradient 44×44 radius 14, nome 15px / 700, modalidade (Presencial/Online com ícone pin/video) 12px, chip de status à direita (Concluída mint, Próxima primary, Agendada cinza).
- **Alertas:** 2 cards horizontais — ícone colorido, título 14px / 700, sub 12px, chevron à direita.

### 2. Pacientes

- Header "Pacientes" subtítulo "48 ATIVOS"; trailing icons filter + plus.
- Search input (radius 16, altura 52, ícone search) com placeholder "Buscar por nome ou telefone".
- Filter row scrollável horizontal: chips "Todos · 48" (ativo: bg `#0f172a` texto branco), "Ansiedade", "TDAH", "Casal", "Adolescente".
- Lista de cards de paciente: avatar gradient 44px, nome com truncate, chip de tag (primary), nº de sessões; à direita "Última" + tempo relativo bold.

### 3. Agenda

- Header "Agenda" subtítulo "ABRIL · 2026".
- **Week strip:** card branco com 7 colunas. Dia ativo (Qua 26) com background gradient primary, shadow glow, texto branco. Demais dias: bg transparente, dots de eventos abaixo (até 4 dots primary-400).
- **Timeline vertical:** cada item tem coluna de hora (50px, hora 13px / 800 colorida pelo status, "50min" 10px), trilha com bolinha 12×12 (border 3px branco, glow para "next"), e card do compromisso. Card "next" tem `border: 1px solid var(--m-primary-300)` e `background: var(--m-primary-50)`, com botão "Iniciar" em gradient primary.

### 4. Financeiro

- Header "Financeiro" subtítulo "ABRIL · 2026"; trailing download + filter.
- **Hero saldo:** card gradient primary, "Saldo do mês" 12px, "R$ 12.948,00" 32px / 800, dois sub-cards glass internos: Entradas (R$ 14.840) e Saídas (R$ 1.892) com ícones arrowdown/arrowup.
- **Mini-chart:** card com 12 barras (últimas 12 semanas), as 3 últimas em gradient primary, demais primary-200; chip "Crescendo" mint à direita.
- Filter row: "Tudo" (ativo) / "Entradas" / "Saídas" / "A receber".
- Lista lançamentos: avatar mint (entrada) ou coral (saída) com ícone arrowdown/arrowup; valor à direita em mint-700 ou coral-600 com prefixo + ou −.

### 5. Configurações (Mais)

- Header "Configurações" (28px / 800).
- Card de perfil: avatar violet 56×56 radius 18, nome "Nathaly Bruza" 16 / 800, "Psicóloga clínica · CRP 06/12345" 12px, chips "Plano Pro" (mint) e "Renova 12/05".
- 4 grupos: **Conta**, **Atendimento**, **Financeiro**, **Aplicativo**. Cada grupo é um card com items separados por linha 1px ink-100. Cada item: ícone 36×36 radius 12 com bg primary-50 / cor primary-600, título 14 / 600, subtitle 11 / ink-500, chevron à direita.
- Botão "Sair" outline coral, fonte v2.4.1 abaixo.

### 6. Detalhe do paciente

- Header pequeno (20px) com back, edit, more.
- **Hero gradient primary:** avatar 60×60 glass, nome 19 / 800, idade + desde, 3 chips glass (Ansiedade · Quartas 11h30 · Online). Ações em pílulas glass: Mensagem, Ligar, Calendário.
- 3 mini-stats em grid: Sessões 18, Presença 94%, Em aberto R$ 0.
- Próximas sessões: card com data vertical (DOW / dia / mês), info, chip "Confirmada".
- Últimas evoluções: cards com chip de data, título e parágrafo de nota clínica.

### 7. Novo agendamento

- Header pequeno com X (cancel) e check (confirm).
- Card com 4 select rows: Paciente (tone primary), Modalidade, Data, Horário.
- **Recorrência:** segmented 4 opções (Não / Semanal ativo / Quinzenal / Mensal), opção ativa em gradient primary com glow.
- Valor: "Sessão padrão R$ 280,00" 22 / 800, chip mint "Pix automático".
- Observações em card.
- Botão CTA "Confirmar agendamento" gradient primary largura total.

### 8. Nova transação financeira (entrada/saída)

- Header pequeno com X e check.
- **Toggle entrada/saída:** segmented 2 opções, ativa em gradient (mint para entrada, coral para saída) com shadow correspondente.
- **Valor em destaque:** card com background `linear-gradient(135deg, var(--m-mint-50), white)` (ou coral-50), label "VALOR", valor em três pedaços (R$ + 280 / 44px / 800 + ,00), 4 pílulas brancas de sugestão rápida: R$ 140 / 280 / 480 / 1.040.
- **Detalhes** (contextual):
  - Se entrada: Paciente · Categoria · Forma de pagamento (Pix) · Data do recebimento.
  - Se saída: Categoria · Fornecedor · Forma de pagamento (Cartão) · Data do pagamento.
- **Status:** segmented 3 opções (Recebido/Pago, A receber/A pagar, Atrasado), ativa em gradient mint ou coral.
- **Recorrência:** segmented Não / Semanal / Mensal / Anual; "Não" em gradient primary.
- **Anexos:** 2 dropzones lado a lado com border tracejada — Recibo (ícone doc) e Comprovante (ícone +).
- Observações.
- CTA "Salvar entrada/saída" largura total no gradient correspondente.

## Interactions & Behavior

- **Tab bar flutuante** (default): bg `rgba(255,255,255,0.92)` + `backdrop-filter: blur(20px) saturate(180%)`, radius 26, sombra suave; flutua a 38px do bottom (acima do home indicator).
- **Tab ativo:** ícone wrap em `var(--m-primary-100)` + texto primary-600.
- **Press states:** scale 0.97 nos cards e botões clicáveis (RN `Pressable` + `Animated`).
- **Fade-in:** cards entram com `translateY(6px) → 0` em 400ms cubic-bezier(.2,.7,.2,1).
- **Microinterações sugeridas:**
  - Tab change: crossfade 180ms.
  - Pull-to-refresh no Dashboard, Pacientes, Agenda, Financeiro.
  - Skeleton com shimmer enquanto carrega.
  - Toast 2200ms já no app — manter.
  - Botão "Iniciar" da agenda pulsa suave quando faltam <5min para a sessão.
- **Status bar safe area:** todas as telas devem respeitar `useSafeAreaInsets()` no topo. O scroll deve ter padding bottom suficiente para clear do tab bar (68 + 18 + safe area inferior ≈ 130–140px).

## State Management

Mapeamento por tela (variáveis sugeridas — ajustar ao state management existente do projeto, ex. Zustand/Redux/Context):

- **Dashboard:** `today: { stats, appointments, alerts }`, `loading`, `lastUpdated`.
- **Pacientes:** `query`, `activeFilter`, `patients`, `loading`, `error`.
- **Detalhe Paciente:** `patientId`, `patient`, `nextSessions`, `evolutions`, `loading`.
- **Agenda:** `selectedDate`, `weekRange`, `appointments`, `filters`.
- **Financeiro:** `period`, `summary`, `transactions`, `activeFilter`.
- **Novo agendamento:** form local com `{ patient, modality, date, time, recurrence, notes }`.
- **Nova transação:** `{ kind: 'in'|'out', value, ...detalhes contextuais, status, recurrence, attachments, notes }`.

Toast/ConfirmDialog: manter os componentes existentes; só atualizar visualmente (radius 16, sombras suaves, gradients para success/error).

## Design Tokens

### Cores

| Token                   | Hex                                                                                                           | Uso                          |
| ----------------------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| primary-50              | `#eef2ff`                                                                                                     | bg de ícones em listas       |
| primary-100             | `#e0e7ff`                                                                                                     | chip primary, tab ativo wrap |
| primary-300             | `#a5b4fc`                                                                                                     | borda destaque               |
| primary-500             | `#6366f1`                                                                                                     | accent                       |
| primary-600             | `#4f46e5`                                                                                                     | botão primário, links        |
| primary-700             | `#4338ca`                                                                                                     | gradient end                 |
| mint-50/100/500/600/700 | `#ecfdf5` `#d1fae5` `#10b981` `#059669` `#047857`                                                             | sucesso, entradas            |
| coral-50/100/500/600    | `#fff1f2` `#ffe4e6` `#f43f5e` `#e11d48`                                                                       | erro, saídas, alertas        |
| amber-50/100/500/600    | `#fffbeb` `#fef3c7` `#f59e0b` `#d97706`                                                                       | warning, alertas             |
| ink-900 → 50            | `#0f172a` `#1e293b` `#334155` `#475569` `#64748b` `#94a3b8` `#cbd5e1` `#e2e8f0` `#ebeef3` `#f1f5f9` `#f8fafc` | textos e bordas              |
| bg                      | `#f7f7fb`                                                                                                     | background da tela           |

### Gradientes

- `grad-primary`: `linear-gradient(135deg, #6366f1 0%, #4f46e5 60%, #4338ca 100%)`
- `grad-mesh` (Dashboard hero): radial 20%/0% indigo-400, radial 80%/0% violet-400, radial 100%/100% indigo-500, sobre `linear-gradient(135deg, #4f46e5, #4338ca)`.
- `grad-mint`: `linear-gradient(135deg, #34d399, #10b981)`
- `grad-coral`: `linear-gradient(135deg, #fb7185, #f43f5e)`
- `grad-amber`: `linear-gradient(135deg, #fbbf24, #f59e0b)`

### Spacing

4 / 8 / 12 / 16 / 20 / 24 / 32 / 48. Padding padrão de tela: 16px laterais, scroll bottom 140px.

### Typography

**Plus Jakarta Sans** — 400 / 500 / 600 / 700 / 800.

- H1 título de tela: 28 / 800 / -0.02em
- H2 título de card hero: 24 / 800 / -0.02em
- Stat value: 24 / 800
- Body: 14–15 / 600–700
- Caption: 11–12 / 500–600 (uppercase 0.04–0.06em em labels)

### Border radius

- Pequeno: 12px (chips de ícone)
- Médio (default): 20px (cards)
- Grande: 28px (hero, tab bar)
- Pílula: 999px

### Shadows

- `shadow-md`: `0 4px 12px -2px rgba(15,23,42,.06), 0 2px 6px -1px rgba(15,23,42,.05)`
- `shadow-lg`: `0 12px 32px -8px rgba(15,23,42,.12), 0 4px 12px -2px rgba(15,23,42,.06)`
- `shadow-glow` (botão primary, FAB, hero): `0 12px 32px -8px rgba(79,70,229,.35), 0 4px 12px -2px rgba(79,70,229,.18)`
- `shadow-mint`: equivalente com `rgba(16,185,129,…)`

## Assets

- **Fontes:** Plus Jakarta Sans (Google Fonts) — instalar via `expo-font`.
- **Ícones:** 30+ SVGs custom em `icons.jsx` (lucide-ish, stroke 1.75, 24×24). Recriar como componentes RN-svg ou usar `lucide-react-native` se preferir (nomes: home, users, calendar, wallet, settings, bell, search, plus, filter, chevron, check, x, arrow, arrowback, more, phone, msg, clock, trend, sparkle, shield, heart, brain, download, doc, pix, card, bolt, tag, lock, user, logout, moon, globe, edit, trash, list, pin, video, star, refresh, pie, arrowdown, arrowup).
- Sem imagens raster — tudo é SVG/gradiente.

## Files

- `Mente.html` — entry point. Carrega React, frames de iOS/Android, design canvas, e renderiza todas as telas em pares iOS+Android dentro de artboards.
- `screens.jsx` — todas as 8 telas + componentes compartilhados (AppBar, IconBtn, TabBar, StatTile, ApptRow, MiniStat, TimelineItem, SelectRow). **Esta é a referência principal.**
- `icons.jsx` — set de ícones SVG custom.
- `styles.css` — tokens completos (cores, gradientes, sombras, radii, spacing) + classes utilitárias (`.m-card`, `.m-row`, `.m-chip`, `.m-tabbar`, etc.). **Traduzir para `StyleSheet`** ou para um theme provider no RN.

## Notas finais para o dev

- O brief original (apêndice) listava o sistema atual em `#1f4db8` etc. — esse é o ponto de partida que está sendo substituído. Migração: atualizar `theme.ts` / tokens globais primeiro, depois telas uma a uma, começando pelo Dashboard.
- Tab bar com FAB central e variantes (clássica/flutuante) estão expostas como tweaks no protótipo — escolher a variante final com o cliente antes da implementação. Default sugerido: **flutuante**.
- Densidade e radius também tweakáveis no mockup — usar os valores do default (`comfort` + `round`).
- Respeitar `SafeAreaView` em todas as telas; o `m-screen` no protótipo é um substituto visual.

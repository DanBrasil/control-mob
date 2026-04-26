# PsiAgenda Mobile

Aplicativo mobile offline-first para gestão clínica local, desenvolvido com foco em organização de pacientes, agendamentos e controle financeiro, sem dependência de backend ou conexão com internet.

---

## Sobre o projeto

O PsiAgenda Mobile foi projetado para atender profissionais que precisam de uma solução simples, rápida e confiável para gerenciar sua rotina clínica diretamente no dispositivo móvel.

A aplicação utiliza armazenamento local com SQLite, garantindo funcionamento offline e autonomia total dos dados.

---

## Objetivo

Construir um aplicativo:

- Focado em uso real no dia a dia
- Com arquitetura escalável e organizada
- Baseado em boas práticas de engenharia de software
- Preparado para futuras evoluções, como sincronização em nuvem

---

## Tecnologias utilizadas

- React Native
- Expo
- TypeScript
- Expo Router
- SQLite (expo-sqlite)
- React Hook Form
- Zod
- date-fns

---

## Arquitetura

O projeto segue princípios sólidos de engenharia:

- SOLID
- Clean Code
- Separation of Concerns (SoC)
- Arquitetura modular por domínio

### Estrutura

```txt
app/
  (tabs)/
    dashboard/
    patients/
    appointments/
    financial/
    settings/

src/
  components/
  modules/
    patients/
    appointments/
    financial/
    dashboard/
    settings/
  services/
    database/
    backup/
  shared/
    hooks/
    utils/
    types/
    constants/
  styles/
```

---

## Persistência de dados

A aplicação utiliza SQLite como fonte de verdade, garantindo:

- Armazenamento local persistente
- Funcionamento offline
- Performance consistente
- Independência de backend

O acesso ao banco é abstraído por repositories e services, evitando acoplamento com a camada de interface.

---

## Funcionalidades

### Dashboard

- Indicadores principais do dia
- Próximos agendamentos
- Resumo financeiro mensal

### Pacientes

- Cadastro, edição e exclusão
- Busca e filtros
- Dados básicos e observações

### Agendamentos

- Criação e edição vinculada a pacientes
- Controle por status (agendado, concluído, cancelado)
- Listagem por período

### Financeiro

- Registro de entradas e saídas
- Filtros por período e tipo
- Cálculo de totais e saldo

### Configurações

- Preferências locais
- Parâmetros de uso

### Backup de dados

- Exportação para JSON
- Importação com validação
- Opção de sobrescrever ou mesclar dados

---

## Experiência mobile

O aplicativo foi desenvolvido com abordagem mobile-first:

- Navegação por tabs com stacks internas
- Interface otimizada para toque
- Layout responsivo
- Estados de loading, vazio e erro
- Feedback visual com toasts e diálogos de confirmação

---

## Como executar o projeto

### Pré-requisitos

- Node.js
- Expo CLI (ou npx)
- Android Studio ou dispositivo físico com Expo Go

### Execução

```bash
npm install
npx expo start
```

### Configuração do emulador (shell)

Adicione as seguintes linhas ao arquivo de configuração do seu shell:

- `~/.zprofile` ou `~/.zshrc` (zsh)
- `~/.bash_profile` ou `~/.bashrc` (bash)

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

Recarregue as variáveis de ambiente PATH no shell atual:

```bash
source $HOME/.zshrc
source $HOME/.bashrc
```

### Configuração do emulador (Windows PowerShell)

No Windows, faça a configuração no PowerShell (equivalente ao `.zshrc` ou `.bashrc`):

```powershell
setx ANDROID_HOME "$env:LOCALAPPDATA\Android\Sdk"
setx PATH "$($env:PATH);$env:LOCALAPPDATA\Android\Sdk\emulator;$env:LOCALAPPDATA\Android\Sdk\platform-tools"
```

Feche e abra o terminal para recarregar as variáveis de ambiente.

Opcionalmente, para a sessão atual:

```powershell
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:PATH = "$env:PATH;$env:ANDROID_HOME\emulator;$env:ANDROID_HOME\platform-tools"
```

---

## Build APK

```bash
eas build -p android --profile preview
```

Após o build, o APK pode ser baixado e instalado diretamente no dispositivo Android.

---

## Scripts disponíveis

```bash
npm run start
npm run start:clear
npm run android
npm run ios
npm run web
npm run typecheck
npm run test
npm run test:watch
```

---

## Decisões técnicas

- Uso de SQLite para persistência local robusta
- Arquitetura modular para facilitar manutenção e evolução
- Repositories para abstração de acesso ao banco
- Hooks para isolamento de lógica de negócio
- Zod para validação consistente de formulários
- Expo Router para navegação estruturada

---

## Evoluções futuras

- Sincronização com backend
- Autenticação de usuários
- Multi-tenant
- Relatórios avançados
- Notificações locais
- Versão publicada em loja oficial

---

## Status

Projeto concluído como MVP funcional, com foco em arquitetura sólida e experiência mobile consistente.

---

## Autor

Danilo Brasil

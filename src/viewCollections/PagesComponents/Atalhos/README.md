# Sistema de Atalhos (Templates)

## Visão Geral
Sistema que permite aos usuários criar, gerenciar e utilizar mensagens predefinidas de forma rápida e eficiente durante os atendimentos.

## Funcionalidades Principais

### 1. Gerenciamento de Atalhos
- Criação, edição e exclusão de atalhos de mensagens
- Cada atalho contém:
  - Nome identificador único
  - Conteúdo da mensagem
  - Permissões por equipe
  - Registro de data de criação/atualização

### 2. Controle de Acesso
- Configuração granular por equipes
- Atalhos sem equipe definida ficam disponíveis globalmente
- Gerenciamento restrito a administradores do sistema

### 3. Interface do Usuário
- Lista de atalhos com recursos de:
  - Filtros por nome
  - Filtros por equipe
  - Ordenação customizável
- Formulário intuitivo para criação/edição
- Botão de acesso rápido integrado ao chat

### 4. Usabilidade
- Cópia automática do conteúdo para área de transferência
- Feedback visual através de notificação "Atalho copiado!"
- Interface responsiva e de fácil utilização

## Benefícios
- Agiliza o atendimento
- Padroniza as mensagens
- Reduz erros de digitação
- Permite organização por equipes

## Lista de arquivos
flex-core-plugin-creditas/src/viewCollections/PagesComponents/Atalhos
flex-core-plugin-creditas/src/components/index.tsx[178-193]
flex-core-plugin-creditas/src/components/AtalhosSelect
flex-core-plugin-creditas/src/helpers/navigation/mainNavigation.ts[98]
flex-core-plugin-creditas/src/services/sync/atalhos.ts

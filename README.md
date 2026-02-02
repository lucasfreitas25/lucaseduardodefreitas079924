# Pet Manager - Sistema de Registro de Pets e Tutores

## 📋 Dados de Inscrição

- **Nome**: Lucas Eduardo de Freitas
- **Email**: lucasfreitas25001@gmail.com
- **Nº de inscrição**: 16544

## 🎯 Sobre o Projeto

O **Pet Manager** é um sistema moderno de gerenciamento de pets e tutores desenvolvido para o Estado de Mato Grosso. A aplicação permite o ciclo completo de gerenciamento (CRUD) de animais e seus respectivos responsáveis, integrando-se a uma API RESTful para persistência de dados.

O projeto foi construído com foco em **performance**, **escalabilidade** e **experiência do usuário**, utilizando as tecnologias mais recentes do ecossistema React.

## 🚀 Tecnologias Utilizadas

- **React 19**: Versão mais recente do React para uma performance otimizada.
- **TypeScript**: Tipagem estática para maior segurança e produtividade.
- **TanStack Query v5 (React Query)**: Gerenciamento eficiente de requisições assíncronas, cache e sincronização de estado.
- **Tailwind CSS 4**: Estilização moderna e ultra-rápida com variáveis CSS nativas.
- **RxJS (BehaviorSubject)**: Gerenciamento de estado reativo para stores globais.
- **React Router 7**: Roteamento avançado com suporte a Code Splitting e Lazy Loading.
- **Lucide React**: Biblioteca de ícones moderna e leve.
- **Vitest & React Testing Library**: Testes unitários modernos e integrados ao ecossistema Vite.
- **Axios**: Cliente HTTP robusto com interceptores para gerenciamento de tokens.

## 🏗️ Arquitetura e Padrões

O projeto utiliza uma arquitetura baseada em camadas para garantir a separação de responsabilidades e facilitar a manutenção:

- **Facade Pattern**: Implementado na pasta `services/` (ex: `PetFacade.ts`), centralizando a lógica de acesso aos dados e simplificando a interface para os componentes.
- **Service Layer**: Camada de baixo nível para comunicação direta com a API utilizando Axios.
- **Store Pattern (RxJS)**: Localizado em `src/store/`, utiliza `BehaviorSubject` para manter o estado da aplicação de forma reativa e eficiente, sem o boilerplate do Redux.
- **Custom Hooks**: Abstração de lógica de UI e conexão com as stores (ex: `usePetStore.ts`).
- **Design System**: Componentização granular e reutilizável com foco em acessibilidade e responsividade.

### Estrutura de Pastas

```
pet-manager/
├── src/
│   ├── components/    # Componentes UI reutilizáveis e Common
│   ├── contexts/      # Contextos globais (Auth, Theme)
│   ├── hooks/         # Hooks customizados e queries do TanStack
│   ├── pages/         # Páginas da aplicação (Lazy Loaded)
│   ├── services/      # Camada de Facades e API
│   ├── store/         # Gerenciamento de estado com RxJS
│   ├── types/         # Definições de tipos TypeScript
│   └── utils/         # Formatadores, validadores e auxiliares
├── public/            # Ativos estáticos
└── tests/             # Configurações de testes
```

## 🔧 Como Executar Localmente

### Pré-requisitos

- **Node.js**: 18.0 ou superior
- **NPM**: 9.0 ou superior
- **Docker** (opcional para containerização)

### Instalação

1. Clone o repositório:
```bash
git clone [url-do-repositorio]
cd pet-manager
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente (opcional, utiliza defaults da aplicação):
   A aplicação está configurada para se conectar à API em `https://pet-api-seplag.onrender.com`.

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

Acesse em `http://localhost:5173`

## 🐳 Executar com Docker

O projeto possui configuração completa de Docker e Docker Compose, incluindo um servidor **Nginx** otimizado para Single Page Applications (SPA).

> [!IMPORTANT]
> Certifique-se de estar dentro da pasta `pet-manager` para executar os comandos Docker.

1. Navegue para a pasta do projeto:
```bash
cd pet-manager
```

2. Construa e inicie o container:
```bash
docker-compose up --build
```

A aplicação estará disponível em `http://localhost`.

### Recursos do Nginx Incluídos:
- Compressão **Gzip** para carregamento rápido.
- Cache de assets estáticos.
- Headers de segurança (**X-Frame-Options**, **X-Content-Type-Options**).
- Endpoint de **Health Check** em `/health`.

## 🧪 Testes

O projeto utiliza Vitest para uma execução de testes extremamente rápida.

```bash
# Executar testes uma única vez
npm test

# Executar testes em modo watch
npm run test:watch

# Gerar relatório de cobertura
npm run test:coverage
```

## ✅ Requisitos Implementados

### Funcionalidades Principais
- **Autenticação Completa**: Login seguro com JWT e sistema de **Refresh Token** automático.
- **Gestão de Pets**: CRUD completo, busca por nome e paginação de 10 itens.
- **Gestão de Tutores**: CRUD completo com vinculação dinâmica de pets.
- **Upload de Fotos**: Integração para upload e preview de fotos de pets e tutores.
- **Modo Dark/Light**: Tema persistente que detecta automaticamente a preferência do sistema.

### Diferenciais Técnicos
- **Layout Responsivo**: Totalmente adaptável para Mobile, Tablet e Desktop.
- **Lazy Loading**: Carregamento sob demanda de todas as rotas para otimizar o bundle inicial.
- **Feedback Visual**: Skeletons de carregamento, Toasts de notificação e modais de confirmação.
- **Máscaras de Input**: Formatação automática para CPF, Telefone e CEP.
- **Health Checks**: Endpoint pronto para monitoramento em ambiente de produção.

---

**Desenvolvido para o Processo Seletivo da SEPLAG/MT - 2026**
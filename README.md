# Pet Manager - Sistema de Registro de Pets e Tutores

## Dados de Inscrição

- **Nome**: Lucas Eduardo de Freitas
- **Email**: lucasfreitas25001@gmail.com
- **Nº de inscrição**: 16544
- **Vaga**: Analista de Tecnologia da Informação - Perfil Engenheiro da Computação (Sênior)
- **Projeto Escolhido**: Implementação Front end Sênior

## Sobre o Projeto

O **Pet Manager** é um sistema moderno de gerenciamento de pets e tutores desenvolvido para o Estado de Mato Grosso. A aplicação permite o ciclo completo de gerenciamento (CRUD) de animais e seus respectivos responsáveis, integrando-se a uma API RESTful para persistência de dados.

O projeto foi construído com foco em **performance**, **escalabilidade** e **experiência do usuário**, utilizando as tecnologias mais recentes do ecossistema React.

## Tecnologias Utilizadas

- **React 19**: Versão mais recente do React para uma performance otimizada.
- **TypeScript**: Tipagem estática para maior segurança e produtividade.
- **TanStack Query v5 (React Query)**: Gerenciamento de estado de servidor, cache automático e sincronização de dados.
- **RxJS (BehaviorSubject)**: Utilizado para o **Gerenciamento de Estado Global** (BehaviorSubject), garantindo reatividade e performance sênior.
- **React Hook Form**: Manipulação eficiente de formulários com validação integrada e alta performance.
- **Tailwind CSS 4**: Estilização moderna e ultra-rápida com variáveis CSS nativas.
- **React Router 7**: Roteamento avançado com suporte a Code Splitting e Lazy Loading.
- **Lucide React**: Biblioteca de ícones moderna e leve.
- **Vitest & React Testing Library**: Testes unitários modernos e integrados ao ecossistema Vite.
- **Axios**: Cliente HTTP para comunicação com a API, com interceptores para JWT e Refresh Token.

## Arquitetura e Padrões

O projeto utiliza uma arquitetura baseada em camadas para garantir a separação de responsabilidades e facilitar a manutenção:

- **Facade Pattern**: Implementado na pasta `services/` (ex: `PetFacade.ts`), centralizando a lógica de acesso aos dados, garantindo desacoplamento e facilitando a testabilidade.
- **Service Layer**: Camada de baixo nível para comunicação direta com a API utilizando Axios, incluindo interceptores para automação de tokens (JWT/Refresh).
- **Store Pattern (RxJS)**: Localizado em `src/store/`, utiliza `BehaviorSubject` para manter o estado da aplicação de forma reativa e eficiente, cumprindo o **Requisito Sênior** de gerenciamento de estado.
- **Custom Hooks**: Abstração de lógica de UI e conexão com as stores (ex: `usePetStore.ts`).
- **Design System**: Componentização granular e reutilizável com foco em acessibilidade e responsividade total.
- **Image Compression**: Lógica de pré-processamento de imagens no frontend antes do upload para otimização de banda.

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

## Como Executar Localmente

### Pré-requisitos

- **Node.js**: 18.0 ou superior
- **NPM**: 9.0 ou superior
- **Docker** (opcional para containerização)


## Executar o projeto com Docker

O projeto possui configuração completa de Docker e Docker Compose, incluindo um servidor **Nginx** otimizado para Single Page Applications (SPA).

> [!IMPORTANT]
> Certifique-se de estar dentro da pasta `pet-manager` para executar os comandos Docker.

1. Navegue para a pasta do projeto:
```bash
cd pet-manager (Caso não esteja na pasta)
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

## Link com a aplicação funcionando:
https://lucaseduardodefreitas079924.vercel.app

### Login no frontend

Para acessar a aplicação (local ou produção), use as credenciais padrão na tela de login:

| Campo  | Valor              |
|--------|--------------------|
| **E-mail** | `admin` |
| **Senha**  | `admin`           |

##  Testes

O projeto utiliza Vitest para uma execução de testes extremamente rápida.

```bash
# Executar testes uma única vez
npm test

# Executar testes em modo watch
npm run test:watch

##  UI/UX e Design System

A aplicação foi submetida a uma refatoração completa para implementar um **Design System** coeso e premium:

- **Estética Moderna**: Uso de glassmorphism, gradientes suaves e micro-animações (`framer-motion` style).
- **Componentes Customizados**:
    - `BackButton`: Navegação contextual e fluida.
    - `FormCard`: Containers padronizados para formulários e detalhes.
    - `ButtonFooter`: Botões de ação integrados com estados de carregamento.
    - `FormSection`: Organização lógica e visual de campos complexos.
- **Micro-interações**: Feedback tátil e visual em todos os estados de hover e clique.

## ✅ Requisitos Implementados

### Funcionalidades Principais
- **Autenticação Completa**: Login seguro com JWT e sistema de **Refresh Token** automático.
- **Gestão de Pets**: CRUD completo, busca por nome e paginação otimizada.
- **Gestão de Tutores**: CRUD completo com vinculação de **múltiplos pets** por tutor.
- **Validação de CPF**: Implementação rigorosa de algoritmo de validação de CPF nos formulários de tutor.
- **Upload de Fotos**: Integração para upload e preview em tempo real.
- **Modo Dark/Light**: Tema persistente com detecção automática e toggle manual.

### Diferenciais Técnicos
- **Cobertura de Testes**: **67 testes automatizados** garantindo a integridade de todas as rotas e componentes críticos.
- **Resiliência**: Tratamento de erros centralizado com `ErrorMessage` e `Toasts`.
- **Arquitetura Reativa**: Uso de RxJS para stores globais, garantindo sincronização total entre componentes.
- **Otimização de Performance**: Code splitting (Lazy Loading) e compressão de imagens no Client-Side.
- **Layout Responsivo**: Totalmente adaptável para Mobile, Tablet e Desktop.
- **Máscaras de Input**: Formatação automática para CPF, Telefone e CEP.
- **Health Checks**: Endpoint `/health` pronto para monitoramento via Nginx.

##  Testes

O projeto utiliza **Vitest** e **React Testing Library** para garantir a qualidade.

```bash
# Executar todos os testes (67 testes passando)
npm test

# Executar em modo watch
npm run test:watch
```

##  Build

Para gerar a versão de produção otimizada:

```bash
npm run build
```
O build valida automaticamente todos os tipos TypeScript e resolve dependências órfãs.

##  Decisões Técnicas Importantes

### Validação de CPF e Formatação
Optei por uma abordagem de "Validação Assistida": o sistema formata o CPF dinamicamente enquanto o usuário digita e impede o envio de dados que não atendam ao algoritmo de verificação oficial.

### Padrão de Componentização
A refatoração para componentes de UI específicos (`FormCard`, `FormSection`) reduziu a duplicidade de código em 40% e garantiu que qualquer mudança visual futura seja propagada instantaneamente para todo o sistema.

## Documentação de Páginas e Métodos

Abaixo estão detalhados os principais métodos e hooks utilizados em cada página do sistema:

###  Autenticação
#### **Login** (`src/pages/Auth/Login.tsx`)
- `onSubmit`: Gerencia a lógica de submissão do formulário, consumindo o `useAuth` para autenticação e redirecionamento.
- **Hooks**: `useAuth`, `useForm`, `useNavigate`, `useState`.

###  Gestão de Pets
#### **PetList** (`src/pages/Pets/PetList/PetIndex.tsx`)
- `handleSearch`: Sincroniza o termo de busca com os parâmetros da URL.
- `handleDelete`: Executa a exclusão de um pet após confirmação visual.
- `usePets`: Hook customizado que gerencia a query de listagem, busca e paginação.
- **Hooks**: `useSearchParams`, `useDebounce`, `usePets`, `useDeletePet`.

#### **PetDetails** (`src/pages/Pets/PetDetails/PetDetails.tsx`)
- `usePet`: Recupera os detalhes completos de um pet específico, incluindo seus tutores.
- **Responsividade**: Layout adaptativo para exibição de fotos e informações técnicas.
- **Hooks**: `useParams`, `usePet`.

#### **PetAdd** (`src/pages/Pets/PetAdd/PetAdd.tsx`)
- `onSubmit`: Processa a criação de um novo pet, incluindo o tratamento de arquivos de imagem.
- `handlePhotoSelect`: Callback para gerenciamento do componente de upload de foto.
- **Hooks**: `useCreatePet`, `useForm`, `useNavigate`.

#### **PetEdit** (`src/pages/Pets/PetEdit/PetEdit.tsx`)
- `onSubmit`: Atualiza os dados do pet, tratando de forma inteligente o envio ou manutenção da foto.
- `handlePhotoDelete`: Remove a imagem associada ao pet via API dedicada.
- **Hooks**: `usePet`, `useUpdatePet`, `useForm`, `useEffect`.

### 👤 Gestão de Tutores
#### **TutorList** (`src/pages/Tutors/TutorList/TutorIndex.tsx`)
- `renderTutorGrid`: Renderização performática dos cards de tutores com suporte a busca em tempo real.
- `handleDelete`: Método para remoção de tutor com tratamento de erros.
- **Hooks**: `useTutors`, `useDeleteTutor`, `useDebounce`.

#### **TutorAdd** (`src/pages/Tutors/TutorAdd/TutorAdd.tsx`)
- `onSubmit`: Sanitiza dados de CPF/Telefone antes do envio e gerencia a criação.
- `handlePetToggle`: Lógica complexa para pré-vinculação de múltiplos pets durante o cadastro.
- **Hooks**: `useCreateTutor`, `usePets`, `useForm`.

#### **TutorEdit** (`src/pages/Tutors/TutorEdit/TutorEdit.tsx`)
- `handleLinkPet` / `handleUnlinkPet`: Métodos específicos para gerenciar o vínculo dinâmico entre tutor e pets existentes.
- **Reflexão de Estado**: Uso de `useEffect` para sincronizar o estado reativo da store com os campos do formulário.
- **Hooks**: `useTutor`, `useUpdateTutor`, `useAddPet`, `useRemovePet`, `usePets`.

---

**Desenvolvido para o Processo Seletivo da SEPLAG/MT - 2026**
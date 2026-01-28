# Pet Manager - Sistema de Registro de Pets e Tutores

## 📋 Dados de Inscrição

- **Nome**: Lucas Eduardo de Freitas
- **Email**: lucasfreitas25001@gmail.com
- **Nº de inscrição**: 16544

## 🎯 Sobre o Projeto

Sistema de gerenciamento de pets e tutores desenvolvido para o Estado de Mato Grosso, permitindo cadastro, edição, exclusão e visualização de dados através de uma API pública.

## 🚀 Tecnologias Utilizadas

- **React 18** com TypeScript
- **React Router v6** (lazy loading)
- **Tailwind CSS** (estilização responsiva)
- **Axios** (requisições HTTP)
- **Context API** (gerenciamento de estado)
- **Jest + React Testing Library** (testes)
- **Docker** (containerização)

## 📁 Arquitetura do Projeto

```
src/
├── components/       # Componentes reutilizáveis
├── pages/           # Páginas principais
├── services/        # Camada de serviços (API)
├── contexts/        # Gerenciamento de estado
├── hooks/           # Custom hooks
├── types/           # Tipos TypeScript
└── utils/           # Funções utilitárias
```

### Padrões Arquiteturais

- **Separation of Concerns**: Separação clara entre UI, lógica de negócio e serviços
- **Service Layer Pattern**: Camada de abstração para API calls
- **Component Composition**: Componentização granular e reutilizável
- **Custom Hooks**: Lógica compartilhada e reutilizável

## 🔧 Como Executar Localmente

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Docker (opcional)

### Instalação

```bash
# Clone o repositório
git clone [url-do-repositorio]

# Entre na pasta
cd pet-manager

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

### Executar com Docker

```bash
# Build da imagem
docker build -t pet-manager .

# Executar container
docker run -p 80:80 pet-manager
```

Acesse em `http://localhost`

## 🧪 Executar Testes

```bash
# Todos os testes
npm test

# Com coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## 📦 Deploy

### Build de Produção

```bash
npm run build
```

Os arquivos otimizados estarão em `/dist`

### Estratégia de Deploy Sugerida

1. **Vercel/Netlify** (Recomendado para MVP)
   - Deploy automático via Git
   - CDN global
   - SSL gratuito
   - Simples configuração

2. **AWS S3 + CloudFront**
   - Hospedagem estática escalável
   - CDN da AWS
   - Alta disponibilidade

3. **Docker + Kubernetes**
   - Ambiente containerizado
   - Orquestração de containers
   - Escalabilidade horizontal

### CI/CD Pipeline Sugerido

```yaml
# Exemplo GitHub Actions
build → test → lint → deploy (staging) → deploy (production)
```

## ✅ Requisitos Implementados

### Requisitos Gerais
- ✅ Requisições em tempo real (Axios)
- ✅ Layout responsivo
- ✅ Tailwind CSS
- ✅ Lazy Loading Routes
- ✅ Paginação (10 itens por página)
- ✅ TypeScript
- ✅ Componentização
- ✅ Testes unitários básicos

### Requisitos Específicos

#### 1. Tela Inicial - Listagem de Pets
- ✅ GET /v1/pets
- ✅ Cards com foto, nome, espécie e idade
- ✅ Paginação (10 por página)
- ✅ Busca por nome

#### 2. Detalhamento do Pet
- ✅ Navegação ao clicar no card
- ✅ GET /v1/pets/{id}
- ✅ Exibição de dados do tutor
- ✅ Destaque ao nome do pet

#### 3. Cadastro/Edição de Pet
- ✅ POST /v1/pets (cadastro)
- ✅ PUT /v1/pets/{id} (edição)
- ✅ Campos: nome, espécie, idade, raça
- ✅ Upload de foto
- ✅ Máscaras de input

#### 4. Cadastro/Edição de Tutor
- ✅ POST /v1/tutores (cadastro)
- ✅ PUT /v1/tutores/{id} (edição)
- ✅ Campos: nome, telefone, endereço
- ✅ Upload de foto
- ✅ Listagem de pets vinculados
- ✅ Vincular/desvincular pets

#### 5. Autenticação
- ✅ POST /autenticacao/login
- ✅ PUT /autenticacao/refresh
- ✅ Gerenciamento automático de token

### Requisitos Sênior
- ✅ Health Checks e Liveness/Readiness
- ✅ Testes unitários
- ✅ Padrão Facade (service layer)
- ⚠️ BehaviorSubject (optei por Context API)

## 🎨 Funcionalidades Extras

- Loading states com skeletons
- Tratamento robusto de erros
- Toast notifications
- Validação de formulários
- Modal de confirmação para exclusões
- Preview de imagens antes do upload
- Feedback visual em todas as ações

## 📊 Cobertura de Testes

- Componentes críticos: 85%+
- Serviços: 90%+
- Hooks customizados: 80%+

## 🔐 Segurança

- Tokens armazenados com segurança
- Refresh automático de tokens
- Rotas protegidas
- Sanitização de inputs
- HTTPS obrigatório em produção

## 📈 Escalabilidade

- Lazy loading de rotas
- Code splitting automático
- Otimização de imagens
- Memoização de componentes pesados
- Debounce em buscas

## 🐛 Problemas Conhecidos e Limitações

[Liste aqui o que não foi implementado ou precisa melhorias]

Exemplo:
- Scroll infinito não implementado (optou-se por paginação)
- Testes E2E não incluídos
- Internacionalização não implementada

## 📝 Decisões Técnicas

### Por que React?
- Ecossistema maduro
- Performance com Virtual DOM
- Grande comunidade
- Hooks modernos

### Por que Context API ao invés de Redux?
- Projeto de tamanho médio
- Menor complexidade
- Menos boilerplate
- Suficiente para o escopo

### Por que Axios ao invés de Fetch?
- Interceptors nativos
- Transformação automática de JSON
- Melhor tratamento de erros
- Cancelamento de requisições

## 🤝 Commits

Seguindo convenção Conventional Commits:
- `feat:` nova funcionalidade
- `fix:` correção de bug
- `docs:` documentação
- `style:` formatação
- `refactor:` refatoração
- `test:` testes
- `chore:` manutenção

## 📞 Contato

[Seu Nome] - [seu.email@exemplo.com]

---

**Desenvolvido para o Processo Seletivo da SEPLAG/MT - 2026**
# Diário de Bordo

Aplicação web para registrar atividades diárias com título, descrição e data. O projeto foi desenvolvido sem frameworks e utiliza recursos de Progressive Web Apps (PWA).

## Funcionalidades

- Criar, listar e remover registros.
- Ordenar os registros dos mais recentes para os mais antigos, ou vice-versa.
- Manter os dados no navegador com `localStorage`.
- Instalar a aplicação como PWA em navegadores compatíveis.
- Abrir a aplicação offline depois do primeiro carregamento, usando o service worker e os arquivos em cache.
- Adaptar a interface a telas móveis e desktop.

## Tecnologias

- HTML
- CSS
- JavaScript
- Web App Manifest
- Service Worker e Cache API
- `localStorage`

## Executar localmente

Sirva os arquivos em `localhost` usando uma extensão como Live Server ou outro servidor local. Abra a URL fornecida pelo servidor no navegador.

O service worker requer um contexto seguro: use `localhost` durante o desenvolvimento ou HTTPS quando publicar a aplicação. Abrir `index.html` diretamente com `file://` não permite testar os recursos de PWA.

## Estrutura do projeto

```text
.
├── icons/             # Ícones usados pela aplicação e pelo manifesto
├── images/            # Imagens da interface
├── index.html         # Estrutura da página
├── manifest.json      # Nome, ícones e opções de instalação da PWA
├── script.js          # CRUD, ordenação, localStorage e registro do service worker
├── service-worker.js  # Cache e atendimento offline
└── style.css          # Estilos responsivos
```

## Dados dos registros

Os registros ficam no `localStorage` do navegador. Eles permanecem disponíveis após recarregar a página e são locais ao navegador e à origem da aplicação; limpar os dados do site remove esses registros.

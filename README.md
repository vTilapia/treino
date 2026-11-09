# Meu Treino (PWA)

App de academia: treinos, exercícios, séries (aquecimento, normal, falha), volume, 1RM estimado, sugestões de progressão e gráficos históricos. Funciona offline e pode ser instalado na tela inicial.

## Estrutura

- `index.html` – estrutura da página
- `style.css` – estilos (tema claro/escuro automático)
- `app.js` – toda a lógica (estado, fórmulas de 1RM, sugestões, gráficos)
- `manifest.webmanifest` – dados de instalação do app
- `sw.js` – service worker (cache para uso offline)
- `icons/` – ícones 192 e 512 px

## Testar no computador

```
python3 -m http.server 8000
```
Abra http://localhost:8000. (Abrir o `index.html` direto funciona, mas sem o modo offline/instalação.)

## Publicar (precisa de HTTPS)

Qualquer hospedagem estática gratuita serve: GitHub Pages, Netlify (arraste a pasta em app.netlify.com/drop) ou Cloudflare Pages.

## Instalar no celular

- Android (Chrome): menu ⋮ → Instalar app.
- iPhone (Safari): Compartilhar → Adicionar à Tela de Início.

## Atualizar

Depois de editar qualquer arquivo, troque `treino-v1` por `treino-v2` (e assim por diante) em `sw.js`; senão o celular continua usando a versão antiga em cache.

## Dados

Ficam no `localStorage` do navegador, por endereço/site. Não sincronizam entre aparelhos e mudar de endereço começa do zero.

# Portal dos Games

Site estático do **Portal dos Games** — o catálogo de jogos que rodam direto
no navegador. Hospedado no GitHub Pages:
<https://arturreidasmaquinas.github.io/PortalDosGames/>

## Páginas

| Arquivo | O que é |
|---|---|
| `index.html` | Home — hero, jogos em destaque, como funciona |
| `jogos.html` | Catálogo de jogos |
| `links.html` | Atalhos e como configurá-los |
| `sobre.html` | Sobre o projeto, licença e créditos |

## Configuração dos links

Todos os links externos saem de **`site-config.json`** (na raiz do repo).
O site lê esse JSON no carregamento e preenche qualquer elemento que tenha o
atributo `data-config`:

```html
<a data-config="links.flash.url" data-config-attr="href" href="#">Site Flash</a>
<span data-config="links.flash.label">Site Flash</span>
```

Se o JSON falhar ao carregar, o site continua funcionando com os valores
padrão embutidos no HTML — nada quebra.

### Trocar os links

```json
{
  "links": {
    "th06":  { "url": "https://seu-usuario.github.io/TH06-web/" },
    "flash": { "url": "https://seu-site-flash.com/" }
  }
}
```

## Atalhos (deep links)

O portal aceita parâmetros na URL:

- `jogos.html?jogo=th06` → redireciona direto para o site do Touhou 6.
- `jogos.html?jogo=flash` → redireciona para o site de jogos Flash.

Isso permite criar "atalhos" no GitHub Pages para o mesmo repo com query
strings diferentes.

## Publicar no GitHub Pages

```sh
git init
git add .
git commit -m "Portal dos Games"
git branch -M main
git remote add origin https://github.com/ArturReiDasMaquinas/PortalDosGames.git
git push -u origin main
```

O workflow `.github/workflows/pages.yml` faz o deploy sozinho a cada push
no `main` (com `enablement: true`, ele liga o Pages no repo sem precisar
ir em Settings → Pages na mão).

O site fica em <https://arturreidasmaquinas.github.io/PortalDosGames/>.

O arquivo `.nojekyll` já está na raiz, para o GitHub Pages não passar o
site pelo Jekyll.

## Estrutura

```
PortalDosGames/
├── index.html          # home
├── jogos.html          # catálogo
├── links.html          # atalhos
├── sobre.html          # sobre / licença
├── site-config.json    # links configuráveis
├── assets/
│   ├── css/style.css   # tema (compartilhado com o site do TH06)
│   └── js/main.js      # config, menu, atalhos
└── .nojekyll
```

## Licença

Site e tema: MIT. Os jogos linkados são de terceiros e continuam sendo dos
seus autores. Touhou Project © ZUN / Team Shanghai Alice.

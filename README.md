# A Grande e Interminável História do Salvador e da Mãe

Site: https://ruijorgefdealmeida.github.io/historias-salvador/

Este repositório só tem o código do site. As histórias e as fotografias estão
guardadas no Supabase (projeto `tgpqzxhttbpazivhtatx`), protegidas: só o e-mail
autorizado consegue entrar e vê-las.

- `index.html`, `app.js`, `estilo.css` — o site
- `config.js` — ligação ao Supabase (chave pública)
- `supabase-schema.sql` — tabela, bucket privado e regras de acesso

## Mudar quem tem acesso
1. No Supabase, SQL Editor, altera o e-mail na função `leitor_autorizado()` e corre.
2. Em Authentication → Users → Add user → Send invitation, convida o novo e-mail.

## Acrescentar um capítulo
1. Storage → bucket `fotos` → carrega a fotografia.
2. Table Editor → `capitulos` → nova linha com o número, título, texto e o nome do ficheiro da foto.

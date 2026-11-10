# Site da Dra. Renata Bertazzi

Site estático (HTML/CSS) de drarenatabertazzi.com.br — Oftalmologia | Retina e Catarata.

- `content.py`: textos das páginas temáticas
- `build.py`: gera as páginas HTML, `sitemap.xml` e `robots.txt` (`python3 build.py`)
- `img/`: fotos e logo

Hospedado na Vercel (projeto estático, sem build).

## Publicar conteúdos (vídeos e orientações)

1. Abra `conteudos.json` e acrescente um item na lista `itens` (as instruções estão no topo do arquivo).
2. Rode `python3 build.py`.
3. Faça commit e push. A Vercel publica sozinha.

Os 3 itens mais recentes aparecem na página inicial. Todos aparecem em `/conteudos.html`.

## Agendamento e agenda semanal

- `WHATSAPP` em `build.py`: com o número preenchido, todos os botões de agendar abrem o WhatsApp com uma mensagem pronta. Vazio, abrem o Instagram.
- `AGENDA` em `build.py`: os dias e locais de atendimento da seção "Onde atendo".

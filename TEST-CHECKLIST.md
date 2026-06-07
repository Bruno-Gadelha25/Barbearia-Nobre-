# TEST-CHECKLIST

## Build e validação

- [ ] `npm install`
- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] `npm run preview`

## Front-end

- [ ] Hero renderiza corretamente
- [ ] Menu mobile abre e fecha
- [ ] Links de navegação rodam para as seções corretas
- [ ] Botões de WhatsApp funcionam
- [ ] Área administrativa abre no link do cadeado
- [ ] Login em modo demonstração aparece sem variáveis de ambiente

## Responsividade

- [ ] Mobile 360px
- [ ] Tablet 768px
- [ ] Desktop 1440px
- [ ] Nenhum overflow horizontal
- [ ] Tipografia permanece legível no celular

## Acessibilidade

- [ ] Title e description presentes
- [ ] Skip link funcional
- [ ] `alt` nos elementos visuais
- [ ] Contraste suficiente nos botões e textos
- [ ] Foco visível nos controles

## SEO e deploy

- [ ] Canonical configurado
- [ ] Open Graph configurado
- [ ] Twitter Cards configurado
- [ ] `robots.txt` válido
- [ ] `sitemap.xml` válido
- [ ] Deploy na Vercel funcionando

## Segurança básica

- [ ] `.env` ignorado
- [ ] `dist/` ignorado
- [ ] `.vercel/` ignorado
- [ ] `auth.json` ignorado
- [ ] Tokens e chaves ignorados

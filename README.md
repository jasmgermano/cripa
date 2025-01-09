<!-- logo -->
![logo](https://github.com/user-attachments/assets/86661fe7-2a08-413e-974e-bcb50bf45138)


## Descrição ★
O cripa é um jogo de criptograma desafiador e divertido, perfeito para treinar o cérebro! O objetivo é descobrir as palavras com base em dicas fornecidas. Resolva as palavras horizontais para revelar a palavra vertical, ou resolva a palavra vertical para te ajudar com as outras palavras! 

Este jogo é perfeito para quem ama desafios de lógica, passatempos, como palavras cruzadas, ou quer testar sua habilidade de decifrar pistas de forma criativa.

## Jogue! ★
O deploy do jogo está disponível em: [https://cripa.netlify.app/](https://cripa.netlify.app/)

## 📷 Design e telas ★
<img src="https://github.com/user-attachments/assets/49cc0784-30e4-4d0d-ad03-b8d2f3a2b6f7" alt="Tela de loading" width="800"/>
<img src="https://github.com/user-attachments/assets/50c4348b-1e29-4f0d-95ba-23fdbb1d865a" alt="Tela do jogo" width="800"/>
<img src="https://github.com/user-attachments/assets/6180ad56-058f-469f-8bac-cc3f2f5c7fb4" alt="Modal de instruções" width="800"/>

## Tecnologias ★
![npm](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![npm](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![npm](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![npm](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

Para gerar as dicas, utilizei a inteligência artifical do google, o [gemini](https://ai.google.dev/gemini-api/docs?hl=pt-br).

## Funcionalidades ★
- [x] Tela de loading
  
  ★ Uma tela inicial exibida enquanto o jogo está carregando, garantindo uma transição suave para o jogador.
- [x] Jogos únicos
  
  ★ Cada partida gera um novo criptograma, garantindo que nenhuma experiência seja repetida.
- [x] Verificação e feedback visual
  
  ★ Ao clicar em verificar, o jogo verifica se as respostas estão corretas e fornece feedback visual (cor verde para correto, vermelho para incorreto). Além disso, caso tudo esteja preenchido e correto, um modal com uma mensagem de sucesso e um botão para carregar novo jogo é mostrado na tela.
- [x] Modal de instruções
  
  ★ Explica o funcionamento do jogo para novos jogadores.

## 💡Futuros recursos ★
- [ ] Jogos diários + Compartilhamento de resultado
      
  ★ Introduzir um modo de jogo diário, inspirado em jogos como [Wordle](https://www.nytimes.com/games/wordle/index.html) e [Termo](https://term.ooo/), onde todos os jogadores recebem o mesmo criptograma do dia.
Além disso, será possível compartilhar os resultados diretamente em redes sociais ou com amigos, destacando informações para competição, como:

    - Tempo gasto para concluir o desafio.
    - Número de verficações.
- [ ] Mais idiomas
      
  ★ Expandir para palavras e dicas em outros idiomas.
- [ ] Botão para limpar jogo
- [ ] Versão mobile

  ★ Atualmente, o cripa não está disponível em dispositivos móveis. 


## ⚙ Instalação ★

Este é um projeto [Next.js](https://nextjs.org) criado com [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

### Iniciando o Projeto

Para iniciar o servidor de desenvolvimento, execute o seguinte comando:

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

Abra http://localhost:3000 no navegador para visualizar o resultado.

Você pode começar a editar o projeto modificando app/page.tsx. As alterações serão aplicadas automaticamente no navegador.

Este projeto utiliza next/font para otimizar e carregar fontes automaticamente.

## Referências ★
* Badges
    - [Shields](https://shields.io/)
    - [Awesome Badges](https://dev.to/envoy_/150-badges-for-github-pnk)

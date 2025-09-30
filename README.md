# sec-npm 🛡️

_Uma ferramenta CLI experimental, baseada em IA (LLMs), para detectar ameaças de segurança em pacotes NPM e suas dependências **antes** da instalação._

## Por quê?

Ataques à cadeia de suprimentos de software, como o [recente sequestro de pacotes populares](https-da-notícia), são uma ameaça crescente. Ferramentas como `npm audit` são essenciais, mas reativas. O `sec-npm` busca ser uma camada de defesa **proativa**, analisando o _comportamento_ do código em busca de padrões maliciosos ainda não catalogados.

## Funcionalidades

- **Análise Recursiva:** Varre não só o pacote que você quer instalar, mas toda a sua árvore de dependências.
- **Inteligência Artificial:** Utiliza o poder de Large Language Models (LLMs) para uma análise de código contextual e comportamental.
- **Cache Inteligente:** As análises são salvas localmente. Pacotes já verificados são processados instantaneamente, economizando tempo e custo de API.
- **Modo Interativo:** Apresenta um relatório de risco e pede sua confirmação antes de concluir, colocando você no controle.

## Instalação e Uso

Para usar, você precisará de uma chave de API da Anthropic (para o Claude 3 Haiku).

1.  **Configure sua Chave de API:**

    ```bash
    export ANTHROPIC_API_KEY="sua_chave_secreta_aqui"
    ```

2.  **Execute via `npx`:**
    A forma mais fácil de usar é através do `npx`, que não requer instalação global.
    ```bash
    npx @devgustavor/sec-npm install <nome-do-pacote>
    ```

## Como Funciona?

1.  O `sec-npm` intercepta o comando.
2.  Ele baixa o pacote e suas dependências para uma área temporária.
3.  Analisa scripts de ciclo de vida (`postinstall`, etc.) e pontos de entrada (`main`) usando a IA.
4.  Gera um relatório de risco.
5.  Pede a confirmação do usuário antes de finalizar.

## Contribuição

Este é um projeto open-source em estágio inicial. Ideias, sugestões e contribuições são muito bem-vindas! Sinta-se à vontade para abrir uma _Issue_ ou um _Pull Request_.

---

_Criado por Gustavo Ribeiro._

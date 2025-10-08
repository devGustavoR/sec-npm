# 🛡️ sec-npm

### Segurança proativa para o seu `npm install`.

**🔗 [Visite o site oficial para uma experiência completa!](https://www.sec-npm.com.br)**

---

`sec-npm` é uma ferramenta CLI open source que utiliza **Inteligência Artificial** para analisar o comportamento de pacotes NPM e suas dependências **antes da instalação**, identificando possíveis riscos que ferramentas tradicionais não detectam.

![Site oficial do sec-npm](https://www.sec-npm.com.br/og-image.png)

---

## 🚀 Teste rápido (sem instalar nada)

Você só precisa de uma chave de API da **Anthropic** configurada no ambiente (`ANTHROPIC_API_KEY`):

```bash
npx @devgustavor/sec-npm install <nome-do-pacote>
```

---

## ❗ Por que usar o sec-npm?

Ataques de **supply chain** são uma ameaça crescente no ecossistema JavaScript.
Ferramentas como `npm audit` são **reativas** — elas identificam vulnerabilidades conhecidas **depois** que o problema já foi catalogado.

O **sec-npm** é uma **camada de defesa proativa**, que analisa o comportamento do código e detecta padrões maliciosos **ainda não registrados** em bancos de dados de vulnerabilidades.

Para entender em detalhes como a análise funciona (e ver uma demonstração real), acesse o [site oficial](https://www.sec-npm.com.br).

---

## 🤝 Contribuição

Este é um projeto **feito pela comunidade, para a comunidade**.
Contribuições são muito bem-vindas — sinta-se à vontade para:

* Abrir uma **Issue** com sugestões ou relatórios de bugs
* Enviar um **Pull Request** com melhorias ou novas funcionalidades

Juntos, podemos tornar o ecossistema NPM mais seguro 💪

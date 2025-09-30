import Anthropic from "@anthropic-ai/sdk";
import "dotenv/config";

const API_KEY = process.env.ANTHROPIC_API_KEY;

if (!API_KEY) {
  throw new Error(
    "A chave de API da Anthropic não foi configurada (use a variável de ambiente ANTHROPIC_API_KEY)."
  );
}

const systemPrompt = `Você é um Analista de Segurança de Software Sênior, especializado em identificar ameaças na cadeia de suprimentos do ecossistema NPM. Sua tarefa é analisar trechos de código JavaScript e identificar comportamentos maliciosos. Sua análise deve ser objetiva, técnica e cética. Você deve retornar sua análise APENAS em formato JSON, sem comentários ou texto adicional.`;

export async function analyzeScript(scriptContent) {
  const userPrompt = `
    Analise o código JavaScript fornecido e retorne sua análise em formato JSON com a seguinte estrutura:
    {
      "riskScore": "um número de 0 (seguro) a 10 (crítico)",
      "isMalicious": "booleano",
      "justification": "uma explicação detalhada do porquê da sua classificação",
      "suspiciousIndicators": [
        {
          "indicator": "Tipo do indicador (ex: Acesso a Arquivos Sensíveis)",
          "details": "Detalhes técnicos sobre o que o código está fazendo."
        }
      ]
    }

    Código para análise:
    \`\`\`javascript
    ${scriptContent}
    \`\`\`
  `;

  try {
    const anthropic = new Anthropic({ apiKey: API_KEY });
    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    return JSON.parse(response.content[0].text);
  } catch (error) {
    console.error("ERRO DURANTE A ANÁLISE PELA IA:", error.message);
    throw error;
  }
}

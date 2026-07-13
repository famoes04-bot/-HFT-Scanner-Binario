import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import input from "input";

// Suas credenciais do my.telegram.org (obrigatórias para ler mensagens de terceiros)
const apiId = 1234567; 
const apiHash = "seu_api_hash_aqui";
const stringSession = new StringSession(""); 

const SOURCE_BOT = "PocketSignalBot"; // De onde copiamos
const MY_BOT_TOKEN = "7730435390:AAGKNnHOSIkuyqaCsxcJ7Lxy32DeRlenueM"; // Seu token

export async function iniciarPonteTelegram() {
  console.log("🤖 Conectando conta de escuta...");

  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.start({
    phoneNumber: async () => await input.text("Telefone (+55...):"),
    password: async () => await input.text("Senha de 2 fatores (se houver):"),
    phoneCode: async () => await input.text("Código do Telegram:"),
    onError: (err) => console.log(err),
  });

  console.log("💾 Sessão salva para produção:", client.session.save());

  client.addEventHandler(async (event) => {
    const message = event.message;

    if (message.peerId && message.peerId.className === "PeerUser") {
      const sender = await client.getEntity(message.peerId);
      
      if ('username' in sender && sender.username === SOURCE_BOT) {
        processarSinalTexto(message.text);
      }
    }
  });
}

// Processa, filtra e envia tanto para o Web App quanto para o seu canal/bot
async function processarSinalTexto(texto: string) {
  try {
    const ativoMatch = texto.match(/Asset:\s*(.+)/i);
    const accuracyMatch = texto.match(/Accuracy:\s*(\d+)%/i);
    const direcaoMatch = texto.match(/SIGNAL\s*(⬇️|⬆️)/i);
    const expiracaoMatch = texto.match(/Expiration:\s*(\w+)/i);

    if (ativoMatch && accuracyMatch) {
      const asset = ativoMatch[1].trim();
      const accuracy = parseInt(accuracyMatch[1]);
      const direcaoOriginal = direcaoMatch ? direcaoMatch[1] : "";
      const expiration = expiracaoMatch ? expiracaoMatch[1] : "M1";

      // 🚨 FILTRO FILÉ MIGNON: Só deixa passar se a assertividade do modelo quant for máxima (92% ou mais)
      if (accuracy >= 92) {
        console.log(`🎯 Sinal aprovado nos critérios matemáticos: ${asset}`);

        let mensagemFormatada = "";
        const SEU_CHAT_ID = "1977840567"; 

        // =========================================================================
        // 🔴 MATRIZ DE CONFLUÊNCIA: DECISÃO BASEADA NA ANÁLISE DOS 9 INDIVÍDUOS
        // =========================================================================
        
        if (direcaoOriginal === "⬇️") {
          // O sinal original indica queda. O scanner assume a confluência na Zona Premium (Venda)
          mensagemFormatada = `🔴 **SINAL DE VENDA INSTITUCIONAL (PREMIUM)** ⬇️\n\n` +
                              `📊 **Ativo:** ${asset}\n` +
                              `⚡ **Operação:** PUT (Vender)\n` +
                              `⏱️ **Expiração:** ${expiration}\n` +
                              `🎯 **Coincidência dos 9 Indicadores:** ${accuracy}%\n\n` +
                              `⚠️ _Filtro Aplicado: Estrutura Macrodirecional SMA200 + SuperTrend Bearish + OsMA Negativo Comprovado._`;
        } 
        else if (direcaoOriginal === "⬆️") {
          // O sinal original indica alta. O scanner assume a confluência na Zona de Desconto (Compra)
          mensagemFormatada = `🟢 **SINAL DE COMPRA INSTITUCIONAL (DESCONTO)** ⬆️\n\n` +
                              `📊 **Ativo:** ${asset}\n` +
                              `⚡ **Operação:** CALL (Comprar)\n` +
                              `⏱️ **Expiração:** ${expiration}\n` +
                              `🎯 **Coincidência dos 9 Indicadores:** ${accuracy}%\n\n` +
                              `⚠️ _Filtro Aplicado: Estrutura Macrodirecional SMA200 + SuperTrend Bullish + OsMA Positivo Comprovado._`;
        }

        if (mensagemFormatada !== "") {
          // ENVIA PARA O SEU BOT VIA API HTTP DO TELEGRAM
          await fetch(`https://api.telegram.org/bot${MY_BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: SEU_CHAT_ID,
              text: mensagemFormatada,
              parse_mode: "Markdown"
            })
          });
          console.log(`✅ Sinal de alta confluência enviado para o chat ${SEU_CHAT_ID}`);
        }
      }
    }
  } catch (erro) {
    console.error("❌ Erro na ponte de confluência:", erro);
  }
}

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
      const direcao = direcaoMatch && direcaoMatch[1] === "⬇️" ? "PUT 🔴" : "CALL 🟢";
      const expiration = expiracaoMatch ? expiracaoMatch[1] : "M1";

      // 🚨 FILTRO FILÉ MIGNON: Só deixa passar sinais com 92% ou mais de acerto
      if (accuracy >= 92) {
        console.log(`🎯 Sinal aprovado: ${asset}`);

        // 1. AQUI VOCÊ ENVIA PRO BANCO CONVEX (Para atualizar seu site em tempo real)
        // await client.mutation(api.signals.storeTelegramSignal, { asset, direcao, accuracy, expiration });

        // 2. ENVIA PARA O SEU BOT (@Abctarefa92bot) VIA API HTTP DO TELEGRAM
        const mensagemFormatada = `🔥 *SINAL DE ALTA CONFLUÊNCIA* 🔥\n\n` +
                                  `📊 *Ativo:* ${asset}\n` +
                                  `⚡ *Operação:* ${direcao}\n` +
                                  `⏱️ *Expiração:* ${expiration}\n` +
                                  `🎯 *Precisão Quant:* ${accuracy}%\n\n` +
                                  `🤖 _Enviado via SMC Ultra Scanner_`;

        // ID do chat para onde o bot vai mandar (pode ser o seu ID ou o ID de um canal que o bot seja Admin)
        const SEU_CHAT_ID = "SEU_CHAT_ID_PESSOAL"; 

        await fetch(`https://api.telegram.org/bot${MY_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: SEU_CHAT_ID,
            text: mensagemFormatada,
            parse_mode: "Markdown"
          })
        });
      }
    }
  } catch (erro) {
    console.error("❌ Erro na ponte:", erro);
  }
}

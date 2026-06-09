// bot.ts by ivan deus (TypeScript + Bun version)
// ============= LOGGING =============
const originalLog = console.log;
const originalError = console.error;
console.log = function (message: unknown, ...args: unknown[]) {
    const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });
    const formattedMessage = `[${timestamp}] ${Bun.inspect(message)}${args.length ? ' ' + args.map(a => Bun.inspect(a)).join(' ') : ''}`;
    originalLog.apply(console, [formattedMessage]);
};
console.error = function (message: unknown, ...args: unknown[]) {
    const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });
    const formattedMessage = `[${timestamp}] [ERROR] ${Bun.inspect(message)}${args.length ? ' ' + args.map(a => Bun.inspect(a)).join(' ') : ''}`;
    originalError.apply(console, [formattedMessage]);
};
// ============= IMPORTS =============
import { Client, GatewayIntentBits, Partials, ActionRowBuilder, ButtonBuilder, ButtonStyle, Message } from "discord.js";
// ============= ENVIRONMENT VALIDATION =============
// Bun automatically loads .env files from the working directory.
const BOT_TOKEN = Bun.env.BOT_TOKEN;
if (!BOT_TOKEN) {
    console.error("❌ BOT_TOKEN is missing! Create a .env file with: BOT_TOKEN=your_token_here");
    process.exit(1);
}
// ============= TYPE DEFINITIONS =============
interface BotMessage {
    text: string;
}
interface LanguageMessages {
    [key: string]: BotMessage;
}
interface Messages {
    [language: string]: LanguageMessages;
}
// User languages storage
const userLanguages = new Map<string, string>();

// ============= MESSAGE LOADING =============
let ALL_MESSAGES: Messages;

async function loadAllMessages(): Promise<Messages> {
  try {
    const file = Bun.file("messages.json");
    const exists = await file.exists();

    if (!exists) {
      console.error("messages.json file not found! Using default messages.");
      return getDefaultMessages();
    }
    const data = await file.text();
    return JSON.parse(data) as Messages;
  } catch (err) {
    if (err instanceof SyntaxError) {
      console.error("Invalid JSON in messages.json! Using default messages.");
      return getDefaultMessages();
    }
    throw err;
  }
}

function getDefaultMessages(): Messages {
  return {
    en: {
      welcome: { text: "👋 Hello!" },
      default_response: { text: "Default" },
      language_prompt: { text: "Select language:" },
      language_changed: { text: "Language changed" },
      help: { text: "Commands:\n/start\n/language\n/help" },
    },
    es: {
      welcome: { text: "👋 ¡Hola!" },
      default_response: { text: "Mensaje." },
      language_prompt: { text: "Selecciona idioma:" },
      language_changed: { text: "Idioma cambiado" },
      help: { text: "Comandos:\n/start\n/language\n/help" },
    },
  };
}
// Load all messages
ALL_MESSAGES = await loadAllMessages();

function getMessage(userId: string, messageKey: string): string {
  const language = userLanguages.get(userId) || "en";
  return ALL_MESSAGES[language]?.[messageKey]?.text || `Message not found: ${messageKey}`;
}

// ============= BOT INITIALIZATION =============
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
    ],
    partials: [Partials.Channel]
});

client.once('ready', () => {
    console.log(`✅ Ready! Logged in as ${client.user?.tag}`);
});

// ============= MESSAGE HANDLERS =============
client.on('messageCreate', async (message: Message) => {
    if (message.author.bot) return;

    const text = message.content.trim();
    const userId = message.author.id;

    if (text === '/start') {
        await message.reply(getMessage(userId, "welcome"));
        console.log(`Start command from user ${userId}`);
        return;
    }

    if (text === '/help') {
        await message.reply(getMessage(userId, "help"));
        console.log(`Help command from user ${userId}`);
        return;
    }

    if (text === '/language') {
        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('lang_en')
                    .setLabel('🇬🇧 English')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('lang_es')
                    .setLabel('🇪🇸 Español')
                    .setStyle(ButtonStyle.Primary)
            );

        await message.reply({ content: getMessage(userId, "language_prompt"), components: [row] });
        return;
    }

    if (!text.startsWith('/')) {
        await message.reply(getMessage(userId, "default_response"));
        console.log(`Message from user ${userId}: ${text}`);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    const userId = interaction.user.id;
    if (interaction.customId.startsWith('lang_')) {
        const lang = interaction.customId.split('_')[1];
        userLanguages.set(userId, lang);

        await interaction.update({ content: getMessage(userId, "language_changed"), components: [] });
        console.log(`User ${userId} changed language to ${lang}`);
    }
});

// Handle shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down...");
  client.destroy();
  process.exit(0);
});

// ============= MAIN EXECUTION =============
client.login(BOT_TOKEN).catch(err => {
    console.error(`Failed to login: ${err}`);
});

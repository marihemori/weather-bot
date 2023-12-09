import { Bot, Context, InlineKeyboard } from "grammy";
import "dotenv/config";

const bot = new Bot(process.env.BOT_TOKEN || "");

// comando start

bot.command("start", async (ctx) => {
  await ctx.reply("Meus comandos: [/mybots](/mybots)", {
    parse_mode: "MarkdownV2",
  });
});

// comando mybots

bot.command("mybots", botsList);

// função de lista de bots

async function botsList(ctx: Context) {
  const botsList = new InlineKeyboard()
    .text("@BotAlegre", "bot1")
    .row()
    .text("@BotTriste", "bot2")
    .row()
    .text("@BotFeliz", "bot3")
    .row()
    .text("@BotAborrecido", "bot4");

  if (ctx.message?.text)
    return await ctx.reply("Escolha um bot da lista abaixo:", {
      reply_markup: botsList,
    });
  await ctx.editMessageText("Escolha um bot da lista abaixo:", {
    reply_markup: botsList,
  });
}

// callback retornar para lista

bot.callbackQuery("returnToList", botsList);

// callback para cada bot

bot.callbackQuery(/bot[0-9]+/, (ctx) => {
  const botNumber = ctx.callbackQuery.data?.split("bot")[1];
  const botInfo = new InlineKeyboard()
    .text("Token da API", "botToken" + botNumber)
    .text("Editar bot", "botEdit" + botNumber)
    .row()
    .text("Configurações do bot", "botSettings" + botNumber)
    .text("Pagamentos", "botSettings" + botNumber)
    .row()
    .text("Transferir posse do bot", "botSettings" + botNumber)
    .text("Apagar bot", "botSettings" + botNumber)
    .row()
    .text("< Retornar para a lista de bots", "returnToList")
    .row();
  ctx.editMessageText(`O que você quer fazer com o bot${botNumber}?`, {
    reply_markup: botInfo,
  });
});

// Bot settings

bot.callbackQuery(/botSettings[0-9]+/, async (ctx) => {
  const botNumber = ctx.callbackQuery.data?.split("botSettings")[1];
  const botSettings = new InlineKeyboard()
    .text("Inline mode")
    .row()
    .text("Domain")
    .row()
    .text("< Retornar para o menu do bot", "bot" + botNumber)
    .row();
  await ctx.editMessageText("Configurações para o bot", {
    reply_markup: botSettings,
  });
});

// Bot API Token

bot.callbackQuery(/botToken[0-9]+/, async (ctx) => {
  const botNumber = ctx.callbackQuery.data?.split("botToken")[1];
  const botToken = new InlineKeyboard()
    .text("Revogar token atual", "botRevoke" + botNumber)
    .row()
    .text("< Retornar para o menu do bot", "bot" + botNumber)
    .row();
  await ctx.editMessageText(
    `
        Aqui está o token para o bot${botNumber}:\n\n000000000:AHF0023321jfsda-RUEWF8434NFDSJFj
    `,
    {
      reply_markup: botToken,
    }
  );
});

// Revogar token atual

bot.callbackQuery(/botRevoke[0-9]+/, async (ctx) => {
  const botNumber = ctx.callbackQuery.data?.split("botRevoke")[1];
  const botRevoke = new InlineKeyboard()
    .text("< Retornar para o menu do bot", "bot" + botNumber)
    .row();
  await ctx.editMessageText(
    `
        O token para o bot${botNumber} foi revogado.\n\nAgora o token é: 000000000:AHF0023321jfsda-RUEWF8434NFDSJFj
    `,
    {
      reply_markup: botRevoke,
    }
  );
});

// Editar bot

bot.callbackQuery(/botEdit[0-9]+/, async (ctx) => {
  const botNumber = ctx.callbackQuery.data?.split("botEdit")[1];
  const botEdit = new InlineKeyboard()
    .text("Editar Nome")
    .text("Editar Sobre")
    .row()
    .text("Editar Descrição")
    .text("Editar Descrição da Imagem")
    .row()
    .text("Edit Botpic")
    .text("Editar Comandos")
    .row()
    .text("Edit Placeholder")
    .text("< Retornar para o menu do bot", "bot" + botNumber)
    .row();
  await ctx.editMessageText(
    `
        Editar informações de @bot${botNumber}.\n\nNome: bot${botNumber}\nSobre: 🚫\nDescrição: 🚫\nDescrição da imagem: 🚫 sem descrição\nBotpic: 🚫 nenhuma imagem\nCommandos: Nenhum comando ainda
    `,
    {
      reply_markup: botEdit,
    }
  );
});

bot.start();

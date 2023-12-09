import { Bot, Context, InlineKeyboard } from "grammy";
import "dotenv/config";

const bot = new Bot(process.env.BOT_TOKEN || "");

bot.command("start", async (ctx) => {
  await ctx.reply("Meus comandos: [/mybots](/mybots)", {
    parse_mode: "MarkdownV2",
  });
});

bot.command("mybots", botsList);

async function botsList(ctx: Context) {
  const botsList = new InlineKeyboard()
    .text("BotAlegre", "bot1")
    .row()
    .text("BotTriste", "bot2")
    .row()
    .text("BotFeliz", "bot3")
    .row()
    .text("BotAborrecido", "bot4");

  if (ctx.message?.text)
    return await ctx.reply("Escolha um dos seus bots abaixo:", {
      reply_markup: botsList,
    });
  await ctx.editMessageText("Escolha um dos seus bots abaixo:", {
    reply_markup: botsList,
  });
}

bot.callbackQuery("returnToList", botsList);

bot.callbackQuery(/bot[0-9]+/, (ctx) => {
  const botNumber = ctx.callbackQuery.data?.split("bot")[1];
  const botInfo = new InlineKeyboard()
    .text("Configurações do bot", "botSettings" + botNumber)
    .row()
    .text("< Retornar para a lista de bots", "returnToList")
    .row();
  ctx.editMessageText("O que você fazer com o bot", {
    reply_markup: botInfo,
  });
});

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

bot.callbackQuery(/botMenu[0-9]+/, (ctx) => {
  ctx.reply(
    "bem vindo ao menu do bot " + ctx.callbackQuery.data?.split("botMenu")[1]
  );
});

bot.start();

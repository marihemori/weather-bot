import express from "express";
import { Bot, webhookCallback, InlineKeyboard, Context } from "grammy";
import "dotenv/config";
import axios from "axios";

const bot = new Bot(process.env.BOT_TOKEN || "");

bot.command("start", async (ctx) => {
  const inlineKeyboard = new InlineKeyboard()
    .text("bota1", "botao1")
    .text("botao2", "botao2")
    .row()
    .text("botao3", "bota3")
    .text("botao4", "bota4");
  await ctx.reply("<>Curious?< Click me!", { reply_markup: inlineKeyboard });
});
// Wait for click events with specific callback data.
bot.callbackQuery("click-payload", async (ctx) => {
  // await ctx.editMessageText
  await ctx.answerCallbackQuery({
    text: "You were curious, indeed!",
  });
});

if (process.env.NODE_ENV === "DEVELOPMENT") {
  bot.start();
} else {
  const port = process.env.PORT || 3000;

  const app = express();
  app.use(express.json());
  app.use(`/${bot.token}`, webhookCallback(bot, "express"));
  app.listen(port, () => console.log(`listening on port ${port}`));
}

bot.command("weather", async (ctx) => {
  try {
    // ctx.message -> the message object
    // if ctx.message is null or undefined, the expression ctx.message?.text results in undefined
    // if ctx.message is not null or undefined, this accesses the text property of the message
    const city = ctx.message?.text?.split(" ")[1];

    const weatherApi = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API}&units=metric`;

    // http "get" request to the weather url
    const response = await axios.get(weatherApi);

    const responseData = response.data;

    const message = `A temperatura atual da sua cidade é: ${responseData.main.temp} e a humidade é: ${responseData.main.humidity}`;

    await ctx.reply(message);
  } catch (error) {
    console.error("Erro ao chamar a API", error);
    await ctx.reply("Ocorreu um erro ao chamar a API.");
  }
});

///

// Recebendo input dos usuários:
// Há tres meios principais:
// Mensagem, comando e botão

// 1. Por mensagem:
// Basicamente iremos escutar cada uma das mensagens recebidas pelo bot através do bot.on("message")
bot.on("message", (ctx) => {
  console.log(ctx.message.text);
});

// 2. Por comando:
// Ao executar um comando o usuário pode ainda preencher a mensagem com ainda mais informações, por ex:
// É possível usar apenas /start para iniciar seu bot, mas caso o usuário queira, ele pode usar /start 1234. O seu middleware de command('start') ainda vai pegar essa atualização

bot.command("user", (ctx) => {
  console.log(ctx.message?.text); // '/user informação'
  const info = ctx.message?.text?.split(" ")[1];
});

// 3. Por botões:
// Ao clicar em um botão, o usuário envia o que chamamos de "CallbackQuery" é um nome chique para dizer que o seu bot é avisado quando um usuário clica em um botão.after(() => {
// No objeto de atualização encontraremos todas as informações de quem clicou no botão, qual botão foi clicado etc.

bot.callbackQuery("botao1", (ctx) => {
  ctx.callbackQuery.from.first_name;
  ctx.callbackQuery.from.username;
  ctx.callbackQuery.from.id;

  ctx.callbackQuery.data = "botao1";
});

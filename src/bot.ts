import express from "express";
import { Bot, webhookCallback, InlineKeyboard, Context } from "grammy";
import "dotenv/config";
import axios from "axios";

const bot = new Bot(process.env.BOT_TOKEN || "");

bot.command("start", (ctx) => ctx.reply("Hello!"));

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
    const weatherApi = `http://api.openweathermap.org/data/2.5/weather?q=sao%20paulo&appid=${process.env.WEATHER_API}`;

    const response = await axios.get(weatherApi);

    const responseData = response.data;

    await ctx.reply(`Resposta da API: ${JSON.stringify(responseData)}`);
  } catch (error) {
    console.error("Erro ao chamar a API", error);
    await ctx.reply("Ocorreu um erro ao chamar a API.");
  }
});

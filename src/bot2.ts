import express from "express";
import { Bot, webhookCallback, InlineKeyboard, Context } from "grammy";
import "dotenv/config";
import axios from "axios";

const bot = new Bot(process.env.BOT_TOKEN || "");

bot.command("start", async (ctx) => {
  const buttons = new InlineKeyboard()
    .text("Edite-me", "edit1")
    .text("Edite-me", "edit2")
    .text("Edite-me", "edit3")
    .text("Edite-me", "edit4");
  await ctx.reply("Seja bem vindo", { reply_markup: buttons });
});

bot.callbackQuery("edit1", async (ctx) => {
  await ctx.editMessageText("Testando 1");
});

bot.callbackQuery("edit2", async (ctx) => {
  await ctx.editMessageText("Testando 2");
});

bot.callbackQuery("edit3", async (ctx) => {
  await ctx.editMessageText("Testando 3");
});

bot.callbackQuery("edit4", async (ctx) => {
  await ctx.editMessageText("Testando 4");
});

bot.start();

const Telegraf = require('telegraf');
const fetch = require('node-fetch');
const { token } = require('./token.js');

const constructRequest = (requestTitle, content) => [{
  description: content,
  id: '0',
  input_message_content: {
    message_text: content,
  },
  title: requestTitle,
  type: 'article',
}];

const constructCatRequest = constructRequest.bind(null, 'Did you know...');

const sendToTelegram = (b, id, quote) => b.telegram.answerInlineQuery(id,
  constructCatRequest(quote), { cache_time: 0 });

const bot = new Telegraf(token);

bot.on('inline_query', ctx => fetch('https://the-cat-fact.herokuapp.com/api/randomfact')
  .then(resp => resp.json())
  .then(json => json.data[0].fact)
  .then(fact => sendToTelegram(bot, ctx.update.inline_query.id, fact)));

bot.launch();

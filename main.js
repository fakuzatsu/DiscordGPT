// Initialise the bot's dependencies and load APIs with API keys.
require('dotenv/config');
const { Client, IntentsBitField } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');

// Discord variables and login.
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});


// GPT Configuration and API Key pass.
const configuration = new Configuration({
  apiKey: process.env.GPT,
});
const openai = new OpenAIApi(configuration);


// Preforms the GPT call and returns the result.
async function sendGPTRequest(message, client, conversationLog, messageLimit = 15) {
  try {
    await message.channel.sendTyping();

    if (messageLimit > 0) {
      // The bot reads the previous 15 messages in the channel for context.
      let prevMessages = await message.channel.messages.fetch({ limit: messageLimit });
      prevMessages.reverse();

      // The bot ignores messages starting with ! and other bot or server messages.
      prevMessages.forEach((msg) => {
        if (message.content.startsWith('!')) return;
        if (msg.author.id !== client.user.id && message.author.bot) return;

        conversationLog.push({
          role: 'user',
          content: `${msg.author.username}: ${msg.content}`,
        });
      });
    }

    // The bot contacts openai to get its response.
    const result = await openai
      .createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: conversationLog,
        max_tokens: 256, // limit token usage to around 100 words.
      })
      .catch((error) => {
        console.log(`OPENAI ERR: ${error}`);
      });

    // Return the response as part of the async function.
    const response = result.data.choices[0].message;
    const responseAsString = response['content'].toString();
    const name = client.user.username;
    const namePattern = new RegExp (`^${name}:`);
    const finalResponse = responseAsString.replace(namePattern, '').trim();
    return finalResponse;
  } catch (error) {
    console.log(`ERR: ${error}`);
    message.reply(`Sorry! I couldn't contact OpenAI. Please try again shortly.`)
  }
}


// Begins the process when a message is sent in the chat. Omits bot and server messages, as well as messages beginning with !.
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith('!')) return;

  // Only lets the bot speak when mentioned.
  const name = client.user.username.toLowerCase();
  if (message.content.toLowerCase().includes(name)) {

    let conversationLog = [{ role: 'system', content: `You are an AI assistant called ${name}.`}];
    const GPTResponse = await sendGPTRequest(message, client, conversationLog);
    message.reply(GPTResponse);

  }
}); 

client.login(process.env.DISC);

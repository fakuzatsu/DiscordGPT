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


// Fetches previous messages for context.
async function fetchPreviousMessages(message, messageLimit) {
    const prevMessages = await message.channel.messages.fetch({ limit: messageLimit });
    const filteredMessages = prevMessages
      .filter((msg) => !msg.content.startsWith('!') && !msg.author.bot)
      .map((msg) => ({
        role: 'user',
        content: `${msg.author.username}: ${msg.content}`,
      }));
    return filteredMessages.reverse();
  }


  // Preforms the GPT call and returns the result.
async function sendGPTRequest(message, client, conversationLog, messageLimit = 15) {
    try {
      await message.channel.sendTyping();
  
      if (messageLimit > 0) {
        const prevMessages = await fetchPreviousMessages(message, messageLimit);
        conversationLog.push(...prevMessages);
      }
  
      const result = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: conversationLog,
        max_tokens: 256, // limit token usage to around 100 words.
      });
  
      const response = result.data.choices[0].message;
      let finalResponse = response.content.trim();
  
      // Remove the bot's name from the response if present.
      const name = client.user.username.toLowerCase();
      const botNamePattern = new RegExp(`^${name}:`, 'i');
      if (finalResponse.toLowerCase().startsWith(name.toLowerCase() + ':')) {
        finalResponse = finalResponse.replace(botNamePattern, '').trim();
      }
  
      return finalResponse;
    } catch (error) {
      console.log(`ERR: ${error}`);
      message.reply(`Sorry! I couldn't contact OpenAI. Please try again shortly.`);
    }
  }


  // Begins the process when a message is sent in the chat. Omits bot and server messages, as well as messages beginning with !.
client.on('messageCreate', async (message) => {
    if (message.author.bot || message.content.startsWith('!')) return;
  
    const name = client.user.username.toLowerCase();
    if (message.content.toLowerCase().includes(name)) {
      const conversationLog = [{ role: 'system', content: `You are an AI assistant called ${name}.` }];
      const GPTResponse = await sendGPTRequest(message, client, conversationLog);
      message.reply(GPTResponse);
    }
  });

  client.login(process.env.DISC);
# DiscordGPT

[![](https://img.shields.io/badge/discord.js-v14.9.0-blue.svg?logo=npm)](https://github.com/discordjs)
[![](https://img.shields.io/badge/openai-v3.2.1-orange)](https://github.com/openai/openai-node)

An Discord bot backend utilising the OpenAI API (Specifically 3.5-Turbo) to give your bot the ability to talk like ChatGPT. Build via NodeJS or Docker.

# Features

![Bot Showcase1](https://i.postimg.cc/nzBJQgQs/Screenshot-2023-05-14-at-20-03-43.png)

By utilising the OpenAI 3.5-Turbo API, DiscordGPT provides an experience similar to using ChatGPT, but right in your Discord server. DiscordGPT recognises the name of the bot you connect it to, and will **respond to it's name when it hears it in chat**. 

When DiscordGPT responds, it reads the last 15 messages of the chat in order to **understand the context of the conversation and respond fluidly**. It even **knows who said each line**, so it can sumarise long threads and contribute as asked.

DiscordGPT responses have been limited to a strict character value in order to stay within the Discord character limit, and prevent the bot from using more credits than necessary.

![Bot Showcase2](https://i.postimg.cc/15WL4sYC/Screenshot-2023-05-14-at-20-08-28.png)

# Setup

## Make your Discord Bot Account

To get your code connected to Discord you'll need to make a bot account to run it. You can follow these steps to make your bot:

**1.)** Log into the Discord developer portal at https://discord.com/developers/applications 

**2.)** Hit 'New Application' and give your bot a name. 

>**! This is the name your bot will respond to in Discord so make it something unique but easy to type. !**

**3.)** Navigate to the 'Bot' tab in your new application and hit 'Add Bot'. Then confirm.

>Here you can also define whether you want your bot to be Public (only you can add it to channels) or public.

**4.)** Under 'Privellaged Gateway Intents', make sure that 'Message Content Intent' is turned on. This lets your bot read the chat for context.

**5.)** Under the Token option, copy your token to somewhere safe. Don't share this with anybody you don't trust, as it gives full access to your bot.

### Invite your Bot

**1.)** Still in the Discord developer portal within your application, select the 'OAuth2' tab.

**2.)** Under 'Scopes', select 'Bot'.

**3.)** Under 'Bot Permissions', select the following options:

> Read Messages/View Channels + Send Messages + Read Message History

**4.)** Then, hit 'copy' to get the URL which can be used to add the bot to a server you have permission to manage (just paste it into your browser and select the server).

**Once you've made your bot with discord and you've copied your bot's secure token, continue to either building your bot with NodeJS or Docker.**

## Build with NodeJS

You can use this code to build your bot with NodeJS via a few methods. The easiest of which is running it locally. To run your bot locally on Linux:

**1.)** Install Node and NPM:

```
curl -fsSL https://deb.nodesource.com/setup_18.x && apt-get install -y nodejs
```

**2.)** Create the directory for your code:

```
mkdir DiscordGPT && cd DiscordGPT
```

**3.)** Clone the repository with the git clone command:

```
git clone https://github.com/fakuzatsu/DiscordGPT .
```

**4.)** Install the dependencies with NPM:

```
npm install
```

**5.)** Create a .env file for your API keys:

```
touch .env
```

 - You will have to add the following to your .env file using your favourite text editor (such as):

```
DISC= #Your Discord API token
GPT= #Your OpenAI API token
```

You copied your Discord API token to a safe location as part of the setup to make your bot account previous.

You will need your OpenAI API token from https://platform.openai.com

**6.)** Initialise your bot with NodeJS:

```
node main.js
```

> Note that this will only run the bot as long as the terminal session remains. To initialise your bot to run permanently in the background, you can use an npm package such as `forever`.

## Build with Docker

The dockerfiles are still being built. For now you can only build your bot using NodeJS.

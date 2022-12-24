# Regression Games Bot Template

This template demonstrates the basics of using the [rg-bot package](https://www.npmjs.com/package/rg-bot) to create
a very simple bot for the Regression Games: Ultimate Collector challenge.

## Connecting Replit to Git

In order to push your code to Git (and therefore to Regression Games), you'll need to set some **secrets** within Replit. These secrets can be set by clicking the lock icon in the left hand pane in Replit. Add the following values to your secrets:

* `GITHUB_REPO` - The HTTPS link (_not_ the SSH link) to your GitHub repo. This repository **should be empty***. You can get the link by clicking the "< > Code" button on GitHub and copying the text from the HTTPS tab to your clipboard
* `GITHUB_EMAIL` - The email you use for your GitHub account, which can be found in your profile
* `GITHUB_USERNAME` - Your GitHub username
* `GITHUB_TOKEN` - A personal access token, generated from https://github.com/settings/tokens. Make sure to select all permissions for "repo".

Once you've set these up, clicking the Replit "Run" button will automatically update your bot.

### Additional Notes on GitHub repositories

If you **really want to override your remote repository**, (i.e. the console fails to push due to remote changes), you can run the following command, but this will overwrite everything in your GitHub repo!

```
git push -u origin main -f
```

If you want to avoid this, then you can pull the remote into this local repository and overwrite all changes here with the following command: 

```
git pull origin main --allow-unrelated-histories
# Then address git issues / merge conflicts, and run:
git commit -am "My message"
git push -u origin main
```

## Creating your first Regression Games bot

Every bot must have an `index.js` file with the following code:

```javascript
function configureBot(bot) {
  // Bot logic here
}

exports.configureBot = configureBot
```

This defines a `configureBot` function and exposes that function to Regression Games.
Regression Games uses it as an entrypoint to your bot script, and passes a bot for you to interact with.

Here is an example of the `configureBot` function with some basic logic that will make your bot parrot back 
anything it sees in chat from other players.

```javascript
function configureBot(bot) {

  // Every time a player says something in the game, 
  // do something with that player's username and their message
  bot.on('chat', (username, message) => { 
  
      // If the username of the speaker is equal to the username of this bot, 
      // don't do anything else. This is because we don't want the bot to repeat 
      // something that it says itself, or else it will spam the chat and be 
      // kicked from the game!
      if (username === bot.mineflayer().username) return
      
      // make the bot chat with the same message the other player sent
      bot.chat("This is what I heard: " + message)
  })
  
}

exports.configureBot = configureBot
```

_Not sure what this is? Visit https://regression.gg for some programming fun!_
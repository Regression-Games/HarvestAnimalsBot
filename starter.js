const RG = require('rg-bot');

/**
 * This bot will find animals and kill them with its bare hands.
 * Any drops from the animals will be collected for points!
 * @param {RG.RGBot} bot
 */
function configureBot(bot) {

    bot.setDebug(true);
    bot.allowParkour(true);

    bot.on('chat', async (username, message) => {
        if (username == bot.username()) return
        bot.chat("I'm a big dummy bot and don't know how to do anything! Leave me alone!")
    })

    // Have the Bot begin our main loop when it spawns into the game
    bot.on('spawn', async () => {
        bot.chat('Hello, I have arrived!');
    });

}

exports.configureBot = configureBot;
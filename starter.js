const RG = require('rg-bot');

/**
 * This bot will find animals and kill them with its bare hands.
 * Any drops from the animals will be collected for points!
 * @param {RG.RGBot} bot
 */
function configureBot(bot) {

    bot.setDebug(true);
    bot.allowParkour(true);

    // We keep track of deaths to make sure that this bot stops when it dies
    let deaths = 0

    // ADD HUNTING LOGIC HERE

    // Record deaths by incrementing our counter every time we die
    bot.on('death', () => {
        deaths++;
    })

    // Only start hunting once we ask the bot to start
    bot.on('chat', async (username, message) => {
        if (username == bot.username()) return
        bot.chat("I'm a big dummy bot and don't know how to do anything! Leave me alone!")
    })

    // On spawn, chat a message
    bot.on('spawn', async () => {
        console.log("I have arrived... ready to hunt some animals!");
    });

}

exports.configureBot = configureBot;
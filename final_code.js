const RG = require('rg-bot');

/**
 * This bot will find animals and kill them with its bare hands.
 * Any drops from the animals will be collected for points!
 * @param {RG.RGBot} bot
 */
function configureBot(bot) {

    bot.setDebug(true);
    bot.allowParkour(true);

    // If there are no animals around, have it attack you by adding
    // "player" to this list.
    const animalsToHunt = ["chicken", "pig", "cow", "sheep"];

    async function huntAnimals() {
        let nearbyAnimals = bot.findEntities({entityNames: animalsToHunt, maxDistance: 100});
        console.log(nearbyAnimals)
        if (nearbyAnimals.length == 0) {
            bot.chat("Could not find animals nearby... going to wander and try again")
            await bot.wander();
            return await huntAnimals()
        }
        let animalToAttack = nearbyAnimals[0].result
        bot.chat("Hunting a " + animalToAttack.name)
        while (animalToAttack.isValid) {
            await bot.attackEntity(animalToAttack)
        }
        bot.chat("Finished attacking the " + animalToAttack.type, ", moving on the next victim")
        let itemsOnGround = await bot.findAndCollectItemsOnGround()
        bot.chat(`Picked up ${itemsOnGround.length} items off the ground`)
        return await huntAnimals()
    }

    bot.on('chat', async (username, message) => {
        if (username == bot.username()) return
        if (message == "hunt") {
            huntAnimals()
        }
    })

    // Have the Bot begin our main loop when it spawns into the game
    bot.on('spawn', async () => {
        bot.chat('Hello, I have arrived!');
    });

}

exports.configureBot = configureBot;
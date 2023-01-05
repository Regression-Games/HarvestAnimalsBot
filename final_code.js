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

    // If there are no animals around, have it attack you by adding
    // "player" to this list.
    const animalsToHunt = ["chicken", "pig", "cow", "sheep", "rabbit"];

    // This function finds animals, attacks them until they are dead, and
    // then picks up their items.
    async function huntAnimal() {
        let nearbyAnimals = bot.findEntities({ entityNames: animalsToHunt, maxDistance: 100 });
        console.log(`Found nearby animals to hunt: ${nearbyAnimals}`)
        if (nearbyAnimals.length == 0) {
            return false
        }
        let animalToAttack = nearbyAnimals[0].result
        let animalName = animalToAttack.name
        bot.chat(`Hunting a ${animalName}`)

        while (animalToAttack.isValid) {
            await bot.attackEntity(animalToAttack)
        }
        bot.chat(`Finished attacking the ${animalName}, moving on the next victim`)
        return true
    }


    // This function allows us to repeatedly call the huntAnimals function
    // until the bot dies
    async function repeatHuntAnimals() {

        // While the bot has not died again (i.e. the count has not increased),
        // try to find an animal again.
        const previousDeaths = deaths;
        const botStillAlive = () => { return previousDeaths === deaths }
        while (botStillAlive()) {
            const didHuntAndKill = await huntAnimal()
            if (didHuntAndKill) {
                let itemsOnGround = await bot.findAndCollectItemsOnGround()
                bot.chat(`Picked up ${itemsOnGround.length} items off the ground`)
            } else {
                bot.chat("Could not find animals nearby... going to wander and try again")
                await bot.wander(10, 30);
            }
        }
    }

    // Record deaths by incrementing our counter every time we die
    bot.on('death', () => {
        deaths++;
    })

    // Only start hunting once we ask the bot to start
    bot.on('chat', async (username, message) => {
        if (username == bot.username()) return
        if (message == "hunt") {
            repeatHuntAnimals()
        }
    })

    // On spawn, chat a message
    bot.on('spawn', async () => {
        console.log("I have arrived... ready to hunt some animals!");
    });

}

exports.configureBot = configureBot;
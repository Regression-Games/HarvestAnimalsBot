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
    const animalsToHunt = ["chicken", "pig", "cow", "sheep", "rabbit"];
    let deaths = 0

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

    async function repeatHuntAnimals() {
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

    bot.on('death', () => {
        deaths++;
    })

    bot.on('chat', async (username, message) => {
        if (username == bot.username()) return
        if (message == "hunt") {
            repeatHuntAnimals()
        }
    })

    bot.on('spawn', async () => {
        console.log("I have arrived... ready to hunt some animals!");
    });

}

exports.configureBot = configureBot;
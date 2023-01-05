const RG = require('rg-bot');
const { RGMatchInfo } = require('rg-match-info');

/**
 * This bot will find animals and kill them with its bare hands.
 * Any drops from the animals will be collected for points!
 * @param {RG.RGBot} bot
 * @param {EventEmitter} matchInfoEmitter
 */
function configureBot(bot, matchInfoEmitter) {

    bot.setDebug(true);
    bot.allowParkour(true);

    const animalsToHunt = ["chicken", "pig", "cow", "sheep", "rabbit"];

    async function huntAnimal() {
        let nearbyAnimals = bot.findEntities({ entityNames: animalsToHunt, maxDistance: 100 });
        console.log(`Found nearby animals to hunt: ${nearbyAnimals}`)
        if (nearbyAnimals.length == 0) {
            return false
        }
        let animalToAttack = nearbyAnimals[0].result
        let animalName = animalToAttack.name
        bot.chat(`Hunting a ${animalName}`)

        const ATTACK_LIMIT = 50
        letAttackCount = 0
        let didAttack = true
        while (didAttack && animalToAttack.isValid && attackCount++ < ATTACK_LIMIT) {
            didAttack = await bot.attackEntity(animalToAttack)
        }
        bot.chat(`Finished attacking the ${animalName}, moving on the next victim`)
        return true
    }

    // default to true in-case we miss the start
    let matchInProgress = true;

    matchInfoEmitter.on('match_ended', async (matchInfo) => {
        const points = matchInfo?.players.find(player => player.username === bot.username())?.metadata?.score
        console.log(`The match has ended - I scored ${points} points`)
        matchInProgress = false;
    })

    matchInfoEmitter.on('match_started', async (matchInfo) => {
        console.log(`The match has started`)
        matchInProgress = true;
    })

    let deaths = 0

    bot.on('death', () => {
        console.log("!*!*!*! I have died...")
        ++deaths;
    })

    bot.on('chat', async (username, message) => {
        if (username == bot.username()) return
        if (message == "hunt") {
            huntAnimals()
        }
    })

    // Have the Bot begin our main loop when it spawns into the game
    bot.on('spawn', async () => {
        console.log("I have arrived... v2");
        const previousDeaths = deaths;

        const WANDER_RANGE = 1 // this will grow larger and larger each pass it finds nothing

        let wanderCount = 0

        const isActiveFunction = () => { return matchInProgress && previousDeaths === deaths }
        while (isActiveFunction()) {
            const hunted = await huntAnimal()
            if (hunted) {
                wanderCount = 0
                let itemsOnGround = await bot.findAndCollectItemsOnGround()
                bot.chat(`Picked up ${itemsOnGround.length} items off the ground`)
            } else {
                bot.chat("Could not find animals nearby... going to wander and try again")
                await bot.wander(WANDER_RANGE + wanderCount, (WANDER_RANGE + wanderCount) * 2);
                ++wanderCount;
            }
        }
    });


}

exports.configureBot = configureBot;
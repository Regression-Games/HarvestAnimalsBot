# Implementing our bot algorithm

Our goal is to program our bot to hunt animals, and collect any item
drops that the animal leaves behind. Open [index.js](#index.js) to 
see our bot's current code. Let's focus on the chat [event handler](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events) below:

```javascript
...

bot.on('chat', async (username, message) => {
    if (username == bot.username()) return
    bot.chat("I'm a big dummy bot and don't know how to do anything! Leave me alone!")
})

...
```

This code listens for a `chat` event. When someone types into
the Minecraft chat, this event is sent, and the function taking the username
and message is called. You'll see here that if the user who chatted is anyone
but the bot itself, it says that message you saw in the previous step.

Let's think about the algorithm that we want to implement:

![A schematic of our algorithm](images/attack_tutorial.png)

Our algorithm will be as follows:

1. Find the nearest animal. If none are found, wander around and try again.
3. Approach attack that animal. If not dead, go back to step 2.
4. Once dead, find and collect any item drops on the ground.
5. Go back to step 1.

This algorithm will repeatedly find animals and attack them, making sure to pick
up any drops! We can use the following functions to complete these steps:

1. `findEntities()` and `wander()`
2. `attackEntity()`
3. `findAndCollectItemsOnGround()`

Let's see this code in action. First, copy and paste the following code
to be right above the `bot.on('chat', ...` code:

```javascript
const animalsToHunt = ["chicken", "pig", "cow", "sheep", "player"];

async function huntAnimals() {
    let nearbyAnimals = bot.findEntities({
        entityNames: animalsToHunt, 
        maxDistance: 100
    });
    if (nearbyAnimals.length == 0) {
        bot.chat("No animals, wandering...")
        await bot.wander();
        return await huntAnimals()
    }
    let animalToAttack = nearbyAnimals[0].result
    bot.chat("Attacking " + animalToAttack.name)
    while (animalToAttack.isValid) {
        await bot.attackEntity(animalToAttack)
    }
    let itemsOnGround = await bot.findAndCollectItemsOnGround()
    return await huntAnimals()
}
```

Finally, we need to call this new `huntAnimals()` function. Inside
of the `bot.on('chat', ...` code, change it to the following:

```javascript
bot.on('chat', async (username, message) => {
    if (username == bot.username()) return
    if (message == "hunt") {
        huntAnimals()
    }
})
```

That's it! Revisit the Git tab/tool in Replit, add a message to say "Added
hunting code", and then click **Commit All & Push ->**. Once pushed, your
bot will immediately reload in Minecraft. Type "hunt" into the chat, and
your bot will start to chase and attack the nearest mob!

Let's wrap up with a few suggestions for next steps, as well as an overview
of the tools in Regression Games to make bot development easier.
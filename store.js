import { totalFlips } from './stats.js'
import { pushStoreItem, removeStoreItem } from './ui.js'
import { upgradeHeadsChance } from './coin-flip.js'
import State from './state.js'

let numUnlocked = 0
let upgrades = []
let upgradesMade = []

const showUpgrade = (name) => {
    const upgrade = possibleUpgrades.find((u) => u.name === name)

    if (!upgrade) {
        throw 'No upgrade found'
    }

    pushStoreItem(upgrade)
    possibleUpgrades = possibleUpgrades.filter((u) => u.name !== name)
    upgrades.push(upgrade)
}

export const checkStoreUpgrades = () => {
    if (totalFlips === 10) {
        showUpgrade('coin-5')
    } else if (totalFlips === 25) {
        showUpgrade('auto-1')
    } else if (totalFlips === 100) {
        showUpgrade('coin-3')
    } else if (totalFlips === 1000) {
        showUpgrade('coin-2')
    }
}

export const doUpgrade = (name) => {
    // check if this is in the upgrades array
    // this is also to prevent console users from abusing upgrades
    const upgrade = upgrades.find((u) => u.name === name)
    if (!upgrade) {
        throw 'Cannot do missing upgrade'
    }

    if (State.dollars < upgrade.price) {
        throw 'Too expensive'
    }

    State.dollars -= upgrade.price

    console.log(name)
    if (name === 'coin-5') {
        upgradeHeadsChance(0.05)
    }

    // remove from upgrades array
    upgrades = upgrades.filter((u) => u.name !== name)
    upgradesMade.push(upgrades)
    removeStoreItem(name)
}

let possibleUpgrades = [
    { name: 'coin-5', price: 50, text: 'Weighted coin', info: 'Increase heads chance by 5%' },
    { name: 'auto-1', price: 75, text: 'Autoflip', info: 'Choose heads on coin flip every second' }
]

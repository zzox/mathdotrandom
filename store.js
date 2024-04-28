import { totalFlips } from './stats.js'
import { pushStoreItem } from './ui.js'

let numUnlocked = 0
let upgrades = []

const showUpgrade = (name) => {
    const upgrade = possibleUpgrades.find((u) => u.name === name)

    if (!upgrade) {
        throw 'No upgrade found'
    }

    pushStoreItem(upgrade)
    upgrades.push(upgrade)
}

export const checkStoreUpgrades = () => {
    if (totalFlips === 10) {
        showUpgrade('coin-5')
    } else if (totalFlips === 100) {
        showUpgrade('coin-3')
    } else if (totalFlips === 1000) {
        showUpgrade('coin-2')
    }
}

export const doUpgrade = (name) => {
    // check if this is in the upgrades array
    // this is also to prevent console users from abusing upgrades
    console.log(name)
    // remove from upgrades array
}

const possibleUpgrades = [
    { name: 'coin-5', text: 'Weighted coin', info: 'Increase heads chance by 5%' }
]

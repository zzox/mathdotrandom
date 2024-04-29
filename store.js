import { totalFlips } from './stats.js'
import { $id, $query, $queryAll, pushStoreItem, removeStoreItem } from './ui.js'
import { upgradeAutoFlip, upgradeHeadsChance } from './games/coin-flip.js'
import State from './state.js'

let upgrades = []
let upgradesMade = []
let errorTimer = 3000
const errorTime = 3000

const showUpgrade = (name) => {
    const upgrade = possibleUpgrades.find((u) => u.name === name)
    if (!upgrade) {
        throw 'No upgrade found'
    }

    const storeBox = $id('store')
    storeBox.classList.remove('display-none')
    storeBox.classList.remove('minimize')

    pushStoreItem(upgrade)
    possibleUpgrades = possibleUpgrades.filter((u) => u.name !== name)
    upgrades.push(upgrade)
}

export const checkStoreUpgrades = () => {
    if (totalFlips === 10) {
        showUpgrade('coin-10')
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
        $query(`#store-item_${name} > .error-text`).innerText = 'Not enough money'
        errorTimer = 0
        throw 'Too expensive'
    }

    // TODO: method on state?
    State.dollars -= upgrade.price

    console.log(name)
    if (name === 'coin-10') {
        upgradeHeadsChance(0.1)
    } else if (name === 'auto-1') {
        upgradeAutoFlip(1000)
    }

    // remove from upgrades array
    upgrades = upgrades.filter((u) => u.name !== name)
    upgradesMade.push(upgrades)
    removeStoreItem(name)
}

export const updateStore = (delta) => {
    if (errorTimer < errorTime) {
        errorTimer += delta
        if (errorTimer > errorTime) {
            $queryAll('.error-text').map((item) => { item.innerText = '' })
        }
    }
}

let possibleUpgrades = [
    { name: 'coin-10', price: 50, text: 'Weighted coin', info: 'Increase heads chance by 10%' },
    { name: 'auto-1', price: 50, text: 'Autoflip', info: 'Choose heads on coin flip every second' }
]

import { totalGames, totalFlips, totalWars } from './stats.js'
import { $id, $query, $create, formatPrice } from './ui.js'
import { upgradeAutoFlip, upgradeHeadsChance, upgradeMaxCoinBet } from './games/coin-flip.js'
import State from './state.js'
import { unlockTripleTie, unlockWar, upgradeAutoWar, upgradeWarAcePercent } from './games/war.js'

let upgrades = []
let upgradesMade = []
let storeBox

const showUpgrade = (name) => {
    const upgrade = possibleUpgrades.find((u) => u.name === name)
    if (!upgrade) {
        // TODO: remove
        console.log(`No upgrade found for ${name}`)
        return
    }

    const storeBox = $id('store')
    storeBox.classList.remove('display-none')
    storeBox.classList.remove('minimize')

    pushStoreItem(upgrade)
    possibleUpgrades = possibleUpgrades.filter((u) => u.name !== name)
    upgrades.push(upgrade)
}

export const checkStoreUpgrades = () => {
    // TEST:
    // if (totalWars === 1) {
    //     showUpgrade('war-2-percent-ace')
    // } else if (totalWars === 2) {
    //     showUpgrade('war-triple-tie')
    // }

    if (totalGames === 100) {
        showUpgrade('unlock-war')
    } else if (totalGames === 1000) {
        showUpgrade('unlock-poker')
    } else if (totalGames === 10000) {
        showUpgrade('unlock-blackjack')
    } else if (totalGames === 10000) {
        showUpgrade('unlock-rps')
    } else if (totalFlips === 10) {
        showUpgrade('coin-10')
    } else if (totalFlips === 25) {
        showUpgrade('coin-max-5')
    } else if (totalFlips === 50) {
        showUpgrade('coin-auto-1')
    } else if (totalFlips === 250) {
        showUpgrade('coin-max-10')
    } else if (totalFlips === 1000) {
        showUpgrade('coin-5')
    } else if (totalFlips === 10000) {
        showUpgrade('coin-1')
    } else if (totalWars === 50) {
        showUpgrade('war-auto-1')
    } else if (totalWars === 100) {
        showUpgrade('war-triple-tie')
    } else if (totalWars === 200) {
        showUpgrade('war-remove-2-clubs')
    } else if (totalWars === 250) {
        showUpgrade('war-2-percent-ace')
    } else if (totalWars === 400) {
        showUpgrade('war-remove-2-spades')
    } else if (totalWars === 500) {
        showUpgrade('war-auto-2')
    } else if (totalWars === 800) {
        showUpgrade('war-remove-2-diamonds')
    } else if (totalWars === 1000) {
        showUpgrade('war-max-10')
    } else if (totalWars === 1600) {
        showUpgrade('war-remove-2-clubs')
    } else if (totalWars === 3200) {
        showUpgrade('war-remove-2-hearts')
    } else if (totalWars === 5000) {
        showUpgrade('war-auto-4')
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
        throw 'Too expensive, should not hit this error'
    }

    // TODO: method on state?
    State.dollars -= upgrade.price

    console.log(name)
    if (name === 'coin-10') {
        upgradeHeadsChance(0.1)
    } else if (name === 'coin-5') {
        upgradeHeadsChance(0.05)
    } else if (name === 'coin-max-5') {
        upgradeMaxCoinBet(5)
    } else if (name === 'coin-auto-1') {
        upgradeAutoFlip(1000)
    } else if (name === 'unlock-war') {
        unlockWar()
    } else if (name === 'war-triple-tie') {
        unlockTripleTie()
    } else if (name === 'war-2-percent-ace') {
        upgradeWarAcePercent(0.04)
    } else if (name === 'war-max-10') {
        upgradeMaxWarBet(10)
    } else if (name === 'war-auto-1') {
        upgradeAutoWar(1000)
    }

    // remove from upgrades array
    upgrades = upgrades.filter((u) => u.name !== name)
    upgradesMade.push(upgrades)
    removeStoreItem(name)
}

export const createStore = () => {
    storeBox = $id('store')
}

export const updateStore = (delta) => {
    // if (errorTimer < errorTime) {
    //     errorTimer += delta
    //     if (errorTimer > errorTime) {
    //         $queryAll('.error-text').map((item) => { item.innerText = '' })
    //     }
    // }

    // PERF:
    upgrades.forEach((u) => {
        $query(`#store-item_${u.name} > button`).disabled = u.price > State.dollars
    })
}

let possibleUpgrades = [
    { name: 'coin-10', price: 10, text: 'Weighted coin', info: 'Increase heads chance by 10%' },
    { name: 'coin-5', price: 1000, text: 'Specialty Engraving', info: 'Increase heads chance by 5%' },
    { name: 'coin-3', price: 100000, text: 'Flip Seminar Weeked', info: 'Increase heads chance by 3%' },
    { name: 'coin-max-5', price: 25, text: 'Enthusiasm', info: 'Max bet on coin flips is $5' },
    { name: 'coin-max-10', price: 2500, text: 'Hoodwink', info: 'Max bet on coin flips is $10' },
    { name: 'coin-auto-1', price: 100, text: 'Autoflip', info: 'Flip a coin every second' },
    { name: 'unlock-war', price: 100, text: 'War', info: 'Fun card game for kids' },
    { name: 'war-auto-1', price: 1000, text: 'Autowar', info: 'New game of war every second' },
    { name: 'war-auto-2', price: 10000, text: 'Superwar', info: 'New game of war every half-second' },
    { name: 'war-auto-3', price: 100000, text: 'Superwar', info: 'New game of war every quarter-second' },
    { name: 'war-auto-4', price: 1000000, text: 'Ultrawar', info: 'New game of war every tenth-second' },
    { name: 'war-2-percent-ace', price: 100, text: 'Ace draw', info: '2% chance of drawing an ace' },
    { name: 'war-triple-tie', price: 1000, text: 'Triple tie', info: 'Pays 1000 to 1 on three ties' },
    { name: 'unlock-poker', price: 10000, text: 'Poker', info: 'Game for cowboys and idiots' },
    { name: 'unlock-blackjack', price: 1000000, text: 'Blackjack', info: 'Game for cowboys and idiots' },
    { name: 'unlock-rps', price: 100000000, text: 'Rock, Paper, Scissors', info: 'More important than your life' }
]

export const pushStoreItem = (item) => {
    const div = $create('div')
    div.className = 'store-item'
    div.id = `store-item_${item.name}`

    const textWidth = 50
    const priceString = formatPrice(item.price)
    let spaces = ''
    for (let i = 0; i < textWidth - item.text.length - priceString.length; i++) {
        spaces += ' '
    }

    const text = $create('p')
    text.className = 'bold'
    text.innerText = item.text + spaces + priceString

    const description = $create('p')
    description.innerText = item.info

    const button = $create('button')
    button.innerText = 'Buy'
    button.disabled = true
    button.onclick = () => doUpgrade(item.name)

    const errorText = $create('p')
    errorText.className = 'error-text'

    div.appendChild(text)
    div.appendChild(description)
    div.appendChild(button)
    div.appendChild(errorText)

    storeBox.appendChild(div)
}

export const removeStoreItem = (name) => {
    const item = $id(`store-item_${name}`)
    if (!item) {
        throw 'Cannot find store item to remove'
    }
    item.remove()
}

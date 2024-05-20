import { totalGames, totalFlips, totalWars, totalPokerGames, totalBjGames } from './stats.js'
import { $id, $query, $create, formatPrice } from './ui.js'
import { upgradeAutoFlip, upgradeHeadsChance, upgradeMaxCoinBet } from './games/coin-flip.js'
import State from './state.js'
import { removeWarCard, unlockTripleTie, unlockWar, upgradeAutoWar, upgradeMaxWarBet, upgradeWarAcePercent } from './games/war.js'
import { time } from './main.js'
import { addPokerCard, addPokerStrategy, bitFlip, unlockPoker, upgradeAutoPoker, upgradeLoPair, upgradeMaxPokerBet } from './games/poker.js'
import { addBjSpy, addBjStrategy, showBjCount, upgradeAutoBj, upgradeBjAmount, removeBjDecks, unlockBj } from './games/blackjack.js'
import { unlockRps } from './games/rps.js'

let upgrades = []
const upgradesMade = []
let storeBox

const showUpgrade = (name) => {
  const upgrade = possibleUpgrades.find((u) => u.name === name)
  if (!upgrade) {
    // TODO: remove
    // console.log(`No upgrade found for ${name}`)
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
  if (totalGames === 100) {
    showUpgrade('unlock-war')
  } else if (totalGames === 250) {
    showUpgrade('show-stats')
  } else if (totalGames === 500) {
    showUpgrade('show-stats')
  } else if (totalGames === 1000) {
    showUpgrade('unlock-poker')
  } else if (totalGames === 2500) {
    showUpgrade('show-logs')
  } else if (totalGames === 10000) {
    showUpgrade('unlock-blackjack')
  } else if (totalGames === 25000) {
    showUpgrade('unlock-rps')
  }

  if (totalFlips === 10) {
    showUpgrade('coin-10')
  } else if (totalFlips === 25) {
    showUpgrade('coin-max-5')
  } else if (totalFlips === 50) {
    showUpgrade('coin-auto-1')
  } else if (totalFlips === 250) {
    showUpgrade('coin-max-10')
  } else if (totalFlips === 350) {
    showUpgrade('coin-auto-2')
  } else if (totalFlips === 500) {
    showUpgrade('coin-5')
  } else if (totalFlips === 6500) {
    showUpgrade('coin-auto-4')
  } else if (totalFlips === 10000) {
    showUpgrade('coin-1')
  } else if (totalFlips === 20000) {
    showUpgrade('coin-auto-10')
  }

  if (totalWars === 10) {
    showUpgrade('war-auto-1')
  } else if (totalWars === 50) {
    showUpgrade('war-2-percent-ace')
  } else if (totalWars === 100) {
    showUpgrade('war-auto-2')
  } else if (totalWars === 200) {
    showUpgrade('war-triple-tie')
  } else if (totalWars === 300) {
    showUpgrade('war-remove-2')
  } else if (totalWars === 400) {
    showUpgrade('war-max-10')
  } else if (totalWars === 500) {
    showUpgrade('war-auto-4')
  } else if (totalWars === 1000) {
    showUpgrade('war-5-percent-ace')
  } else if (totalWars === 2500) {
    showUpgrade('war-auto-10')
  } else if (totalWars === 5000) {
    showUpgrade('war-max-25')
  } else if (totalWars === 10000) {
    showUpgrade('war-remove-3')
  } else if (totalWars === 25000) {
    showUpgrade('war-remove-4')
  } else if (totalWars === 50000) {
    showUpgrade('war-remove-5')
  }

  if (totalPokerGames === 10) {
    showUpgrade('poker-auto-1')
  } else if (totalPokerGames === 200) {
    showUpgrade('poker-add-jack-clubs')
  } else if (totalPokerGames === 250) {
    showUpgrade('poker-strat-keep-pairs')
  } else if (totalPokerGames === 300) {
    showUpgrade('poker-add-queen-hearts')
  } else if (totalPokerGames === 400) {
    showUpgrade('poker-add-king-diamonds')
  } else if (totalPokerGames === 500) {
    showUpgrade('poker-bitflip')
  } else if (totalPokerGames === 600) {
    showUpgrade('poker-add-ace-spades')
  } else if (totalPokerGames === 750) {
    showUpgrade('poker-strat-flush')
  } else if (totalPokerGames === 1000) {
    showUpgrade('poker-max-200')
  } else if (totalPokerGames === 1250) {
    showUpgrade('poker-strat-smart')
  } else if (totalPokerGames === 5000) {
    showUpgrade('poker-lo-pair')
  }

  if (totalBjGames === 10) {
    showUpgrade('bj-auto-1')
  } else if (totalBjGames === 25) {
    showUpgrade('show-bj-count')
  } else if (totalBjGames === 200) {
    showUpgrade('bj-blackjack-2')
  } else if (totalBjGames === 400) {
    showUpgrade('bj-strat-dealer')
  } else if (totalBjGames === 500) {
    showUpgrade('bj-remove-two-decks')
  } else if (totalBjGames === 600) {
    showUpgrade('bj-remove-one-deck-1')
  } else if (totalBjGames === 700) {
    showUpgrade('bj-remove-one-deck-2')
  } else if (totalBjGames === 800) {
    showUpgrade('bj-remove-one-deck-3')
  } else if (totalBjGames === 900) {
    showUpgrade('bj-strat-spy')
  } else if (totalBjGames === 1000) {
    showUpgrade('bj-max-10000')
  } else if (totalBjGames === 10000) {
    showUpgrade('bj-max-100000')
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
  if (name === 'coin-10') {
    upgradeHeadsChance(0.1)
  } else if (name === 'show-stats') {
    $id('stats').classList.remove('display-none')
  } else if (name === 'show-logs') {
    $id('logs').classList.remove('display-none')
  } else if (name === 'coin-5') {
    upgradeHeadsChance(0.05)
  } else if (name === 'coin-3') {
    upgradeHeadsChance(0.03)
  } else if (name === 'coin-max-5') {
    upgradeMaxCoinBet(4)
  } else if (name === 'coin-max-10') {
    upgradeMaxCoinBet(5)
  } else if (name === 'coin-auto-1') {
    upgradeAutoFlip(1000)
  } else if (name === 'coin-auto-2') {
    upgradeAutoFlip(500)
  } else if (name === 'coin-auto-4') {
    upgradeAutoFlip(250)
  } else if (name === 'coin-auto-10') {
    upgradeAutoFlip(100)
  } else if (name === 'unlock-war') {
    unlockWar()
  } else if (name === 'war-triple-tie') {
    unlockTripleTie()
  } else if (name === 'war-2-percent-ace') {
    upgradeWarAcePercent(0.02)
  } else if (name === 'war-5-percent-ace') {
    upgradeWarAcePercent(0.03)
  } else if (name === 'war-remove-2') {
    removeWarCard('2')
  } else if (name === 'war-max-10') {
    upgradeMaxWarBet(5)
  } else if (name === 'war-max-25') {
    upgradeMaxWarBet(15)
  } else if (name === 'war-auto-1') {
    upgradeAutoWar(1000)
  } else if (name === 'war-auto-2') {
    upgradeAutoWar(500)
  } else if (name === 'war-auto-4') {
    upgradeAutoWar(250)
  } else if (name === 'war-auto-10') {
    upgradeAutoWar(100)
  } else if (name === 'unlock-poker') {
    unlockPoker()
  } else if (name === 'poker-auto-1') {
    upgradeAutoPoker(1000)
  } else if (name === 'poker-max-200') {
    upgradeMaxPokerBet(100)
  } else if (name === 'poker-add-ace-spades') {
    addPokerCard('AS')
  } else if (name === 'poker-add-king-diamonds') {
    addPokerCard('KD')
  } else if (name === 'poker-add-queen-hearts') {
    addPokerCard('QH')
  } else if (name === 'poker-add-jack-clubs') {
    addPokerCard('JC')
  } else if (name === 'poker-bitflip') {
    bitFlip()
  } else if (name === 'poker-strat-keep-pairs') {
    addPokerStrategy('pairs')
  } else if (name === 'poker-strat-flush') {
    addPokerStrategy('flush')
  } else if (name === 'poker-strat-smart') {
    addPokerStrategy('smart')
  } else if (name === 'poker-lo-pair')  {
    upgradeLoPair()
  } else if (name === 'unlock-blackjack') {
    unlockBj()
  } else if (name === 'bj-auto-1') {
    upgradeAutoBj(1000)
  } else if (name === 'show-bj-count') {
    showBjCount()
  } else if (name === 'bj-blackjack-2') {
    upgradeBjAmount()
  } else if (name === 'bj-strat-dealer') {
    addBjStrategy('dealer-plus')
  } else if (name === 'bj-remove-two-decks') {
    removeBjDecks(2)
  } else if (name === 'bj-remove-one-deck-1') {
    removeBjDecks(1)
  } else if (name === 'bj-remove-one-deck-2') {
    removeBjDecks(1)
  } else if (name === 'bj-remove-one-deck-3') {
    removeBjDecks(1)
  } else if (name === 'bj-strat-spy') {
    addBjSpy(1)
    addBjStrategy('spy')
  } else if (name === 'unlock-rps') {
    unlockRps()
  } else {
    console.warn(`No upgrade for ${name}`)
  }

  console.log(`upgrade ${name} at ${Math.round(time)}`)

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
  { name: 'coin-5', price: 100, text: 'Specialty Engraving', info: 'Increase heads chance by 5%' },
  { name: 'coin-3', price: 1000, text: 'Flip Seminar Weeked', info: 'Increase heads chance by 3%' },
  { name: 'coin-max-5', price: 25, text: 'Enthusiasm', info: 'Max bet on coin flips is $5' },
  { name: 'coin-max-10', price: 250, text: 'Hoodwink', info: 'Max bet on coin flips is $10' },
  { name: 'coin-max-25', price: 500, text: 'Dupe', info: 'Max bet on coin flips is $25' },
  { name: 'coin-auto-1', price: 100, text: 'Autoflip', info: 'Flip a coin every second' },
  { name: 'coin-auto-2', price: 250, text: 'Autoflip 2', info: 'Flip a coin twice every second' },
  { name: 'coin-auto-4', price: 6500, text: 'Autoflip 4', info: 'Flip a coin four times every second' },
  { name: 'coin-auto-10', price: 20000, text: 'Autoflip 10', info: 'Flip a coin ten times per second' },
  { name: 'unlock-war', price: 100, text: 'War', info: 'Fun card game for kids' },
  { name: 'war-max-10', price: 200, text: 'Playground smarts', info: 'Max bet on war games is $10' },
  { name: 'war-max-25', price: 300, text: 'Street smarts', info: 'Max bet on war games is $25' },
  { name: 'war-auto-1', price: 150, text: 'Autowar', info: 'New game of war every second' },
  { name: 'war-auto-2', price: 250, text: 'Superwar', info: 'New game of war every half-second' },
  { name: 'war-auto-4', price: 400, text: 'Megawar', info: 'New game of war every quarter-second' },
  { name: 'war-auto-10', price: 1600, text: 'Ultrawar', info: 'New game of war every tenth-second' },
  { name: 'war-2-percent-ace', price: 200, text: 'Ace draw', info: '2% chance of drawing an ace' },
  { name: 'war-5-percent-ace', price: 500, text: 'Fast hands', info: '5% chance of drawing an ace' },
  { name: 'war-triple-tie', price: 1000, text: 'Triple tie', info: 'Pays 1000 to 1 on three war ties' },
  { name: 'war-remove-2', price: 500, text: 'No more 2s', info: 'Remove all 2s from the war deck' },
  { name: 'war-remove-3', price: 5000, text: 'Threes Company', info: 'Remove all 3s from the war deck' },
  { name: 'war-remove-4', price: 50000, text: 'Fours a crowd', info: 'Remove all 4s from the war deck' },
  { name: 'war-remove-5', price: 500000, text: 'No more fives', info: 'Remove all 5s from the war deck' },
  { name: 'unlock-poker', price: 1000, text: 'Poker', info: 'Game for cowboys and idiots' },
  { name: 'poker-max-200', price: 10000, text: 'Change states', info: 'Max poker bet of $200' },
  // { name: 'poker-max-500', price: 10000, text: 'Change states', info: 'Max poker bet of $200' },
  // { name: 'poker-max-1000', price: 10000, text: 'Change states', info: 'Max poker bet of $200' },
  { name: 'poker-auto-1', price: 1000, text: 'Autopoker', info: 'New poker hand and draw every second' },
  { name: 'poker-auto-2', price: 2000, text: 'Superpoker', info: 'New poker hand and draw twice per second' },
  { name: 'poker-auto-4', price: 4000, text: 'Megapoker', info: 'New poker hand and draw four times per second' },
  { name: 'poker-auto-10', price: 8000, text: 'Ultrapoker', info: 'New poker hand and draw ten times per second' },
  { name: 'poker-strat-flush', price: 500, text: 'Flush focused', info: 'Pretty, but not a good poker strategy' },
  { name: 'poker-strat-keep-pairs', price: 1000, text: 'Keep pairs', info: 'Strategy explains itself' },
  { name: 'poker-add-jack-clubs', price: 1111, text: 'Jack of Clubs', info: 'Extra jack wouldn\'t hurt' },
  { name: 'poker-add-queen-hearts', price: 2222, text: 'Queen of hearts', info: 'Queen!' },
  { name: 'poker-add-king-diamonds', price: 3333, text: 'King of diamonds', info: 'Extra king for you' },
  { name: 'poker-add-ace-spades', price: 4444, text: 'Ace of spades', info: 'Like the song' },
  { name: 'poker-bitflip', price: 5000, text: 'Bitflip', info: 'All poker 2s are now 10s' },
  { name: 'poker-strat-smart', price: 7777, text: 'Smart strat', info: 'Mitigate risk but go high' },
  { name: 'poker-lo-pair', price: 100000, text: 'Lo-Pair wins', info: 'Get money back with lo-pairs' },
  { name: 'unlock-blackjack', price: 10000, text: 'Blackjack', info: :'Game for cowboys and idiots' },
  { name: 'bj-auto-1', price: 10000, text: 'Autojack', info: 'New game of blackjack every second' },
  { name: 'bj-auto-2', price: 20000, text: 'Superjack', info: 'New game of blackjack twice per second' },
  { name: 'bj-auto-4', price: 40000, text: 'Megajack', info: 'New game of blackjack for times per second' },
  { name: 'show-bj-count', price: 12500, text: 'Show the count', info: 'They wont notice your ability to count cards' },
  { name: 'bj-strat-dealer', price: 15000, text: 'Dealer+ strat', info: 'Hit according to dealers visible card' },
  { name: 'bj-blackjack-2', price: 20000, text: 'Bribe the mayor', info: 'Blackjack pays 2-to-1' },
  { name: 'bj-remove-two-decks', price: 30000, text: 'Cut the deck', info: 'Remove two blackjack decks' },
  { name: 'bj-remove-one-deck-1', price: 40000, text: 'New orders', info: 'Remove a single blackjack deck' },
  { name: 'bj-remove-one-deck-2', price: 50000, text: 'Slimming down', info: 'Remove another blackjack deck' },
  { name: 'bj-remove-one-deck-3', price: 60000, text: 'Lock in', info: 'Remove yet another blackjack deck' },
  { name: 'bj-strat-spy', price: 100000, text: 'X-ray specs', info: 'See the blackjack dealers hand. Comes with strat' },
  { name: 'unlock-rps', price: 100000, text: 'Rock, Paper, Scissors', info: 'A real game. You may pay with your life.' },
  { name: 'show-stats', price: 250, text: 'Show Stats', info: 'If you\'re into that type of thing' },
  { name: 'show-logs', price: 2500, text: 'Show Logs', info: 'May cause performance issues' },
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

  storeBox.prepend(div)

  div.scrollIntoView()
}

export const removeStoreItem = (name) => {
  const item = $id(`store-item_${name}`)
  if (!item) {
    throw 'Cannot find store item to remove'
  }
  item.remove()
}

// TODO: remove
window.possibleUpgrades = possibleUpgrades
window.upgradesMade = upgradesMade

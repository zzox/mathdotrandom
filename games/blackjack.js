import { makeDeck, shuffleDeck, drawCard, warCardValue, removeCard, pullCard, evaulateBjValues, evaulateFinalBjValues } from '../card-deck.js'
import { $id, $queryAll, formatPercent, formatRate, formatPrice, loseWinTie, suitToHtml } from '../ui.js'
import State, { checkRandom } from '../state.js'

let unlocked = false
let bjState = 'ready'

let bjBet
let betAmount = 1
let maxBet = 1000

let blackjackAmount = 1.5

let bjGuessOn = false
let bjGuessTimer = 0
let bjGuessTime = 1000

let deck
let dealerCards = []
let playerCards = []

let dealBjButton, hitBjButton, standBjButton

export const createBj = () => {
  dealBjButton = $id('bj-button-deal')
  dealBjButton.onclick = () => {
    dealBj()
  }

  hitBjButton = $id('bj-button-hit')
  hitBjButton.onclick = () => {
    hitBj()
  }

  standBjButton = $id('bj-button-stand')
  standBjButton.onclick = () => {
    standBj()
  }

  bjBet = $id('bj-bet')
  bjBet.onchange = (event) => {
    betAmount = parseInt(event.target.value > State.dollars ? State.dollars : event.target.value)
    if (!betAmount) {
      betAmount = 1
    }
  }

  $id('bj-auto-guess-box').onchange = (event) => {
    bjGuessOn = event.target.checked
  }

  deck = makeDeck(6)
  shuffleDeck(deck)
}

const lockButtons = () => {
  dealBjButton.disabled = true
  hitBjButton.disabled = false
  standBjButton.disabled = false
}

const unlockButtons = () => {
  dealBjButton.disabled = false
  hitBjButton.disabled = true
  standBjButton.disabled = true
}

const updateDealerBjUi = (num, hide = false) => {
  if (num > 11) return

  console.log(num, $queryAll(`bj-dealer-card-${num}`))
  $queryAll(`.bj-dealer-card-${num}`).forEach(item => item.classList.remove('display-none'))
  $id(`bj-dealer-number-${num}`).innerText = hide ? 'X' : dealerCards[num][0]
  $id(`bj-dealer-suit-${num}`).innerHTML = hide ? 'X' :  suitToHtml[dealerCards[num][1]]
}

const updatePlayerBjUi = (num) => {
  if (num > 11) return

  $queryAll(`.bj-player-card-${num}`).forEach(item => item.classList.remove('display-none'))
  $id(`bj-player-number-${num}`).innerText = playerCards[num][0]
  $id(`bj-player-suit-${num}`).innerHTML = suitToHtml[playerCards[num][1]]
}

const resetCardUi = () => {
  for (let i = 0; i < 11; i++) {
    $id(`bj-dealer-number-${i}`).innerText = ''
    $id(`bj-dealer-suit-${i}`).innerHTML = ''
    $id(`bj-player-number-${i}`).innerText = ''
    $id(`bj-player-suit-${i}`).innerHTML = ''
  }

  for (let i = 2; i < 11; i++) {
    $queryAll(`.bj-dealer-card-${i}`).forEach(item => item.classList.add('display-none'))
    $queryAll(`.bj-player-card-${i}`).forEach(item => item.classList.add('display-none'))
  }

  $id('bj-player-amount').innerText = ''
  $id('bj-dealer-amount').innerText = ''
}

const updateBjUi = (hidden = true) => {
  for (let i = 0; i < dealerCards.length; i++) {
    updateDealerBjUi(i, i === 0 && hidden)
  }

  for (let i = 0; i < playerCards.length; i++) {
    updatePlayerBjUi(i)    
  }

  const playerValues = evaulateBjValues(playerCards)
  if (playerValues[0] === playerValues[1] || playerValues[1] > 21) {
    $id('bj-player-amount').innerText = playerValues[0]
  } else {
    $id('bj-player-amount').innerText = `${playerValues[0]} or ${playerValues[1]}`
  }

  if (!hidden) {
    const dealerValues = evaulateBjValues(dealerCards)
    if (dealerValues[0] === dealerValues[1] || dealerValues[1] > 21) {
      $id('bj-dealer-amount').innerText = dealerValues[0]
    } else {
      $id('bj-dealer-amount').innerText = `${dealerValues[0]} or ${dealerValues[1]}`
    }
  }
}

export const dealBj = () => {
  // if (!unlocked) {
  //   throw 'Locked'
  // }

  playerCards = []
  dealerCards = []
  resetCardUi()

  State.checkIsBroke()

  dealerCards.push(drawCard(deck))
  dealerCards.push(drawCard(deck))

  playerCards.push(drawCard(deck))
  playerCards.push(drawCard(deck))

  const playerValues = evaulateBjValues(playerCards)
  const dealerValues = evaulateBjValues(dealerCards)

  if (dealerValues[1] === 21 && playerValues[1] === 21) {
    pushBj(true)
  } else if (playerValues[1] === 21) {
    winBj(true)
  } else if (dealerValues[1] === 21) {
    loseBj(true)
  } else {
    updateBjUi(true)
    lockButtons()
  }

  State.subtractScore(betAmount)
}

export const hitBj = () => {
  playerCards.push(drawCard(deck))

  const playerValues = evaulateBjValues(playerCards)

  if (playerValues[1] > 21) {
    drawDealerCards()
    loseBj()
  } else if (playerValues[0] === 21 || playerValues[1] === 21) {
    standBj()
  } else {
    updateBjUi()
  }
}

export const standBj = () => {
  drawDealerCards()

  const playerValue = evaulateFinalBjValues(playerCards)
  const dealerValue = evaulateFinalBjValues(dealerCards)
  if (dealerValue > 21) {
    winBj(true)
  } else if (dealerValue === playerValue) {
    pushBj()
  } else if (playerValue > dealerValue) {
    winBj()
  } else {
    loseBj()
  }
}

const drawDealerCards = () => {
  while (true) {
    dealerCards.push(drawCard(deck))
    const dealerValues = evaulateBjValues(dealerCards)
    if (dealerValues[0] >= 16 || dealerValues[1] >= 17) {
      return
    }
  }
}

const winBj = (isBlackJack) => {
  if (isBlackJack) {
    State.updateScore(Math.floor(betAmount + betAmount * blackjackAmount), {})
  } else {
    State.updateScore(Math.floor(betAmount + betAmount), {})
  }

  updateBjUi(false)
  unlockButtons()
}

const loseBj = (isBlackJack) => {
  State.updateScore(0, {})
  updateBjUi(false) 
  unlockButtons()
}

const pushBj = () => {
  State.updateScore(betAmount, {})
  updateBjUi(false)
  unlockButtons()
}

export const updateBj = (delta) => {
  if (bjGuessOn) {
    // bjGuessTimer += delta
    if (bjGuessTimer >= bjGuessTime) {
      bjGuessTimer -= bjGuessTime
    }
  }

  if (bjBet.value > maxBet) {
    bjBet.value = maxBet
  }

  // if (warBet.value * 5 > State.dollars) {
  //     betAmount = Math.floor(State.dollars / 5)
  //     warBet.value = Math.floor(State.dollars / 5)
  // }

  if (bjBet.value > State.dollars) {
    betAmount = State.dollars
    bjBet.value = State.dollars

    // disable autoguess if too broke
    $id('bj-auto-guess-box').checked = false
    bjGuessOn = false
    console.warn('Cannot bet money you dont have')
  }
}

export const upgradeAutoBj = (time) => {
  bjGuessTime = time
  $id('bj-auto-guess').classList.remove('display-none')
  $id('bj-auto-guess-rate').innerText = ` ${formatRate(time)}`
}

export const upgradeMaxBjBet = (newMax) => {
  maxBet = newMax
  $id('bj-max').innerText = `Max: ${formatPrice(newMax)}`
  $id('bj-bet').max = newMax
}

export const unlockBj = () => {
  unlocked = true
  $id('blackjack').classList.remove('display-none')
}

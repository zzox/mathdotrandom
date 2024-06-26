import { makeDeck, shuffleDeck, drawCard, warCardValue, removeCard, pullCard } from '../card-deck.js'
import { $id, $queryAll, formatPercent, formatRate, formatPrice, loseWinTie, suitToHtml } from '../ui.js'
import State, { checkRandom } from '../state.js'
import { checkNumber, checkNumberWithZero } from '../util.js'

let warBet//, tripleTieBet
let betAmount = 1
// let tripleTieBetAmount = 0
let maxBet = 5

let warGuessOn = false
let warGuessTimer = 0
let warGuessTime = 1000

let pullAcePercent = 0.0

let deck

let playWarButton

export const createWar = () => {
  playWarButton = $id('war-button')
  playWarButton.onclick = () => {
    playWar()
  }

  warBet = $id('war-bet')
  warBet.onchange = (event) => {
    betAmount = checkNumber(event.target.value, State.dollars)
    warBet.value = betAmount
  }

  // tripleTieBet = $id('war-triple-tie-bet')
  // tripleTieBet.onchange = (event) => {
  //   tripleTieBetAmount = checkNumberWithZero(event.target.value, State.dollars)
  //   tripleTieBet.value = tripleTieBetAmount
  // }

  $id('war-auto-guess-box').onchange = (event) => {
    warGuessOn = event.target.checked
  }

  deck = makeDeck()
  shuffleDeck(deck)
}

const updateCardUi = (num, oppCard, playerCard, result) => {
  const opponentCardNumber = $id(`opp-card-number-${num}`)
  const opponentCardSuit = $id(`opp-card-suit-${num}`)

  const playerCardNumber = $id(`player-card-number-${num}`)
  const playerCardSuit = $id(`player-card-suit-${num}`)

  opponentCardNumber.innerText = oppCard[0]
  opponentCardSuit.innerHTML = suitToHtml[oppCard[1]]
  playerCardNumber.innerText = playerCard[0]
  playerCardSuit.innerHTML = suitToHtml[playerCard[1]]

  if (num === 2 || result !== 'tie') {
    $id(`war-result-${num}`).innerText = loseWinTie[result]
  }

  $queryAll(`.war-column-${num}`).forEach((item) => { item.classList.remove('display-none') })
}

const resetCardUi = () => {
  $id('opp-card-number-0').innerText = ' '
  $id('opp-card-suit-0').innerText = ' '
  $id('player-card-number-0').innerText = ' '
  $id('player-card-suit-0').innerText = ' '
  $id('opp-card-number-1').innerText = ' '
  $id('opp-card-suit-1').innerText = ' '
  $id('player-card-number-1').innerText = ' '
  $id('player-card-suit-1').innerText = ' '
  $id('opp-card-number-2').innerText = ' '
  $id('opp-card-suit-2').innerText = ' '
  $id('player-card-number-2').innerText = ' '
  $id('player-card-suit-2').innerText = ' '
  $id('war-result-0').innerText = '    '
  $id('war-result-1').innerText = '    '
  $id('war-result-2').innerText = '    '
  $queryAll('.war-column-1').forEach((item) => { item.classList.add('display-none') })
  $queryAll('.war-column-2').forEach((item) => { item.classList.add('display-none') })
}

const playWar = (isAuto = false) => {
  resetCardUi()

  State.checkIsBroke()

  let result = 'tie'
  let drawNum, oppCard, playerCard
  let numTies = 0
  for (drawNum = 0; drawNum < 3; drawNum++) {
    oppCard = drawCard(deck)
    if (checkRandom(pullAcePercent)) {
      playerCard = pullCard(deck, 'A')
    } else {
      playerCard = drawCard(deck)
    }

    const oppValue = warCardValue[oppCard[0]]
    const playerValue = warCardValue[playerCard[0]]

    if (playerValue > oppValue) {
      result = 'win'
    } else if (oppValue > playerValue) {
      result = 'lose'
    }

    updateCardUi(drawNum, oppCard, playerCard, result)

    if (result !== 'tie') {
      break
    } else {
      numTies++
    }
  }

  const data = {
    result,
    playerCard: playerCard[0] + suitToHtml[playerCard[1]],
    oppCard: oppCard[0] + suitToHtml[oppCard[1]],
    game: 'war',
    isAuto
  }

  // let tieResultAmount = 0
  // if (numTies === 1) {
  //   tieResultAmount = 11 * tieBetAmount
  // }

  // if (numTies === 2) {
  //   tieResultAmount = 101 * tieBetAmount
  // }

  // if (numTies === 3) {
  //   tieResultAmount = 5001 * tieBetAmount
  // }

  // if (result === 'win') {
  //   State.updateScore(betAmount * (drawNum * 2 + 1) - tripleTieBetAmount, data)
  // } else if (result === 'lose') {
  //   State.updateScore(betAmount * -(drawNum * 2 + 1) - tripleTieBetAmount, data)
  // } else {
  //   // console.warn('triple tie!!!')
  //   State.updateScore(tripleTieBetAmount * 1000, data)
  // }

  if (result === 'win') {
    State.updateScore(betAmount * (drawNum * 2 + 1), data)
  } else if (result === 'lose') {
    State.updateScore(betAmount * -(drawNum * 2 + 1), data)
  } else {
    // console.warn('triple tie!!!')
    State.updateScore(0, data)
  }
}

export const updateWar = (delta) => {
  if (warGuessOn) {
    warGuessTimer += delta
    if (warGuessTimer >= warGuessTime) {
      playWar(true)
      warGuessTimer -= warGuessTime
    }
  }

  if (warBet.value > maxBet) {
    warBet.value = maxBet
  }

  // if (tieBet.value > maxBet) {
  //   tieBet.value = maxBet
  // }

  // if (warBet.value * 5 > State.dollars) {
  //     betAmount = Math.floor(State.dollars / 5)
  //     warBet.value = Math.floor(State.dollars / 5)
  // }

  if (warBet.value * 5 /* + tripleTieBet.value * 5 */ > State.dollars) {
    betAmount = Math.min(betAmount, Math.floor(State.dollars / 10))
    warBet.value = Math.min(betAmount, Math.floor(State.dollars / 10))

    // tripleTieBetAmount = Math.min(tripleTieBetAmount, Math.floor(State.dollars / 10))
    // tripleTieBet.value = Math.min(tripleTieBetAmount, Math.floor(State.dollars / 10))

    // disable autoguess if too broke
    $id('war-auto-guess-box').checked = false
    warGuessOn = false
    console.warn('Cannot bet money you dont have')
  }
}

export const upgradeAutoWar = (time) => {
  if (time > warGuessTime) {
    console.warn('higher time, disregarding')
    return
  }

  warGuessTime = time
  $id('war-auto-guess').classList.remove('display-none')
  $id('war-auto-guess-rate').innerText = ` ${formatRate(time)}`
}

export const upgradeMaxWarBet = (maxIncrease) => {
  maxBet += maxIncrease
  $id('war-bet').max = maxBet
  $id('war-max').innerText = formatPrice(maxBet)
  // $id('war-triple-tie-bet').max = maxBet
  // $id('war-triple-tie-max').innerText = formatPrice(maxBet)
}

export const upgradeWarAcePercent = (percent) => {
  pullAcePercent += percent
  $id('war-ace-percent').classList.remove('display-none')
  $id('war-ace-percent').innerHTML = `Ace draw: <span class="bold">${formatPercent(pullAcePercent)}</span>`
}

// export const unlockTripleTie = () => {
//   $id('triple-tie').classList.remove('display-none')
//   $queryAll('.war-results-triple').forEach((item) => item.classList.remove('display-none'))
// }

export const removeWarCard = (cardString) => {
  removeCard(cardString, deck)
}

export const unlockWar = () => {
  $id('war').classList.remove('display-none')
  $id('war-info').classList.remove('display-none')
  $queryAll('.war-results').forEach((item) => item.classList.remove('display-none'))
}

export const destroyWar = () => {
  playWarButton.disabled = true
}

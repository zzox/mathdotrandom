import { makeDeck, shuffleDeck, drawCard, warCardValue, pullCard } from '../card-deck.js'
import { $id, $queryAll, formatPercent, formatRate, loseWinTie, suitToHtml } from '../ui.js'
import State, { checkRandom } from '../state.js'

let unlocked = false

let warBet, tripleTieBet
let betAmount = 1
let tripleTieBetAmount = 0
let maxBet = 10

// let resultShowTimer = 0
// const resultShowTime = 3000

let warGuessOn = false
let warGuessTimer = 0
const warGuessTime = 1000

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
        betAmount = parseInt(event.target.value > State.dollars ? State.dollars : event.target.value)
        if (!betAmount) {
            betAmount = 1
        }
    }

    tripleTieBet = $id('triple-tie-bet')
    tripleTieBet.onchange = (event) => {
        tripleTieBetAmount = parseInt(event.target.value > State.dollars ? State.dollars : event.target.value)
        if (!tripleTieBetAmount) {
            tripleTieBetAmount = 0
        }
    }

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

export const playWar = (isAuto = false) => {
    if (!unlocked) {
        throw 'Locked'
    }

    resetCardUi()

    State.checkIsBroke()

    let result = 'tie'
    let drawNum, oppCard, playerCard
    for (drawNum = 0; drawNum < 3; drawNum++) {
        oppCard = drawCard(deck)
        if (checkRandom(pullAcePercent)) {
            playerCard = pullCard(deck, 'A')
        } else {
            playerCard = drawCard(deck)
        }

        console.log(oppCard, playerCard)

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
        }
    }

    const data = {
        result, playerCard, oppCard, game: 'war', isAuto
    }

    if (result === 'win') {
        State.updateScore(betAmount * (drawNum * 2 + 1) - tripleTieBetAmount, data)
    } else if (result === 'lose') {
        State.updateScore(betAmount * -(drawNum * 2 + 1) - tripleTieBetAmount, data)
    } else {
        State.updateScore(tripleTieBetAmount * 1000, data)
    }

    // resultShowTimer = 0
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

    // if (warBet.value * 5 > State.dollars) {
    //     betAmount = Math.floor(State.dollars / 5)
    //     warBet.value = Math.floor(State.dollars / 5)
    // }

    if (warBet.value * 5 + tripleTieBet.value * 5 > State.dollars) {
        betAmount = Math.floor(State.dollars / 10)
        warBet.value = Math.floor(State.dollars / 10)
        tripleTieBetAmount = Math.floor(State.dollars / 10)
        tripleTieBet.value = Math.floor(State.dollars / 10)

        // disable autoguess if too broke
        // $id('coin-auto-guess-box').checked = false
        // coinGuessOn = false
        console.warn('Cannot bet money you dont have')
    }
}

export const upgradeAutoWar = (time) => {
    warGuessTimer = time
    $id('war-auto-guess').classList.remove('display-none')
    $id('war-auto-guess-rate').innerText = ` ${formatRate(time)}`
}

export const upgradeMaxWarBet = (newMax) => {
    maxBet = newMax
    $id('war-max').innerText = `Max: ${formatPrice(newMax)}`
    $id('war-bet').max = newMax
    $id('war-triple-tie-bet').max = newMax
}

export const upgradeWarAcePercent = (percent) => {
    pullAcePercent += percent
    $id('war-ace-percent').classList.remove('display-none')
    // its * 50 because we only look through draw pile if under a certain percent.
    // half 4% is 2%, 100 to get from decimal percent to display percent, half 100
    $id('war-ace-percent').innerHTML = `Ace draw: <span class="bold">${formatPercent(percent)}</span>`
}

export const unlockTripleTie = () => {
    $id('triple-tie').classList.remove('display-none')
}

export const removeCard = (cardString) => {
    if (cardString.length === 1) {
        deck.pile = deck.pile.filter((card) => card[0] !== cardString)
        deck.discarded = deck.discarded.filter((card) => card[0] !== cardString)
    } else if (cardString.length === 2) {
        deck.pile = deck.pile.filter((card) => card !== cardString)
        deck.discarded = deck.discarded.filter((card) => card !== cardString)
    }
}

export const unlockWar = () => {
    unlocked = true
    $id('war').classList.remove('display-none')
}

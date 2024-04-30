import { makeDeck, shuffleDeck, drawCard, warCardValue } from '../card-deck.js'
import { $id, $queryAll, loseWinTie } from '../ui.js'
import State from '../state.js'

let warBet
let betAmount = 1

let resultShowTimer = 0
const resultShowTime = 3000

let tripleTieOn = false
let tripleTieWager = 1

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

    deck = makeDeck()
    // TODO: remove pre-shuffle hack
    deck.discarded = deck.pile
    shuffleDeck(deck)
}

const updateCardUi = (num, oppCard, playerCard, result) => {
    const opponentCardNumber = $id(`opp-card-number-${num}`)
    const opponentCardSuit = $id(`opp-card-suit-${num}`)

    const playerCardNumber = $id(`player-card-number-${num}`)
    const playerCardSuit = $id(`player-card-suit-${num}`)

    opponentCardNumber.innerText = oppCard[0]
    opponentCardSuit.innerText = oppCard[1]
    playerCardNumber.innerText = playerCard[0]
    playerCardSuit.innerText = playerCard[1]

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

export const playWar = () => {
    resetCardUi()

    State.checkIsBroke()

    let result = 'tie'
    let drawNum, oppCard, playerCard
    for (drawNum = 0; drawNum < 3; drawNum++) {
        oppCard = drawCard(deck)
        playerCard = drawCard(deck)

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
        result, playerCard, oppCard, game: 'war', isAuto: false
    }

    if (result === 'win') {
        State.updateScore(betAmount * (drawNum * 2 + 1), data)
    } else if (result === 'lose') {
        State.updateScore(betAmount * -(drawNum * 2 + 1), data)
    } else if (tripleTieOn) {
        State.updateScore(tripleTieWager * 1000, data)
    } else {
        State.updateScore(tripleTieWager, data)
    }

    resultShowTimer = 0
}

export const updateWar = (delta) => {
    resultShowTimer += delta
    if (resultShowTimer >= resultShowTime) {
        resetCardUi()
    }

    if (warBet.value * 5 > State.dollars) {
        betAmount = Math.floor(State.dollars / 5)
        warBet.value = Math.floor(State.dollars / 5)

        // disable autoguess if too broke
        // $id('coin-auto-guess-box').checked = false
        // coinGuessOn = false
        throw 'Cannot bet money you dont have'
    }
}

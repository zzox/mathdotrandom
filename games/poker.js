import { makeDeck, shuffleDeck, drawCard } from '../card-deck.js'
import { $id, $queryAll, formatRate, loseWinTie } from '../ui.js'
import State from '../state.js'

let unlocked = true

let pokerBet
let betAmount = 1
let maxBet = 100
let pokerState = 'ready' // or, 'draw'
let cards = []
const cardHolds = [false, false, false, false, false]

let resultShowTimer = 0
const resultShowTime = 10000

let pokerGuessOn = false
let pokerGuessTimer = 0
const pokerGuessTime = 1000
let pokerGuessStrategy = 'jacks'

let deck

let dealPokerButton, drawPokerButton

export const createPoker = () => {
    dealPokerButton = $id('poker-button-deal')
    dealPokerButton.onclick = () => {
        pokerDeal()
    }

    drawPokerButton = $id('poker-button-draw')
    drawPokerButton.onclick = () => {
        pokerDraw()
    }

    pokerBet = $id('poker-bet')

    pokerBet.onchange = (event) => {
        betAmount = parseInt(event.target.value > State.dollars ? State.dollars : event.target.value)
        if (!betAmount) {
            betAmount = 1
        }
    }

    for (let i = 0; i < 5; i++) {
        $id(`poker-hold-${i}`).onchange = (event) => {
            cardHolds[i] = event.target.checked
        }
    }

    deck = makeDeck()
    shuffleDeck(deck)
}

const updatePokerUi = (card, num, isDraw) => {
    $id(`${isDraw ? 'draw' : 'deal'}-card-number-${num}`).innerText = card[0]
    $id(`${isDraw ? 'draw' : 'deal'}-card-suit-${num}`).innerText = card[1]
}

const lockPokerBetUi = () => {
    dealPokerButton.disabled = true
    drawPokerButton.disabled = false

    for (let i = 0; i < 5; i++) {
        $id(`poker-hold-${i}`).disabled = false
    }

    pokerBet.disabled = true
}

const unlockPokerBetUi = () => {
    dealPokerButton.disabled = false
    drawPokerButton.disabled = true

    for (let i = 0; i < 5; i++) {
        $id(`poker-hold-${i}`).disabled = false
    }

    pokerBet.disabled = false
}

const resetPokerUi = () => {
    for (let i = 0; i < 5; i++) {
        const hold = $id(`poker-hold-${i}`)
        hold.checked = false
        hold.disabled = true
        $id(`poker-hold-${i}`).checked = false
        $id(`deal-card-number-${i}`).innerText = ' '
        $id(`deal-card-suit-${i}`).innerText = ' '
        $id(`draw-card-number-${i}`).innerText = ' '
        $id(`draw-card-suit-${i}`).innerText = ' '
    }
    cards = []
    drawPokerButton.disabled = true
}

const pokerDeal = () => {
    if (!unlocked) {
        throw 'Locked'
    }

    if (pokerState !== 'ready') {
        throw 'Cannot deal'
    }

    // TODO: if auto, skip the ui updates as both steps happen at once
    resetPokerUi()
    lockPokerBetUi()
    
    shuffleDeck(deck)

    State.checkIsBroke()

    for (let card = 0; card < 5; card++) {
        cards.push(drawCard(deck))
    }
    cards.forEach((card, i) => updatePokerUi(card, i, false))

    State.subtractScore(betAmount)
}

const pokerDraw = () => {
    resultShowTimer = 0

    for (let card = 0; card < 5; card++) {
        if (!cardHolds[card]) {
            cards[card] = drawCard(deck)
        }
    }
    cards.forEach((card, i) => updatePokerUi(card, i, true))

    console.log(cards)

    unlockPokerBetUi()
    resultShowTimer = 0
}

export const updatePoker = () => {
    resultShowTimer += delta
    if (resultShowTimer >= resultShowTime) {
        resetPokerUi()
    }
}

import { makeDeck, shuffleDeck, drawCard, evaluatePokerHand, hiCard, pokerValue, loPair, warCardValue } from '../card-deck.js'
import { $id, suitToHtml } from '../ui.js'
import State from '../state.js'

let unlocked = true

let pokerBet
let betAmount = 1
let maxBet = 100
let pokerState = 'ready' // or, 'draw'
let cards = []
const cardHolds = [false, false, false, false, false]

// let resultShowTimer = 0
// const resultShowTime = 10000

let pokerGuessOn = false
let pokerGuessTimer = 0
const pokerGuessTime = 1000
let pokerGuessStrategy = 'jacks'

let deck

let dealPokerButton, drawPokerButton

export const pokerDisplayText = {
    'royal-flush': [' ROYAL', ' FLUSH!'],
    'straight-flush': ['STRAIGHT', ' FLUSH'],
    'four-of-kind': ['Four of', 'a kind'],
    'full-house': [' Full', ' House'],
    'flush': [' Flush', ' '],
    'straight': ['Straight', '' ],
    'three-of-kind': ['Three of', 'a kind'],
    'two-pair': ['Two pair', ' '],
    'hi-pair': ['Hi-Pair', ' '],
    'lo-pair': ['Lo-Pair', ' '],
    'hi-card': [' ', ' ']
}

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
    $id(`${isDraw ? 'draw' : 'deal'}-card-suit-${num}`).innerHTML = suitToHtml[card[1]]
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
        $id(`poker-hold-${i}`).disabled = true
    }

    pokerBet.disabled = false
}

const showPokerResultUi = (result, isDraw) => {
    $id(`${isDraw ? 'draw' : 'deal'}-result-line-0`).innerText = pokerDisplayText[result][0]
    $id(`${isDraw ? 'draw' : 'deal'}-result-line-1`).innerText = pokerDisplayText[result][1]
}

const resetPokerUi = () => {
    for (let i = 0; i < 5; i++) {
        const hold = $id(`poker-hold-${i}`)
        hold.checked = false
        hold.disabled = true
        cardHolds[i] = false
        $id(`poker-hold-${i}`).checked = false
        $id(`deal-card-number-${i}`).innerText = ' '
        $id(`deal-card-suit-${i}`).innerText = ' '
        $id(`draw-card-number-${i}`).innerText = ' '
        $id(`draw-card-suit-${i}`).innerText = ' '
    }
    // hack
    showPokerResultUi(hiCard, true)
    showPokerResultUi(hiCard, false)
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

    pokerState = 'draw'
    const result = evaluatePokerHand(cards)
    showPokerResultUi(result, false)

    State.subtractScore(betAmount)
}

const pokerDraw = (isAuto = false) => {
    if (pokerState !== 'draw') {
        throw 'Cannot draw'
    }

    for (let card = 0; card < 5; card++) {
        if (!cardHolds[card]) {
            cards[card] = drawCard(deck)
        }
    }
    cards.forEach((card, i) => updatePokerUi(card, i, true))

    unlockPokerBetUi()

    pokerState = 'ready'

    const result = evaluatePokerHand(cards)
    showPokerResultUi(result, true)

    cards.sort((a, b) => warCardValue[b[0]] - warCardValue[a[0]])

    const data = {
        handHtml: cards.map(card => card[0] + suitToHtml[card[1]]).join(''),
        wager: betAmount,
        game: 'poker',
        isAuto
    }

    if (result !== hiCard && result !== loPair) {
        State.updateScore(betAmount + betAmount * pokerValue[result], data)
    } else {
        State.updateScore(0, data)
    }
}

export const updatePoker = (delta) => {
    // TODO: see if its better to not hide games after results are shown,
    // seems to only make sense for coin-flip
    // resultShowTimer += delta
    // if (pokerState === 'ready' && resultShowTimer >= resultShowTime) {
    //     resetPokerUi()
    // }
}

export const unlockPoker = () => {
    unlocked = true
    $id('poker').classList.remove('display-none')
}

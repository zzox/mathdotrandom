import { makeDeck, shuffleDeck, drawCard, warCardValue } from '../card-deck.js'
import { $id } from '../ui.js'

let warBet
let betAmount = 1

let deck

let playWarButton,
opponentCardNumber,
opponentCardSuit,
playerCardNumber,
playerCardSuit

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

    opponentCardNumber = $id('opp-card-number')
    opponentCardSuit = $id('opp-card-suit')

    playerCardNumber = $id('player-card-number')
    playerCardSuit = $id('player-card-suit')
}

const updateCardUi = (num, oppCard, playerCard) => {
    opponentCardNumber.innerText = oppCard[0]
    opponentCardSuit.innerText = oppCard[1]
    playerCardNumber.innerText = playerCard[0]
    playerCardSuit.innerText = playerCard[1]
}

export const playWar = () => {
    // hide ties

    for (let drawNum = 0; drawNum < 5; drawNum++) {
        const oppCard = drawCard(deck)
        const playerCard = drawCard(deck)

        console.log(oppCard, playerCard)

        const oppValue = warCardValue[oppCard[0]]
        const playerValue = warCardValue[playerCard[0]]

        if (playerValue > oppValue) {
            State.updateScore(betAmount)
        } else if (oppValue > playerValue) {
            State.updateScore(-betAmount)
        }

        updateCardUi(drawNum, oppCard, playerCard)
    }
}

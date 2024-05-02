import { $create, $id, formatPrice } from '../ui.js'
import { pokerDisplayText } from './games/poker.js'

let resultBox

export const createResults = () => {
    resultBox = $id('results')
}

export const pushEvent = (result, scoreData) => {
    const p = $create('p')
    p.className = 'result-item'

    if (scoreData.game === 'coin-flip') {
        p.innerText = `Coin flip |  ${scoreData.choice}  ` +
        ` ${result < 0 ? 'lost' : 'won '} ${formatPrice(Math.abs(result))}` +
        (scoreData.isAuto ? ' [AUTO]' : '')
    } else if (scoreData.game === 'war') {
        if (scoreData.result === 'tie') {
            p.innerText = `War       | ${scoreData.playerCard} vs ${scoreData.oppCard}` +
            ` ties ${formatPrice(Math.abs(result))}` + (scoreData.isAuto ? ' [AUTO]' : '')
        } else {
            p.innerText = `War       | ${scoreData.playerCard} vs ${scoreData.oppCard}` +
            ` ${result < 0 ? 'lost' : 'won '} ${formatPrice(Math.abs(result))}` +
            (scoreData.isAuto ? ' [AUTO]' : '')
        }
    } else if (scoreData.game === 'poker') {
        p.innerText = `Poker     | bet ${formatPrice(scoreData.wager)} ` +
        `  ${result <= 0 ? 'lost' : 'won '} ${result <= 0 ? formatPrice(scoreData.wager) : formatPrice(result - scoreData.wager)} with ${scoreData.hand}` +
        (scoreData.isAuto ? ' [AUTO]' : '')
    }

    resultBox.insertBefore(p, resultBox.querySelector('p'))
}

import { $create, $id, formatPrice } from '../ui.js'

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
        p.innerText = `War       | ${scoreData.playerCard} vs ${scoreData.oppCard}` +
        ` ${result < 0 ? 'lost' : 'won '} ${formatPrice(Math.abs(result))}` +
        (scoreData.isAuto ? ' [AUTO]' : '')
    }
    resultBox.insertBefore(p, resultBox.querySelector('p'))
}

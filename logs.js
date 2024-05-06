import { $create, $id, formatPrice } from '../ui.js'

let logBox

export const createLogs = () => {
  logBox = $id('logs')
}

export const pushLog = (result, scoreData) => {
  const p = $create('p')
  p.className = 'log-item'

  if (scoreData.game === 'coin-flip') {
    p.innerText = `Coins |  ${scoreData.choice}  ` +
        ` ${result < 0 ? 'lost' : 'won '} ${formatPrice(Math.abs(result))}` +
        (scoreData.isAuto ? ' [AUTO]' : '')
  } else if (scoreData.game === 'war') {
    if (scoreData.result === 'tie') {
      p.innerText = `War   | ${scoreData.playerCard} vs ${scoreData.oppCard}` +
            ` ties ${formatPrice(Math.abs(result))}` + (scoreData.isAuto ? ' [AUTO]' : '')
    } else {
      p.innerText = `War   | ${scoreData.playerCard} vs ${scoreData.oppCard}` +
            ` ${result < 0 ? 'lost' : 'won '} ${formatPrice(Math.abs(result))}` +
            (scoreData.isAuto ? ' [AUTO]' : '')
    }
  } else if (scoreData.game === 'poker') {
    p.innerHTML = `Poker | wager ${formatPrice(scoreData.wager)}` +
        ` ${result <= 0 ? 'lost' : 'won '} ${result <= 0 ? formatPrice(scoreData.wager) : formatPrice(result)} with ${scoreData.handHtml}` +
        (scoreData.isAuto ? ' [AUTO]' : '')
  }

  logBox.insertBefore(p, logBox.querySelector('p'))
}

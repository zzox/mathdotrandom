import { $create, $id, formatPrice } from '../ui.js'

let logBox

export const createLogs = () => {
  logBox = $id('logs')
}

export const pushLog = (result, scoreData) => {
  const p = $create('p')
  p.className = 'log-item'

  if (scoreData.game === 'coin-flip') {
    p.innerText = `${scoreData.isAuto ? '[A]' : '   '} Coins |    ${scoreData.choice}   ` +
        `${result < 0 ? 'lost' : 'won '} ${formatPrice(Math.abs(result))}`
  } else if (scoreData.game === 'war') {
    if (scoreData.result === 'tie') {
      p.innerHTML = `${scoreData.isAuto ? '[A]' : '   '} War   |  ${scoreData.playerCard} vs ${scoreData.oppCard} ` +
            ` ties ${formatPrice(Math.abs(result))}`
    } else {
      p.innerHTML = `${scoreData.isAuto ? '[A]' : '   '} War   |  ${scoreData.playerCard} vs ${scoreData.oppCard} ` +
            ` ${result < 0 ? 'lost' : 'won '} ${formatPrice(Math.abs(result))}`
    }
  } else if (scoreData.game === 'poker') {
    p.innerHTML = `${scoreData.isAuto ? '[A]' : '   '} Poker | ${scoreData.handHtml} ${result > 0 ? 'won ' : 'lost'}` + 
        ` ${result > 0 ? formatPrice(result) : formatPrice(scoreData.wager)}`
  }

  logBox.insertBefore(p, logBox.querySelector('p'))
}

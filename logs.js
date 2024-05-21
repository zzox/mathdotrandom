import { $create, $id, formatPrice } from './ui.js'

let logBox
let logIndex = 0
let logItems = []

// moving to 1000 causes performance issues at the highest rates
const NUM_LOGS = 100

export const createLogs = () => {
  logBox = $id('logs')
  for (let i = 0; i < NUM_LOGS; i++) {
    const p = $create('p')
    p.className = 'log-item'
    logItems.push(p)
    logBox.appendChild(p)
  }
}

export const pushLog = (result, scoreData) => {
  logIndex = (logIndex + 1) % logItems.length
  const logItem = logItems[logIndex]

  if (scoreData.game === 'coin-flip') {
    logItem.innerText = `${scoreData.isAuto ? '[A]' : '   '} Coins |    ${scoreData.choice}   ` +
      `${result < 0 ? 'lost' : 'won '} ${formatPrice(Math.abs(result))}`
  } else if (scoreData.game === 'war') {
    if (scoreData.result === 'tie') {
      logItem.innerHTML = `${scoreData.isAuto ? '[A]' : '   '} War   |  ${scoreData.playerCard} vs ${scoreData.oppCard} ` +
        ` ties ${formatPrice(Math.abs(result))}`
    } else {
      logItem.innerHTML = `${scoreData.isAuto ? '[A]' : '   '} War   |  ${scoreData.playerCard} vs ${scoreData.oppCard} ` +
        ` ${result < 0 ? 'lost' : 'won '} ${formatPrice(Math.abs(result))}`
    }
  } else if (scoreData.game === 'poker') {
    logItem.innerHTML = `${scoreData.isAuto ? '[A]' : '   '} Poker | ${scoreData.handHtml} ${result > 0 ? 'won ' : 'lost'}` +
      ` ${result > 0 ? formatPrice(result) : formatPrice(scoreData.wager)}`
  } else if (scoreData.game === 'bj') {
    logItem.innerText = `${scoreData.isAuto ? '[A]' : '   '} BJack |  ${scoreData.playerTotal} vs ${scoreData.dealerTotal}  ${scoreData.result}` +
      ` ${result > 0 ? formatPrice(result - scoreData.wager) : formatPrice(scoreData.wager)}`
  } else if (scoreData.game === 'rps') {
    logItem.innerText = `    RPS   | ${scoreData.choice} vs ${scoreData.oppChoice} ` +
      `${scoreData.result} ${formatPrice(Math.abs(result))}`
  }

  const scrollPos = logBox.scrollTop

  logBox.insertBefore(logItem, logBox.querySelector('p'))

  // prevent scrolling to top, stops smooth scroll
  // if (scrollPos >= 1) {
  //   const style = window.getComputedStyle(logItem)
  //   console.log(scrollPos, parseFloat(style.getPropertyValue('height')))
  //   logBox.scrollTop = scrollPos + parseFloat(style.getPropertyValue('height'))
  // }
}

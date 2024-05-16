import State from './state.js'
import { $id, formatPercent, formatPrice } from './ui.js'

let topCash = 100

export let totalGames = 0

export let totalFlips = 0
let totalFlipWins = 0
let totalHeads = 0
let totalTails = 0
let flipsReturn = 0

export let totalWars = 0
let totalWarWins = 0
let totalWarLosses = 0
let totalWarTies = 0
let warReturn = 0

export let totalPokerGames = 0
let pokerReturn = 0

export let totalBjGames = 0
let bjWins = 0
let bjLosses = 0
let bjTies = 0
let bjReturn = 0
let bjHiCountGames = 0
let bjHiCountWins = 0

let totalRpsGames = 0
let rpsReturn = 0
let totalRocks = 0
let totalPapers = 0
let totalScissors = 0
let rpsWins = 0
let rpsLosses = 0
let rpsTies = 0

// PERF: pre-create items

let totalGamesUi,
  totalFlipsUi,
  flipWinPercentUi,
  flipReturnUi,
  totalWarsUi,
  warWinPercentUi,
  warTiesUi,
  warReturnUi,
  totalPokerGamesUi,
  pokerReturnUi,
  totalBjGamesUi,
  bjWinPercent,
  bjReturnUi,
  bjHiCountGamesUi,
  bjHiCountWinPercent,
  rpsUi,
  rpsResUi,
  rpsReturnUi,
  topCashUi

export const createStats = () => {
  totalGamesUi = $id('total-games')
  totalFlipsUi = $id('total-flips')
  flipWinPercentUi = $id('flip-win-percent')
  flipReturnUi = $id('flip-return')
  totalWarsUi = $id('total-wars')
  warWinPercentUi = $id('war-win-percent')
  warTiesUi = $id('war-triple-ties')
  warReturnUi = $id('war-return')
  topCashUi = $id('top-cash')
  totalPokerGamesUi = $id('total-poker-games')
  pokerReturnUi = $id('poker-return')
  totalBjGamesUi = $id('total-bj-games')
  bjWinPercent = $id('bj-win-percent')
  bjHiCountGamesUi = $id('total-bj-hi-games')
  bjHiCountWinPercent = $id('bj-hi-win-percent')
  bjReturnUi = $id('bj-return')
  rpsUi = $id('rps-ui')
  rpsResUi = $id('rps-res-ui')
  rpsReturnUi = $id('rps-return')
}

export const pushStat = (val, scoreData) => {
  if (scoreData.game === 'coin-flip') {
    totalFlips++

    flipsReturn += val

    // ATTN: can we win with 0?
    if (val > 0) {
      totalFlipWins++
    }

    if (scoreData.result === 'heads') {
      totalHeads++
    } else {
      totalTails++
    }

    totalFlipsUi.innerText = totalFlips + ''
    flipWinPercentUi.innerText = formatPercent(totalFlipWins / totalFlips)
    flipReturnUi.innerText = formatPrice(flipsReturn)
  }

  if (scoreData.game === 'war') {
    totalWars++

    warReturn += val

    if (val > 0) {
      totalWarWins++
    } else if (val < 0) {
      totalWarLosses++
    } else {
      totalWarTies++
    }

    totalWarsUi.innerText = totalWars + ''
    warWinPercentUi.innerText = formatPercent(totalWarWins / totalWars)
    warReturnUi.innerText = formatPrice(warReturn)
    warTiesUi.innerText = totalWarTies + ''
  }

  if (scoreData.game === 'poker') {
    totalPokerGames++

    pokerReturn += -scoreData.wager + val

    totalPokerGamesUi.innerText = totalPokerGames + ''
    pokerReturnUi.innerText = formatPrice(pokerReturn)
  }

  if (scoreData.game === 'bj') {
    totalBjGames++

    bjReturn += -scoreData.wager + val

    if (scoreData.result === 'push') {
      bjTies++
    } else if (scoreData.result === 'lost') {
      bjLosses++
    } else if (scoreData.result === 'win ') {
      bjWins++
    }

    if (scoreData.isBettingHiCount) {
      bjHiCountGames++
      if (scoreData.result === 'win ') {
        bjHiCountWins++
      }
    }

    totalBjGamesUi.innerText = totalBjGames + ''
    bjWinPercent.innerText = formatPercent(bjWins / totalBjGames)
    // bjHiCountGamesUi.innerText = bjHiCountGames + ''
    // bjHiCountWinPercent.innerText = formatPercent(bjHiCountWins / bjHiCountGames || 0)
    bjReturnUi.innerText = formatPrice(bjReturn)
  }

  if (scoreData.game === 'rps') {
    totalRpsGames++

    rpsReturn += val

    if (scoreData.result === 'lost') {
      rpsLosses++
    } else if (scoreData.result === 'won ') {
      rpsWins++
    } else if (scoreData.result === 'tied') {
      rpsTies++
    }

    if (scoreData.oppChoice === '  Rock  ') {
      totalRocks++
    } else if (scoreData.oppChoice === '  Paper ') {
      totalPapers++
    } else if (scoreData.oppChoice === 'Scissors') {
      totalScissors++
    }

    rpsUi.innerText = `(${totalRocks}/${totalPapers}/${totalScissors})`
    rpsResUi.innerText = `(${rpsWins}/${rpsTies}/${rpsLosses})`
    rpsReturnUi.innerText = formatPrice(rpsReturn)
  }

  if (topCash < State.dollars) {
    topCash = State.dollars
    topCashUi.innerText = formatPrice(topCash)
  }

  totalGames++
  totalGamesUi.innerText = totalGames + ''
}

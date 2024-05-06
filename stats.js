import State from './state.js'
import { $id, formatPercent, formatPrice } from './ui.js'

let topCash = 100

export let totalGames = 0

export let totalFlips = 0
let totalFlipWins = 0
let totalHeads = 0
let totalTails = 0

export let totalWars = 0
let totalWarWins = 0
let totalWarLosses = 0
let totalWarTies = 0

export let totalPokerGames = 0
let pokerReturn = 0

// PERF: pre-create items

let totalGamesUi,
totalFlipsUi,
flipWinPercentUi,
totalWarsUi,
warWinPercentUi,
topCashUi,
totalPokerGamesUi,
pokerReturnUi

export const createStats = () => {
    totalGamesUi = $id('total-games')
    totalFlipsUi = $id('total-flips')
    flipWinPercentUi = $id('flip-win-percent')
    totalWarsUi = $id('total-wars')
    warWinPercentUi = $id('war-win-percent')
    topCashUi = $id('top-cash')
    totalPokerGamesUi = $id('total-poker-games')
    pokerReturnUi = $id('poker-return')
}

export const pushStat = (val, scoreData) => {
    if (scoreData.game === 'coin-flip') {
        totalFlips++;

        // ATTN: can we win with 0?
        if (val > 0) {
            totalFlipWins++;
        }

        if (scoreData.result === 'heads') {
            totalHeads++
        } else {
            totalTails++;
        }

        totalFlipsUi.innerText = totalFlips + ''
        flipWinPercentUi.innerText = formatPercent(totalFlipWins / totalFlips)
    }

    if (scoreData.game === 'war') {
        totalWars++;

        if (val > 0) {
            totalWarWins++;
        } else if (val < 0) {
            totalWarLosses++;
        } else {
            totalWarTies++;
        }

        totalWarsUi.innerText = totalWars + ''
        warWinPercentUi.innerText = formatPercent(totalWarWins / totalWars)
    }

    if (scoreData.game === 'poker') {
        totalPokerGames++;

        pokerReturn += -scoreData.wager + val;

        totalPokerGamesUi.innerText = totalPokerGames + ''
        pokerReturnUi.innerText = formatPrice(pokerReturn)
    }

    if (topCash < State.dollars) {
        topCash = State.dollars
        topCashUi.innerText = formatPrice(topCash)
    }

    totalGames++
    totalGamesUi.innerText = totalGames + ''
}

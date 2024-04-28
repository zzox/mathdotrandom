import State from './state.js'

let topCash = 100
export let totalFlips = 0
let totalFlipWins = 0
let totalHeads = 0
let totalTails = 0

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
    }

    if (topCash < State.dollars) {
        topCash = State.dollars
    }

    // upgradeStatsUi()
}

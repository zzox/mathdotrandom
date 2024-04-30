import { pushStat } from './stats.js'
import { checkStoreUpgrades } from './store.js'
import { pushEvent } from './results.js'

export const checkRandom = (percent) => {
    return Math.random() < percent
}

export default class State {
    static gameOver = false
    static dollars = 100

    static updateScore = (val, scoreData) => {
        State.dollars += val
        if (State.dollars === 0) {
            State.gameOver = true
            alert('game over')
        } else if (State.dollars < 0) {
            alert('shouldnt be here')
        }
    
        pushEvent(val, scoreData)
        pushStat(val, scoreData)
        checkStoreUpgrades()
    }

    static checkIsBroke = () => {
        if (State.gameOver) {
            // update the screen
            throw 'Game Over!'
        }
    }
}

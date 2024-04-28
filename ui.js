import State from './state.js'
import { flipCoin } from './coin-flip.js'

// minimize fieldsets
document.querySelectorAll('legend').forEach(item => {
    item.onclick = (ev) => {
        console.log(ev, ev.target, ev.target.parentElement, ev.target.parentElement.className)
        if (ev.target.parentElement.className === 'minimize') {
            ev.target.parentElement.className = ''
        } else {
            ev.target.parentElement.className = 'minimize'
        }
    }
})

const $id = (id) => document.getElementById(id)
const $create = (el) => document.createElement(el)

const score = $id('score')
const resultBox = $id('results')
const headsButton = $id('heads-button')
const tailsButton = $id('tails-button')

const formatDollars = (amount) => `$${amount}`

headsButton.onclick = () => flipCoin('heads')
tailsButton.onclick = () => flipCoin('tails')

export const updateUi = () => {
    score.innerText = formatDollars(State.dollars)
}

export const pushEvent = (result, scoreData) => {
    const p = $create('p')
    p.className = 'result-item'
    p.innerText = `You chose ${scoreData.choice} on a ${scoreData.game} and ${result < 0 ? 'lost' : 'won'} ${formatDollars(Math.abs(result))}`
    resultBox.appendChild(p)
}

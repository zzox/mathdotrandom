import State from './state.js'
import { flipCoin } from './coin-flip.js'
import { doUpgrade } from './store.js'

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

export const $id = (id) => document.getElementById(id)
const $create = (el) => document.createElement(el)

const score = $id('score')
const resultBox = $id('results')
const storeBox = $id('store')
const headsButton = $id('heads-button')
const tailsButton = $id('tails-button')

const formatDollars = (amount) => `$${amount}`
export const formatPercent = (percent) => Math.round(percent * 100).toFixed(0) + '%'

headsButton.onclick = () => flipCoin('heads')
tailsButton.onclick = () => flipCoin('tails')

export const updateUi = () => {
    score.innerText = formatDollars(State.dollars)
}

export const pushEvent = (result, scoreData) => {
    const p = $create('p')
    p.className = 'result-item'
    p.innerText = `You chose ${scoreData.choice} on a ${scoreData.game}` +
    ` and ${result < 0 ? 'lost' : 'won '} ${formatDollars(Math.abs(result))}` +
    (scoreData.isAuto ? ' [AUTO]' : '')
    resultBox.appendChild(p)
}

export const pushStoreItem = (item) => {
    const div = $create('div')
    div.className = 'store-item'
    div.id = `store-item_${item.name}`
    const text = $create('p')
    text.innerText = item.text
    const description = $create('p')
    description.innerText = item.info
    const button = $create('button')
    button.innerText = 'Buy'
    button.onclick = () => doUpgrade(item.name)
    // const errorText = $create('p')
    div.appendChild(text)
    div.appendChild(description)
    div.appendChild(button)

    storeBox.appendChild(div)
}

export const removeStoreItem = (name) => {
    const item = $id(`store-item_${name}`)
    if (!item) {
        throw 'Cannot find store item to remove'
    }
    item.remove()
}

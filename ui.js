import State from './state.js'
import { flipCoin } from './games/coin-flip.js'
import { doUpgrade } from './store.js'

// minimize fieldsets
document.querySelectorAll('legend').forEach(item => {
    item.onclick = (event) => {
        event.target.parentElement.classList.toggle('minimize')
    }
})

export const $id = (id) => document.getElementById(id)
const $create = (el) => document.createElement(el)
export const $query = (q) => document.querySelector(q)
export const $queryAll = (q) => Array.from(document.querySelectorAll(q))

const score = $id('score')
const resultBox = $id('results')
const storeBox = $id('store')
const headsButton = $id('heads-button')
const tailsButton = $id('tails-button')

const formatPrice = (amount) => `$${amount}`
export const formatPercent = (percent) => Math.round(percent * 100).toFixed(0) + '%'
export const formatRate = (time) => `${Math.round(1000 / time)}/sec`

headsButton.onclick = () => flipCoin('heads')
tailsButton.onclick = () => flipCoin('tails')

export const updateUi = () => {
    score.innerText = formatPrice(State.dollars)
}

export const pushEvent = (result, scoreData) => {
    const p = $create('p')
    p.className = 'result-item'
    p.innerText = `You chose ${scoreData.choice} on a ${scoreData.game}` +
        ` and ${result < 0 ? 'lost' : 'won '} ${formatPrice(Math.abs(result))}` +
        (scoreData.isAuto ? ' [AUTO]' : '')
    resultBox.insertBefore(p, resultBox.querySelector('p'))
}

export const pushStoreItem = (item) => {
    const div = $create('div')
    div.className = 'store-item'
    div.id = `store-item_${item.name}`

    const textWidth = 50
    const priceString = formatPrice(item.price)
    let spaces = ''
    for (let i = 0; i < textWidth - item.text.length - priceString.length; i++) {
        spaces += ' '
    }

    const text = $create('p')
    text.className = 'bold'
    text.innerText = item.text + spaces + priceString

    const description = $create('p')
    description.innerText = item.info

    const button = $create('button')
    button.innerText = 'Buy'
    button.disabled = true
    button.onclick = () => doUpgrade(item.name)

    const errorText = $create('p')
    errorText.className = 'error-text'

    div.appendChild(text)
    div.appendChild(description)
    div.appendChild(button)
    div.appendChild(errorText)

    storeBox.appendChild(div)
}

export const removeStoreItem = (name) => {
    const item = $id(`store-item_${name}`)
    if (!item) {
        throw 'Cannot find store item to remove'
    }
    item.remove()
}

import { flipCoin, dollars, headsChance } from './main.js'

const $id = (id) => document.getElementById(id)
const formatDollars = (amount) => `$${amount}`

const score = $id('score')
const headsButton = $id('heads-button')
const tailsButton = $id('tails-button')

headsButton.onclick = () => flipCoin('heads')
tailsButton.onclick = () => flipCoin('tails')

export const updateUi = () => {
    score.innerText = formatDollars(dollars)
}

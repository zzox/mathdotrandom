import { flipCoin, dollars } from './main.js'

const $id = (id) => document.getElementById(id)

const formatDollars = (amount) => `$${amount}`

const score = $id('score')
const flipButton = $id('flip-button')

flipButton.onclick = () => flipCoin()

export const updateUi = () => {
//   console.log('updating')
    score.innerText = formatDollars(dollars)
}

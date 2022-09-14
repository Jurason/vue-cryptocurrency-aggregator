const API_KEY = '48131930ee5d463169bcae9e7d14fdba93745c2b94b2adec2879c3e73f4a1b5a'

const tickersHandlers = new Map()


// немного сложная для понимания концепция "подписки" на тикеры
// то есть мы не решаем задачу в лоб, а "подготавливаем условия для её решения"

const loadTickers = () => {
    if(tickersHandlers.size === 0) {
        return
    }
    fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[...tickersHandlers.keys()].join(',')}&tsyms=USD&api_key=${API_KEY}`)
        .then(response => response.json())
        .then(rawData => {
            const updatedPrices = Object.fromEntries(
                Object.entries(rawData).map(([key, value]) => [key, value.USD]));
            Object.entries(updatedPrices).forEach(([currency, newPrice]) => {           // interesting case
                const handlers = tickersHandlers.get(currency) || []
                handlers.forEach(fn => fn(newPrice))                                          // launch cb functions
            })
        })
}
// fulfilling tickersHandler by cb function
export const subscribeToTicker = (ticker, cb) => {              // subscribe on current ticker
    const subscribers = tickersHandlers.get(ticker) || []
    tickersHandlers.set(ticker, [...subscribers, cb])
}

export const unsubscribeFromTicker = ticker => {            // unsubscribe
    tickersHandlers.delete(ticker)
    // const subscribers = tickersHandlers.get(ticker) || []
    // tickersHandlers.set(ticker, subscribers.filter(fn => fn !== cb))
}

window.tickers = tickersHandlers

setInterval(loadTickers,5000)

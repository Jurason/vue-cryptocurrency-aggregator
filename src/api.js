import { tickersHandlers } from "./worker";

const worker = new SharedWorker('src/worker')

const broadcastChannel = new BroadcastChannel("WebSocketChannel");

worker.port.start()

const AGGREGATE_INDEX = '5'

broadcastChannel.addEventListener("message", ({ data }) => {
    if(data.type === 'WSState' || data.action === 'subscribe') return
    let { TYPE: type, FROMSYMBOL: currency, PRICE: newPrice } = data.data
    if(type !== AGGREGATE_INDEX || newPrice === undefined){
        return;
    }
    console.log('data.data:', data.data)
    const handlers = tickersHandlers.get(currency) || []
    handlers.forEach(fn => fn(newPrice))
});

export const subscribeToTicker = (ticker, cb) => {              // subscribe on current ticker
    const subscribers = tickersHandlers.get(ticker) || []
    tickersHandlers.set(ticker, [...subscribers, cb])
    broadcastChannel.postMessage({
        action: 'subscribe',
        ticker: ticker
    })
    console.log(`subscribe on ${ticker}`);
    // subscribeToTickerOnWs(ticker)
}
export const unsubscribeFromTicker = ticker => {            // unsubscribe
    tickersHandlers.delete(ticker)
    broadcastChannel.postMessage({
        action: 'unsubscribe',
        ticker: ticker
    })
    console.log(`unsubscribe from ${ticker}`);
    // unsubscribeFromTickerOnWs(ticker)
}


import { subscribeToTickerOnWs, unsubscribeFromTickerOnWs} from "./worker";

const worker = new SharedWorker('src/worker')

const broadcastChannel = new BroadcastChannel("WebSocketChannel");

worker.port.start()

const tickersHandlers = new Map()

const AGGREGATE_INDEX = '5'

broadcastChannel.addEventListener("message", e => {
    let { TYPE: type, FROMSYMBOL: currency, PRICE: newPrice } = e.data.data
    if(type !== AGGREGATE_INDEX || newPrice === undefined){
        return;
    }
    const handlers = tickersHandlers.get(currency) || []
    handlers.forEach(fn => fn(newPrice))
});

export const subscribeToTicker = (ticker, cb) => {              // subscribe on current ticker
    const subscribers = tickersHandlers.get(ticker) || []
    tickersHandlers.set(ticker, [...subscribers, cb])
    subscribeToTickerOnWs(ticker)
}
export const unsubscribeFromTicker = ticker => {            // unsubscribe
    tickersHandlers.delete(ticker)
    unsubscribeFromTickerOnWs(ticker)
}


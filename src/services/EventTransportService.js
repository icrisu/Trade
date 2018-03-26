let instance;
const instanceKey = '@&^#*(';

class EventTransportService {
    _events;
    constructor(key) {
        if (key !== instanceKey) {
            throw new Error('Cannot instantiate like this')
        }
        this._events = {};
    }


    subscribe(coinCode, callback) {
        this._events[coinCode] = {coinCode, callback};
    }

    unsubscribe(coinCode) {
        delete this._events[coinCode];
    }

    fireEvent(coinCode, coinData) {        
        if (this._events[coinCode]) {
            this._events[coinCode].callback(coinData);
        }
    }

    static getInstance() {
        if (!instance) {
            instance = new EventTransportService(instanceKey);
        }
        return instance;
    }        
}

export default EventTransportService;

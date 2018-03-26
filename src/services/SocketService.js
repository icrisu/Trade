import { COINCAP_SOKET_URL } from '../config';
import { coinUpdate } from '../actions';
import io from 'socket.io-client';
import safe from 'undefsafe';
import _ from 'lodash';
import EventTransportService from './EventTransportService';

let instance;
const instanceKey = '@&^#*(';
class SocketService {

    _socket;

    constructor(key) {
        if (key !== instanceKey) {
            throw new Error('Cannot instantiate like this')
        }
    }

    init() {      
        this._socket = io.connect(COINCAP_SOKET_URL);
        this._socket.on('trades', tradeMsg => {
            if (!_.isNil(tradeMsg.coin) && !_.isNil(safe(tradeMsg, 'msg'))) {
                const trade = Object.assign(tradeMsg.msg, {
                    exchange_id: tradeMsg.exchange_id,
                    market_id: tradeMsg.market_id,
                    lastUpdate: Date.now()
                });
                coinUpdate(trade);
                EventTransportService.getInstance().fireEvent(tradeMsg.coin, trade);
            }
        })     
    }

    static getInstance() {
        if (!instance) {
            instance = new SocketService(instanceKey);
        }
        return instance;
    }
}

export default SocketService;


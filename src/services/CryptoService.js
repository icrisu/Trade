import { EXTERNAL_APIS, COINCAP_API_ROOT } from '../config';
import axios from 'axios';
import StorageService from './StorageService';
import { feedSingleCoin } from '../actions';
import safe from 'undefsafe';
import _ from 'lodash';
import Utils from '../util';

let instance;
const instanceKey = '@&^#*(';
class CryptoService {

    _apiToUse = EXTERNAL_APIS.COINCAP;

    constructor(key) {
        if (key !== instanceKey) {
            throw new Error('Cannot instantiate like this')
        }
    }

    getFeed() {
        // console.log('GET FEED')
        return new Promise((resolve, reject) => {
            if (StorageService.shouldUpdateFeed()) {
                // console.log('SHOUL UPDATE FEED')
                axios.get(`${COINCAP_API_ROOT}/front`)
                .then(data => {
                    if (data && _.isArray(data.data)) {
                        let _ids = 0;
                        data.data = data.data.map(item => {
                            _ids++;
                            item._ids = `id_${_ids}`;
                            return item;
                        })
                        StorageService.setFeed(data.data);
                        resolve(data.data);
                    }
                })
                .catch(reject)            
            } else {
                // console.log('NOT UPDATE FEED')
                let allFeed = StorageService.getFeed();
                if (allFeed) {
                    resolve(allFeed);
                }
            }
        })
    }

    // retrive a single currency
    getSingleFeed(idShort) {
        return new Promise((resolve, reject) => {
            axios.get(`${COINCAP_API_ROOT}/page/${idShort}`)
            .then(data => {
                if (data && _.isObject(data.data)) {
                    const processedData = Utils.normalizeSingleCurencyData(data.data);
                    feedSingleCoin(processedData);
                    resolve(processedData);
                }
            })
            .catch(err => console.log(err))             
        });
    }

    // retrive history
    getHistory(idShort, timeline = '1day') {
        let apiRoute = `${COINCAP_API_ROOT}/history/${timeline}/${idShort}`;
        return new Promise((resolve, reject) => {
            axios.get(apiRoute)
            .then(data => {
                if (data && _.isArray(safe(data, 'data.price'))) {
                    if (timeline === '1day') {
                        resolve(Utils.groupTimestampByHours(data.data.price));
                    }
                    if (timeline === '7day') {
                        resolve(Utils.groupTimestampByDays(data.data.price));
                    }
                    if (timeline === '30day') {
                        resolve(Utils.groupTimestampByDays(data.data.price));
                    }
                    if (timeline === '90day' || timeline === '180day' || timeline === '365day') {
                        resolve(Utils.groupTimestampByMonths(data.data.price));
                    }                                                                                
                }
            })
            .catch(err => console.log(err))             
        });
    } 

    static getInstance() {
        if (!instance) {
            instance = new CryptoService(instanceKey);
        }
        return instance;
    }
}

export default CryptoService;


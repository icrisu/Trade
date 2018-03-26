import moment from 'moment';
import _ from 'lodash';

class Utils {

    static convertHexToRGB(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    // group timestamp by days
    static groupTimestampByMonths(feedData) {
        let prices = [];

        var groups = _.groupBy(feedData, (data) => {
            const dateFormat = moment(data[0]).endOf('month').format();
            return dateFormat;
        });
        let keys = [];

        for (const key in groups) {
            if (groups.hasOwnProperty(key)) {
                let m = moment(key, 'YYYY-MM-DD HH:mm Z').format('MMM YYYY');
                let maxValue = _.maxBy(groups[key], (o) => { 
                    return o[1]; 
                });
                prices.push(maxValue[1]);
                keys.push(m);
            }
        }
        return {prices, keys};
    }

    // group timestamp by days
    static groupTimestampByDays(feedData) {
        let prices = [];

        // console.log(feedData[0]);
        var groups = _.groupBy(feedData, (data) => {
            const dateFormat = moment(data[0]).startOf('day').format();           
            return dateFormat;
        });
        let keys = [];

        for (const key in groups) {
            if (groups.hasOwnProperty(key)) {
                let m = moment(key, 'YYYY-MM-DD HH:mm Z').format('MMM Do');
                let maxValue = _.maxBy(groups[key], (o) => { 
                    return o[1]; 
                });
                prices.push(maxValue[1]);
                keys.push(m);
            }
        }
        return {prices, keys};   
    }
    
    
    // group timestamp by hours
    static groupTimestampByHours(feedData) {
        let prices = [];

        // console.log(feedData[0]);
        var groups = _.groupBy(feedData, (data) => {
            const dateFormat = moment(data[0]).startOf('hour').format();
            return dateFormat;
        });
        let keys = [];

        for (const key in groups) {
            if (groups.hasOwnProperty(key)) {
                let m = moment(key, 'YYYY-MM-DD HH:mm Z').format('MMM Do ha');
                let maxValue = _.maxBy(groups[key], (o) => { 
                    return o[1]; 
                });
                prices.push(maxValue[1]);
                keys.push(m);
            }
        }

        return {prices, keys};
    }

    static normalizeSingleCurencyData(coinData) {
        return {
            cap24hrChange: coinData.cap24hrChange,
            long: coinData.display_name,
            mktcap: coinData.market_cap,
            perc: coinData.cap24hrChange,
            price: coinData.price,
            short: coinData.id,
            supply: coinData.supply,
            usdVolume: coinData.volume,
            vwapData: coinData.vwap_h24,
            status: coinData.status, // available
            price_eur: coinData.price_eur
        }        
    }
}

export default Utils;
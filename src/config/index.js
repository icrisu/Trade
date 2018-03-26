import React from 'react';

export const MENU_OPEN_WIDTH = 260;
export const EXTERNAL_APIS = {
    COINCAP: 'coincap'
}
export const COINCAP_API_ROOT = 'https://coincap.io';
export const COINCAP_SOKET_URL = 'https://coincap.io';

export const MAX_RELOD_FEED_TIME = 30; // minutes - do not change this (will update through sockets)
export const MAX_FEED_ON_PAGE = 30; 

export const MAX_RECENT_TRADES_CURRENCY_SINGLE = 30;

export const menuType = () => {
    return window.innerWidth >= 1100 ? 'desktop' : 'mobile';
}

// google adsenese helper
export const responsiveAd = (adClient, adSlot) => {
    return(
        <div className="adsense-single-page">
            <ins 
                className="adsbygoogle"
                style={{display: 'block'}}
                data-ad-client={adClient}
                data-ad-slot={adSlot}
                data-ad-format="auto">
            </ins>            
        </div>                  
    )
}
export const fixedAd = (adClient, adSlot) => {
    return(
        <div className="adsense-menu">
            <ins 
                className="adsbygoogle"
                style={{display: 'inline-block', width: '250px', height: '250px'}}
                data-ad-client={adClient}
                data-ad-slot={adSlot}>
            </ins>            
        </div>                  
    )
}
import {store} from './store';

export const getHomeUrl = () => {
    const dirSep = "/";
    var homeUrl = process.env.PUBLIC_URL || "";
    if (!homeUrl.endsWith(dirSep))
      homeUrl += dirSep;
    return homeUrl;
}

export const isShowCaseDetails = () => {
    const state = store.getState();
    return state.user.appSettings.bShowCaseDetails;
}

export const getCreateCaseContext = () => {
    const state = store.getState();
    const ccContext = state.user.appSettings.createCaseContext;
    let oCreateCaseContext = {};
    
    if( ccContext ) {
        try {
            oCreateCaseContext = JSON.parse(ccContext);
        } catch(e) {
            console.log("Invalid JSON specified for create case context");
        }    
    }

    return oCreateCaseContext;
}

/**
 * generates unique key value by incrementing keyIndex on every call
 */
let keyIndex = 0;
export function getUniqueIndex() {
    return `${keyIndex++}`;
}

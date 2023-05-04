import adapter from '../libraries/analyticsAdapter/AnalyticsAdapter.js';
import adapterManager from '../src/adapterManager.js';
import { ajax } from '../src/ajax.js';
import { config } from '../src/config.js';
import CONSTANTS from '../src/constants.json';
import { getStorageManager } from '../src/storageManager.js';
import { logError, logInfo } from '../src/utils.js';

const MODULE_NAME = 'intentIqAnalyticsAdapter'
const analyticsType = 'endpoint'
const defaultUrl = 'https://reports.intentiq.com/report'
const storage = getStorageManager({
    gvlid: undefined,
    moduleName: MODULE_NAME,
})
const prebidVersion = '$prebid.version$'
const REPORTER_ID = Date.now() + '_' + getRandom(0, 1000)

const FIRST_PARTY_KEY = '_iiq_fdata'
const FIRST_PARTY_DATA_KEY = '_iiq_fdata'
const GROUP_LS_KEY = '_iiq_group'
const PRECENT_LS_KEY = '_iiq_precent'

const PARAMS_NAMES = {
    partnerId: 'partnerId',
    abPercentage: 'abPercentage',
    abTestGroup: 'abGroup',
    isInTestGroup: 'isInTestGroup',
    userActualPercentage: 'userPercentage',
    ABTestingConfigurationSource: 'ABTestingConfigurationSource',
    hadEidsInLocalStorage: 'idls',
    agentId: 'aid',
    refferer: 'vrref',
    isInBrowserBlacklist: 'inbbl',
    prebidVersion: 'pbjsver',
}

var initOptions = {
    lsValueInitialized: false,
    isInBrowserBlacklist: false,
}

// Events needed
const {
    EVENTS: { BID_WON },
} = CONSTANTS

let iiqAnalyticsAnalyticsAdapter = Object.assign(adapter({ defaultUrl, analyticsType }), {
    track({ eventType, args }) {
        switch (eventType) {
            case BID_WON:
                bidWon(args)
                break
            default:
                break
        }
    },
})

function readData(key) {
    try {
        if (storage.hasLocalStorage()) {
            return storage.getDataFromLocalStorage(key)
        }
        if (storage.cookiesAreEnabled()) {
            return storage.getCookie(key)
        }
    } catch (error) {
        logError(error)
    }
}

function detectBrowser() {
    try {
        if ((navigator.userAgent.indexOf('Opera') || navigator.userAgent.indexOf('OPR')) != -1) {
            return 'Opera'
        } else if (
            navigator.userAgent.indexOf('Chrome') != -1 ||
            navigator.userAgent.indexOf('CriOS') != -1
        ) {
            return 'Chrome'
        } else if (navigator.userAgent.indexOf('Safari') != -1) {
            return 'Safari'
        } else if (navigator.userAgent.indexOf('Firefox') != -1) {
            return 'Firefox'
        } else if (navigator.userAgent.indexOf('MSIE') != -1 || !!document.documentMode == true) {
            return 'IE'
        } else {
            return 'Unknown'
        }
    } catch (e) {
        return 'Unknown'
    }
}

function setInitOptionValues() {
    // Check mandatory params
    let iiqConfig = config.getConfig('userSync.userIds').find((m) => m.name == 'intentIqId')
    if (!iiqConfig || !iiqConfig.params || typeof iiqConfig.params.partner !== 'number') return

    const iiqConfigParams = iiqConfig.params

    // Check if in browser blacklist
    if (typeof iiqConfigParams.browserBlackList === 'string') {
        const currentBrowser = detectBrowser().toLowerCase()

        if (iiqConfigParams.browserBlackList.toLowerCase().includes(currentBrowser)) {
            initOptions.isInBrowserBlacklist = true
            logError('Browser is in blacklist. Skipping report.')
            return
        }
    }

    initOptions.partner = iiqConfigParams.partner
    initOptions.referrer =
        typeof iiqConfigParams.domain === 'string' && iiqConfigParams.domain !== ''
            ? iiqConfigParams.domain
            : getReferrer()

    initOptions.currentGroup = readData(GROUP_LS_KEY + '_' + initOptions.partner)
    initOptions.currentPercentage = readData(PRECENT_LS_KEY + '_' + initOptions.partner)
    initOptions.fpid = readData(FIRST_PARTY_KEY)

    try {
        initOptions.dataInLs = JSON.parse(
            readData(FIRST_PARTY_DATA_KEY + '_' + initOptions.partner),
        ).data
    } catch (e) {
        logError(e)
    }
}

function bidWon(args) {
    if (!initOptions.lsValueInitialized) {
        setInitOptionValues()
        initOptions.lsValueInitialized = true
    }

    if (!initOptions.manualReport) {
        ajax(constructFullUrl(preparePayload(args, true)), undefined, null, {
            method: 'GET',
        })
    }

    logInfo('IIQ ANALYTICS -> BID WON')
}

function getRandom(start, end) {
    return Math.floor(Math.random() * (end - start + 1) + start)
}

function preparePayload(data, isBidWon) {
    let result = getDefaultDataObject()

    result[PARAMS_NAMES.partnerId] = initOptions.partner
    result[PARAMS_NAMES.prebidVersion] = prebidVersion
    result[PARAMS_NAMES.refferer] = initOptions.referrer
    result[PARAMS_NAMES.userActualPercentage] = initOptions.currentPercentage
    result[PARAMS_NAMES.isInBrowserBlacklist] = initOptions.isInBrowserBlacklist

    if (typeof initOptions.currentGroup === 'string' && initOptions.currentGroup !== '') {
        result[PARAMS_NAMES.ABTestingConfigurationSource] = 'group'
    } else if (typeof initOptions.currentPercentage === 'number') {
        result[PARAMS_NAMES.ABTestingConfigurationSource] = 'percentage'
    }

    result[PARAMS_NAMES.abPercentage] = initOptions.currentPercentage
    result[PARAMS_NAMES.abTestGroup] = initOptions.currentGroup

    // TODO: Check if this param us used
    result[PARAMS_NAMES.isInTestGroup] = initOptions.currentGroup === 'B'

    result[PARAMS_NAMES.hadEidsInLocalStorage] =
        initOptions.dataInLs && initOptions.dataInLs.length > 0

    result[PARAMS_NAMES.agentId] = REPORTER_ID

    if (isBidWon) {
        fillPrebidEventData(data, result)
    } else {
        fillPartnerReportingData(data, result)
    }

    return result
}

function fillPartnerReportingData(partnerWinReportData, result) {
    result.bidderCode = partnerWinReportData.bidderCode
    result.cpm = partnerWinReportData.cpm
    result.currency = partnerWinReportData.currency
    result.originalCpm = partnerWinReportData.originalCpm
    result.originalCurrency = partnerWinReportData.originalCurrency
    result.status = partnerWinReportData.status
    result.biddingPlatformId = partnerWinReportData.biddingPlatformId
    result.prebidAuctionId = partnerWinReportData.prebidAuctionId
    result.placementId = partnerWinReportData.placementId
    result.partnerAuctionId = partnerWinReportData.partnerAuctionId
}

function fillPrebidEventData(eventData, result) {
    if (eventData.bidderCode) {
        result.bidderCode = eventData.bidderCode
    }
    if (eventData.cpm) {
        result.cpm = eventData.cpm
    }
    if (eventData.currency) {
        result.currency = eventData.currency
    }
    if (eventData.originalCpm) {
        result.originalCpm = eventData.originalCpm
    }
    if (eventData.originalCurrency) {
        result.originalCurrency = eventData.originalCurrency
    }
    if (eventData.status) {
        result.status = eventData.status
    }
    if (eventData.auctionId) {
        result.prebidAuctionId = eventData.auctionId
    }

    result.biddingPlatformId = 1
    result.partnerAuctionId = 'BW'
}

function getDefaultDataObject() {
    return {
        inbbl: false,
        partnerAuctionId: 'BW',
        reportSource: 'pbjs',
    }
}

function constructFullUrl(data) {
    let report = []
    data = btoa(JSON.stringify(data))
    report.push(data)

    return (
        defaultUrl +
        '?pid=' +
        initOptions.partner +
        '&mct=1' +
        (iiqAnalyticsAnalyticsAdapter.initOptions && iiqAnalyticsAnalyticsAdapter.initOptions.fpid
            ? '&iiqid=' + encodeURIComponent(iiqAnalyticsAnalyticsAdapter.initOptions.fpid.pcid)
            : '') +
        '&agid=' +
        REPORTER_ID +
        '&jsver=5.3' +
        '&source=pbjs' +
        '&payload=' +
        JSON.stringify(report)
    )
}

function getReferrer() {
    return encodeURIComponent(document.referrer)
}

function manualCall(data) {
    if (!initOptions.lsValueInitialized) {
        setInitOptionValues()
        initOptions.lsValueInitialized = true
    }
    ajax(constructFullUrl(preparePayload(data, false)), undefined, null, {
        method: 'GET',
    })
    logInfo('IIQ ANALYTICS->' + data)
}
iiqAnalyticsAnalyticsAdapter.originEnableAnalytics = iiqAnalyticsAnalyticsAdapter.enableAnalytics

iiqAnalyticsAnalyticsAdapter.enableAnalytics = function (myConfig) {
    initOptions = myConfig.options

    if (initOptions.manualReport) {
        myConfig.options.manualReport.call = manualCall
    }

    iiqAnalyticsAnalyticsAdapter.originEnableAnalytics(myConfig) // call the base class function
}

adapterManager.registerAnalyticsAdapter({
    adapter: iiqAnalyticsAnalyticsAdapter,
    code: MODULE_NAME,
})

export default iiqAnalyticsAnalyticsAdapter

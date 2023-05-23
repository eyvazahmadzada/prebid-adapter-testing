/**
 * This module adds IntentIqId to the User ID module
 * The {@link module:modules/userId} module is required
 * @module modules/intentIqIdSystem
 * @requires module:modules/userId
 */
import { ajax } from "../src/ajax.js";
import { submodule } from "../src/hook.js";
import { getStorageManager } from "../src/storageManager.js";
import { logError, logInfo } from "../src/utils.js";

const PCID_EXPIRY = 365;

const MODULE_NAME = "intentIqId";
const prebidVersion = "$prebid.version$";
const currentBrowser = detectBrowser().toLowerCase();
let iiqServerAddress = "https://api.intentiq.com";

export const FIRST_PARTY_KEY = "_iiq_fdata";
export var FIRST_PARTY_DATA_KEY = "_iiq_fdata";
export var GROUP_LS_KEY = "_iiq_group";
export var WITH_IIQ = "A";
export var WITHOUT_IIQ = "B";
export var PERCENTAGE_LS_KEY = "_iiq_precent";
export var DEFAULT_PERCENTAGE = 95;

export const storage = getStorageManager({
  gvlid: undefined,
  moduleName: MODULE_NAME,
});

const INVALID_ID = "INVALID_ID";

function getRandom(start, end) {
  return Math.floor(Math.random() * (end - start + 1) + start);
}

/**
 * Generate standard UUID string
 * @return {string}
 */
function generateGUID() {
  let d = new Date().getTime();
  const guid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return guid;
}

/**
 * Read Intent IQ data from cookie or local storage
 * @param key
 * @return {string}
 */
export function readData(key) {
  try {
    if (storage.hasLocalStorage()) {
      return storage.getDataFromLocalStorage(key);
    }
    if (storage.cookiesAreEnabled()) {
      return storage.getCookie(key);
    }
  } catch (error) {
    logError(error);
  }
}

/**
 * Store Intent IQ data in either cookie or local storage
 * expiration date: 365 days
 * @param key
 * @param {string} value IntentIQ ID value to sintentIqIdSystem_spec.jstore
 */
function storeData(key, value, cookieStorageEnabled = false) {
  try {
    logInfo(MODULE_NAME + ": storing data: key=" + key + " value=" + value);

    if (value) {
      if (storage.hasLocalStorage()) {
        storage.setDataInLocalStorage(key, value);
      }

      const expiresStr = new Date(
        Date.now() + PCID_EXPIRY * (60 * 60 * 24 * 1000)
      ).toUTCString();
      if (storage.cookiesAreEnabled() && cookieStorageEnabled) {
        storage.setCookie(key, value, expiresStr, "LAX");
      }
    }
  } catch (error) {
    logError(error);
  }
}

/**
 * Parse json if possible, else return null
 * @param data
 * @param {object|null}
 */
function tryParse(data) {
  try {
    return JSON.parse(data);
  } catch (err) {
    logError(err);
    return null;
  }
}

/**
 * Detect current browser
 * @return {string}
 */
function detectBrowser() {
  try {
    if (
      (navigator.userAgent.indexOf("Opera") ||
        navigator.userAgent.indexOf("OPR")) != -1
    ) {
      return "Opera";
    } else if (
      navigator.userAgent.indexOf("Chrome") != -1 ||
      navigator.userAgent.indexOf("CriOS") != -1
    ) {
      return "Chrome";
    } else if (navigator.userAgent.indexOf("Safari") != -1) {
      return "Safari";
    } else if (navigator.userAgent.indexOf("Firefox") != -1) {
      return "Firefox";
    } else if (
      navigator.userAgent.indexOf("MSIE") != -1 ||
      !!document.documentMode == true
    ) {
      return "IE";
    } else {
      return "Unknown";
    }
  } catch (e) {
    return "Unknown";
  }
}

/**
 * Check user provided parameters
 * @param params
 * @return {boolean}
 */
function areParamsValid(params) {
  // Check mandatory parameters
  if (!params || typeof params.partner !== "number") {
    logError(MODULE_NAME + " Valid partner ID is required");
    return false;
  }

  // Check if browser in blacklist
  if (typeof params.browserBlackList === "string") {
    if (params.browserBlackList.toLowerCase().includes(currentBrowser)) {
      logError(MODULE_NAME + " Browser is in blacklist");
      return false;
    }
  }

  return true;
}

/** @type {Submodule} */
export const intentIqIdSubmodule = {
  /**
   * used to link submodule with config
   * @type {string}
   */
  name: MODULE_NAME,
  /**
   * decode the stored id value for passing to bid requests
   * @function
   * @param {{string}} value
   * @returns {{intentIqId: {string}}|undefined}
   */
  decode(value, config) {
    const configParams = config && config.params;

    if (!areParamsValid(configParams)) return undefined;

    if (typeof configParams.iiqServerAddress === "string") {
      iiqServerAddress = configParams.iiqServerAddress;
    }

    if (!FIRST_PARTY_DATA_KEY.includes(configParams.partner)) {
      FIRST_PARTY_DATA_KEY += "_" + configParams.partner;
    }

    let partnerData = tryParse(readData(FIRST_PARTY_DATA_KEY));

    if (
      partnerData &&
      partnerData.data &&
      partnerData.data !== INVALID_ID &&
      partnerData.data.eids
    ) {
      return { pubProvidedId: partnerData.data.eids };
    }

    return undefined;
  },
  /**
   * performs action to obtain id and return a value in the callback's response argument
   * @function
   * @param {SubmoduleConfig} [config]
   * @returns {IdResponse|undefined}
   */
  getId(config) {
    const configParams = config && config.params;
    const cookieStorageEnabled =
      typeof configParams.enableCookieStorage === "boolean"
        ? configParams.enableCookieStorage
        : false;

    if (!areParamsValid(configParams)) return undefined;

    // Check optional parameters
    if (
      typeof configParams.abPercentage !== "number" ||
      configParams.abPercentage < 0 ||
      configParams.abPercentage > 100
    ) {
      logInfo(
        MODULE_NAME +
          " AB Testing percentage is not defined or valid. Setting default value = " +
          DEFAULT_PERCENTAGE
      );
      configParams.abPercentage = DEFAULT_PERCENTAGE;
    }

    const currentAbPercentage = readData(
      PERCENTAGE_LS_KEY + "_" + configParams.partner
    );
    const currentAbGroup = readData(GROUP_LS_KEY + "_" + configParams.partner);

    // Update group and percentage in LS if user config changed
    if (
      typeof currentAbGroup !== "string" ||
      typeof currentAbPercentage !== "number" ||
      currentAbPercentage !== configParams.abPercentage
    ) {
      logInfo(
        MODULE_NAME +
          "Generating new Group. Current test group: " +
          currentAbGroup +
          ", current percentage: " +
          currentAbPercentage +
          " , configured percentage: " +
          configParams.abPercentage
      );
      configParams.group =
        configParams.abPercentage > getRandom(1, 100) ? WITH_IIQ : WITHOUT_IIQ;

      storeData(
        GROUP_LS_KEY + "_" + configParams.partner,
        configParams.group,
        cookieStorageEnabled
      );
      storeData(
        PERCENTAGE_LS_KEY + "_" + configParams.partner,
        configParams.abPercentage,
        cookieStorageEnabled
      );

      logInfo(MODULE_NAME + " New group: " + configParams.group);
    }

    // Make group accessible to review
    window.intentIqCurrentGroup = configParams.group;

    if (configParams.group === WITHOUT_IIQ) {
      logInfo(MODULE_NAME + 'Group "B". Passive Mode ON.');
      return true;
    }

    if (!FIRST_PARTY_DATA_KEY.includes(configParams.partner)) {
      FIRST_PARTY_DATA_KEY += "_" + configParams.partner;
    }
    let rrttStrtTime = 0;

    // Read Intent IQ 1st party id or generate it if none exists
    let firstPartyData = tryParse(readData(FIRST_PARTY_KEY));
    if (!firstPartyData || !firstPartyData.pcid) {
      const firstPartyId = generateGUID();
      firstPartyData = { pcid: firstPartyId };
      storeData(
        FIRST_PARTY_KEY,
        JSON.stringify(firstPartyData),
        cookieStorageEnabled
      );
    }

    let partnerData = tryParse(readData(FIRST_PARTY_DATA_KEY)) || {};

    // use protocol relative urls for http or https
    let url = `${iiqServerAddress}/profiles_engine/ProfilesEngineServlet?at=39&mi=10&dpi=${configParams.partner}&pt=17&dpn=1`;
    url += configParams.pcid
      ? "&pcid=" + encodeURIComponent(configParams.pcid)
      : "";
    url += configParams.pai
      ? "&pai=" + encodeURIComponent(configParams.pai)
      : "";
    url += firstPartyData.pcid
      ? "&iiqidtype=2&iiqpcid=" + encodeURIComponent(firstPartyData.pcid)
      : "";
    url += firstPartyData.pid
      ? "&pid=" + encodeURIComponent(firstPartyData.pid)
      : "";
    url += partnerData.cttl
      ? "&cttl=" + encodeURIComponent(partnerData.cttl)
      : "";
    url += partnerData.rrtt
      ? "&rrtt=" + encodeURIComponent(partnerData.rrtt)
      : "";
    url += "&pbjsver=" + encodeURIComponent(prebidVersion);

    const resp = function (callback) {
      const callbacks = {
        success: (response) => {
          let respJson = tryParse(response);
          // If response is a valid json and should save is true
          if (respJson && respJson.ls) {
            // Store pid field if found in response json
            let shouldUpdateLs = false;

            if ("pid" in respJson) {
              firstPartyData.pid = respJson.pid;
              shouldUpdateLs = true;
            }

            if ("cttl" in respJson) {
              partnerData.cttl = respJson.cttl;
              shouldUpdateLs = true;
            }

            // If should save and data is empty, means we should save as INVALID_ID
            if (respJson.data == "") {
              respJson.data = INVALID_ID;
            } else {
              partnerData.data = respJson.data;
              shouldUpdateLs = true;
            }

            if (rrttStrtTime && rrttStrtTime > 0) {
              partnerData.rrtt = Date.now() - rrttStrtTime;
              shouldUpdateLs = true;
            }

            if (shouldUpdateLs === true) {
              partnerData.date = Date.now();
              storeData(
                FIRST_PARTY_KEY,
                JSON.stringify(firstPartyData),
                cookieStorageEnabled
              );
              storeData(
                FIRST_PARTY_DATA_KEY,
                JSON.stringify(partnerData),
                cookieStorageEnabled
              );
            }

            callback(respJson.data);
          } else {
            callback();
          }
        },
        error: (error) => {
          logError(MODULE_NAME + ": ID fetch encountered an error", error);
          callback();
        },
      };
      if (
        partnerData.date &&
        partnerData.cttl &&
        partnerData.data &&
        Date.now() - partnerData.date < partnerData.cttl
      ) {
        callback(partnerData.data);
      } else {
        rrttStrtTime = Date.now();
        ajax(url, callbacks, undefined, {
          method: "GET",
          withCredentials: true,
        });
      }
    };
    return { callback: resp };
  },
};

submodule("userId", intentIqIdSubmodule);

import { submodule } from "../src/hook.js";
import { getGlobal } from "../src/prebidGlobal.js";
import { logInfo } from "../src/utils.js";

const MODULE_NAME = "intentiqRTD";
export const configParams = {
  cookieFullBrowserList: ["chrome"],
  isCookieFull: false,
};

function init(config) {
  configParams.browser = detectBrowser();
  configParams.isCookieFull = configParams.cookieFullBrowserList.includes(
    configParams.browser.toLowerCase()
  );

  if (configParams.isCookieFull) {
    logInfo(MODULE_NAME + " Cookiefull browser detected");
  }

  const pbjsInstance = getGlobal();

  if (pbjsInstance) {
    const providers = pbjsInstance.getConfig("userSync.userIds");
    const userUnifiedIdExists = providers.find((p) => p.name === "unifiedId");

    pbjsInstance.getUserIdsAsync().then(function (userIds) {
      const handleCookieless = () => {
        if (userIds.pubProvidedId) {
          const orgUnifiedIdItem = userIds.pubProvidedId.find(
            (item) => item.source === "adserver.org"
          );
          const numUnifiedIdsInProviders = providers.filter(
            (item) => item.source === "adserver.org"
          ).length; // avoid duplicating

          if (orgUnifiedIdItem && numUnifiedIdsInProviders < 2) {
            const orgUnifiedId = orgUnifiedIdItem.uids[0].id;

            const orgUnifiedIdObj = {
              name: "unifiedId",
              value: { tdid: orgUnifiedId },
            };
            providers.unshift(orgUnifiedIdObj);

            pbjsInstance.setConfig({
              userSync: {
                userIds: providers,
              },
            });
          }
        }
      };

      if (userUnifiedIdExists && userIds.tdid) {
        if (configParams.isCookieFull) {
          const iiqProvider = {
            name: "pubProvidedId",
            value: userIds.pubProvidedId,
          };

          providers.unshift(iiqProvider);
          pbjsInstance.setConfig({
            userSync: {
              userIds: providers,
            },
          });
        } else {
          handleCookieless();
        }
      } else {
        handleCookieless();
      }

      pbjsInstance.refreshUserIds();
    });
  }

  return true;
}

function onAuctionInit(bidRequest, config, userConsent) {
  for (let bidderI = 0; bidderI < bidRequest.bidderRequests.length; bidderI++) {
    for (
      let bidI = 0;
      bidI < bidRequest.bidderRequests[bidderI].bids.length;
      bidI++
    ) {
      if (
        !bidRequest.bidderRequests[bidderI].bids[bidI].userId ||
        !bidRequest.bidderRequests[bidderI].bids[bidI].userId.pubProvidedId ||
        bidRequest.bidderRequests[bidderI].bids[bidI].userId.pubProvidedId
          .length == 0
      )
        continue;

      fillMissingIds(
        bidRequest.bidderRequests[bidderI].bidderCode,
        bidRequest,
        bidderI,
        bidI
      );
    }
  }
  logInfo(MODULE_NAME + " Done ");
}

function fillMissingIds(adapterName, bidRequest, bidderI, bidI) {
  try {
    logInfo(MODULE_NAME + " Filling EIDS for " + adapterName);
    if (!bidRequest.bidderRequests[bidderI].bids[bidI].userId) {
      logInfo(MODULE_NAME + " UserId filed is missing " + adapterName);
      return;
    }
    if (!bidRequest.bidderRequests[bidderI].bids[bidI].userId.pubProvidedId)
      bidRequest.bidderRequests[bidderI].bids[bidI].userId.pubProvidedId = [];

    let isRubiconAdapter = adapterName.toLowerCase() == "rubicon";

    let ppuidFoundSoursesString = JSON.stringify(
      bidRequest.bidderRequests[bidderI].bids[bidI].userId.pubProvidedId.map(
        (x) => x.source
      )
    );
    let amountOfTdid = bidRequest.bidderRequests[bidderI].bids[
      bidI
    ].userIdAsEids.filter((x) => x.source == "adserver.org").length;

    for (let newId of bidRequest.bidderRequests[bidderI].bids[bidI].userId
      .pubProvidedId) {
      if (newId.source == "adserver.org") {
        if (!configParams.isCookieFull) {
          bidRequest.bidderRequests[bidderI].bids[bidI].userId.tdid =
            newId.uids[0].id;
        }
        if (isRubiconAdapter && amountOfTdid > 1) {
          removeDuplicateTdidFromAllEids(bidRequest, bidderI, bidI, newId);
        }
      }

      addIdToPpidIfNotPresent(
        bidRequest,
        bidderI,
        bidI,
        ppuidFoundSoursesString,
        newId
      );
    }
    logInfo(MODULE_NAME + " End filling EIDS for " + adapterName);
  } catch (e) {
    logInfo(MODULE_NAME + " Failed to fill missing eids. " + e);
  }
}

function removeDuplicateTdidFromAllEids(bidRequest, bidderI, bidI, iiqTdid) {
  bidRequest.bidderRequests[bidderI].bids[bidI].userIdAsEids =
    bidRequest.bidderRequests[bidderI].bids[bidI].userIdAsEids.filter(
      (x) =>
        x.source !== "adserver.org" ||
        (x.source === "adserver.org" && x.uids && x.uids[0].atype === 1)
    );

  // Filter duplicate sources
  bidRequest.bidderRequests[bidderI].bids[bidI].userIdAsEids =
    bidRequest.bidderRequests[bidderI].bids[bidI].userIdAsEids.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.uids[0].id === value.uids[0].id)
    );
}

function addIdToPpidIfNotPresent(
  bidRequest,
  bidderI,
  bidI,
  stringVersion,
  newId
) {
  if (!stringVersion.includes('"' + newId.source + '"')) {
    bidRequest.bidderRequests[bidderI].bids[bidI].userId.pubProvidedId.push(
      newId
    );
  }
}

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

export const intentIqIdRtdModule = {
  name: MODULE_NAME,
  configParams: configParams,
  init: init,
  onAuctionInitEvent: onAuctionInit,
};

function registerSubModule() {
  submodule("realTimeData", intentIqIdRtdModule);
}

registerSubModule();

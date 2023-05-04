// Methods that will be included:
// 1. isBidRequestValid - check if ssspUid is sent in the params
// 2. buildRequests - Get the standard OpenRTB and process it like we want, in the given format
// ssspUid - this should be included in the request sent by buildRequests
// add pubProvidedIds and tdidRepetition to the object that we are creating
// interpretResponse - Interpret OpenRTB response
// Write tests and documentation
import { registerBidder } from '../src/adapters/bidderFactory.js';
import { BANNER } from '../src/mediaTypes.js';


const BIDDER_CODE = "superssp";
const ENDPOINT_URL = "https://www.superssp.com/api/v1:1234";

export const spec = {
  code: BIDDER_CODE,
  supportedMediaTypes: [BANNER],

  isBidRequestValid: function (bid) {
    // Check if mandatory ssspUid is provided by the bid
    return !!bid.params?.ssspUid;
  },

  buildRequests: function (validBidRequests, bidderRequest) {
    if (validBidRequests.length === 0) {
      return [];
    }

    // Iterate through all bid requests and process them
    return validBidRequests.map((bidRequest) => {
      let sizes = [];
      if (bidRequest?.mediaTypes[BANNER]?.sizes) {
        sizes = bidRequest.mediaTypes[BANNER].sizes;
      }

      const reqBody = {
        ssspUid: bidderRequest.params.ssspUid,
        adUnitCode: bidRequest.adUnitCode,
        auctionId: bidRequest.auctionId,
        bidId: bidRequest.bidId,
        mediaType: {
          banner: { sizes },
          site: {
            page: bidderRequest.refererInfo.page,
            domain: bidderRequest.refererInfo.domain,
            publisher: {
              domain: bidderRequest.params.publisherDomain || "",
            },
          },
          device: {
            w: screen.width,
            h: screen.height,
          },
        },
      };

      let pubProvidedIds = {};

      // Create the pubProvidedIds object if they are given
      if (bidRequest.userId?.pubProvidedId) {
        const ppIds = bidRequest.userId.pubProvidedId;

        ppIds.forEach((ppId) => {
          ppId.uids.forEach((uid) => {
            // Build the object with key as source and value as array of ids
            if (!(ppId.source in pubProvidedIds)) {
              pubProvidedIds[ppId.source] = [];
            }
            pubProvidedIds[ppId.source].push(uid.id);
          });
        });
      }

      reqBody.pubProvidedIds = pubProvidedIds;
      reqBody.tdidRepetition = -2; // if trade desk module not present in pub provided

      // Add unified id to the providedIds object
      if (bidRequest.userId?.unifiedId) {
        const src = "adserver.org";
        const value = bidRequest.userId.unifiedId;

        if (src in pubProvidedIds) {
          // Add value if pub provided module doesn't already have it
          if (!pubProvidedIds[src].includes(value)) {
            pubProvidedIds[src].push(value);
            reqBody.tdidRepetition = -1;
          } else {
            reqBody.tdidRepetition = -5;
          }
        } else {
          pubProvidedIds[src] = [value];
        }
      }

      return {
        method: "POST",
        url: ENDPOINT_URL,
        data: JSON.stringify(reqBody),
      };
    });
  },

  interpretResponse: function (response, request) {
    const bids = converter.fromORTB({
      response: response.body,
      request: request.data,
    }).bids;

    return bids;
  },
};

registerBidder(spec);

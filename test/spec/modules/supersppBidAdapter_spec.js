import { expect } from 'chai';
import { spec } from 'modules/supersspBidAdapter.js';

const ENDPOINT_URL = "https://www.superssp.com/api/v1:1234";

const bid = {
  bidder: "yozmatech",
  params: {
    placement: "123",
    ssspUid: "12345",
    publisherDomain: "yozmatech.com",
  },
  adUnitCode: "test-adunit-1",
  auctionId: "some-auction-id",
  bidderRequestId: "some-bidderrequest-id",
  bidId: "some-bid-id",
  mediaTypes: {
    banner: {
      sizes: [[200, 150]],
    },
  },
  transactionId: "some-transaction-id",
};

const bidderRequest = {
  bidderRequestId: "some-bidderrequest-id",
  bids: [bid],
  auctionId: "some-auction-id",
  auctionStart: Date.now(),
  start: Date.now(),
  bidderCode: "yozmatech",
  timeout: 1000,
};

describe("supersspBidAdapter", function () {
  describe("All methods are present", function () {
    it(`isBidRequestValid should be available and valid`, function () {
      expect(spec.isBidRequestValid).to.be.a("function");
    });

    it(`buildRequests should be available and valid`, function () {
      expect(spec.buildRequests).to.be.a("function");
    });

    it(`interpretResponse should be available and valid`, function () {
      expect(spec.interpretResponse).to.be.a("function");
    });
  });

  describe("isBidRequestValid method", function () {
    it("should yield true since ssspUid is provided", function () {
      expect(spec.isBidRequestValid(bid)).to.equal(true);
    });

    it("should return false since ssspUid is not provided", function () {
      const bidWithoutSsspUid = { ...bid };
      delete bidWithoutSsspUid.params;

      expect(spec.isBidRequestValid(bidWithoutSsspUid)).to.equal(false);
    });
  });

  describe("buildRequests method", function () {
    const bidRequestsValid = spec.buildRequests([bid], bidderRequest);
    expect(bidRequestsValid).to.be.an("array").that.is.not.empty;

    const bidRequest = bidRequestsValid[0];

    it("Returns valid bidRequest", function () {
      expect(bidRequest.method).to.equal("POST");
      expect(bidRequest.url).to.be.equal(ENDPOINT_URL);
      expect(bidRequest.data).to.exist;
    });

    it("should have all the required properties", function () {
      expect(bidRequest.data.ssspUid).to.exist;
      expect(bidRequest.data.adUnitCode).to.exist;
      expect(bidRequest.data.auctionId).to.exist;
      expect(bidRequest.data.bidId).to.exist;
      expect(bidRequest.data.mediaType).to.exist;
      expect(bidRequest.data.mediaType.banner).to.exist;
      expect(bidRequest.data.mediaType.site).to.exist;
      expect(bidRequest.data.mediaType.device).to.exist;
      expect(bidRequest.data.pubProvidedIds).to.exist;
      expect(bidRequest.data.tdidRepetition).to.exist;
    });
  });
});

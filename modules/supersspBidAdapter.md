# Overview

```
Module Name: SuperSSP Bidder Adapter
Module Type: Bidder Adapter
Maintainer: eyvazahmadzada@gmail.com
```

# Description

Module that connects to SuperSSP's demand sources

# Test Parameters
```
    var adUnits = [
        {
            code: 'test-adunit-1',
            mediaTypes: {
                banner: {
                    sizes: [[200, 150]],  // display size of ad
                }
            },
            bids: [
                {
                    bidder: 'yozmatech',
                    params: {
                        placement: '123',
                        ssspUid: '12345',
                        publisherDomain: 'yozmatech.com'
                    }
                }
            ]
        }
    ];
```
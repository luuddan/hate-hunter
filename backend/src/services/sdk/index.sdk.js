import { TwitterSdk } from './twitter/twitter.sdk';
import { TisaneSdk } from './tisane/tisane.sdk';
// eslint-disable-next-line

export class Sdk {
    twitter;
    tisane;
    endpoint

    constructor(endpoint) {
        this.endpoint = endpoint;
        this.twitter = new TwitterSdk(endpoint);
        this.tisane = new TisaneSdk(endpoint);
    }
}

export const getSdk = (apiEndpoint) => {
    return new Sdk(apiEndpoint);
};

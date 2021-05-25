import { BaseSdk } from '../base.sdk';
import { TweetsSdk } from './tweets/tweets.sdk';
import { UsersSdk } from './users/users.sdk';

export class TwitterSdk extends BaseSdk {

    token = {
        headers:{
        'Authorization': '/*ADD KEY HERE*/'
      }
    };

    constructor(apiEndpoint) {
        super()
        this.tweets = new TweetsSdk(apiEndpoint, this.token);
        this.users = new UsersSdk(apiEndpoint, this.token);
    }

}

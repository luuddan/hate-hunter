import { BaseSdk } from '../../base.sdk';

export class UsersSdk extends BaseSdk {
    async getUsersByUsernames(query) {
        const users = await this.get(`${this.twitter2Path}/users/by?usernames=${query}&user.fields=created_at,description,location,profile_image_url,public_metrics`)
        return users
    }
}

import axios from 'axios';

export class BaseSdk {
    twitter1Path = 'https://api.twitter.com/1.1';
    twitter2Path = 'https://api.twitter.com/2';
    tisanePath = 'https://api.tisane.ai'
    
    apiEndpoint;
    token;
    
    constructor(apiEndpoint, token) {
        this.apiEndpoint = apiEndpoint;
        this.token = token;
    }

    async get(path) {
        try {
            const result = await axios.get(`${path}`, this.token);
            return result.data;
        } catch (error) {
            if (error.response) {
                // Request made and server responded
                console.log(`HTTP GET failed, error: ${error}`);
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                console.log(`HTTP GET failed, error: ${error}`);
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log(`HTTP GET failed, error: ${error}`);
                console.log(error.message);
            }
            
        }
    }

    async post(path, payload) {
        try {
            const result = await axios.post(`${path}`, payload, this.token);
            return result.data;
        } catch (error) {
            if (error.response) {
                // Request made and server responded
                console.log(`HTTP POST failed, error: ${error}`);
                //console.log(JSON.stringify(error.response));
                //console.log(JSON.stringify(error.response.status));
                //console.log(JSON.stringify(error.response.headers));
            } else if (error.request) {
                // The request was made but no response was received
                console.log(`HTTP POST failed, error: ${error}`);
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log(`HTTP POST failed, error: ${error}`);
                console.log(error.message);
            }
        }
    }

    async put(path, payload){
        try {
            const result = await axios.put(`${path}`, payload, this.token? this.getRequestConfig() : await getTokenHeader());
            return result.data;
        } catch (error) {
            console.log(`HTTP POST failed, error: ${error.message}`);
        }
    }

    async patch(path, payload) {
        try {
            const result = await axios.patch(`${path}`, payload, this.token? this.getRequestConfig() : await getTokenHeader());
            return result.data;
        } catch (error) {
            console.log(`HTTP POST failed, error: ${error.message}`);
        }
    }


    async delete(path) {
        try {
            const result = await axios.delete(`${path}`, this.token? this.getRequestConfig() : await getTokenHeader());
            return result.data;
        } catch (error) {
            console.log(`HTTP POST failed, error: ${error.message}`);
        }
    }
}

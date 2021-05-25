import { BaseSdk } from '../base.sdk';

export class TisaneSdk extends BaseSdk {

    constructor() {
        super()
        this.token = {
            headers: {
              "Ocp-Apim-Subscription-Key": "/*ADD KEY HERE*/",
              "Content-Type": "text/plain",
            },
          };
    }


  analyseSettings = {
    settings: {
      deterministic: false,
      sentiment_analysis_type: "entity",
      snippets: true,
      subscope: false,
      parses: false,
      format: "shortpost",
      document_sentiment:true,
    },
  };

  async analyse(language,content) {
    const body = {...this.analyseSettings, language: language, content: content};
    const response = await this.post(`${this.tisanePath}/parse`, body);
    //console.log("----------tisane analyse response", response)
    return response;
  }
}

export class QueryHelper {

  constructor(){
      this.queryString = ``;

  }
  keywords(keywords) {
    if (keywords && keywords.length > 0) {
      this.queryString += this.queryString.length > 0 ? `AND (toLower(t.text) CONTAINS` : `WHERE (toLower(t.text) CONTAINS`;
      keywords.map((keyword, idx) => {
        if (idx === 0) {
          this.queryString += ` toLower("${keyword}") OR t.urls CONTAINS toLower("${keyword}")`;
        } else {
          this.queryString += ` OR toLower(t.text) CONTAINS toLower("${keyword}") OR t.urls CONTAINS toLower("${keyword}")`;
        }
      });
      this.queryString += `)`;
    }
  }

  hashtags(hashtags) {
    if (hashtags && hashtags.length > 0) {
      const formattedHashtags = hashtags.map((h) => "#" + h);
      this.queryString += this.queryString.length > 0 ? `AND (toLower(t.text) CONTAINS` : `WHERE (toLower(t.text) CONTAINS`;
      formattedHashtags.map((keyword, idx) => {
        if (idx === 0) {
          this.queryString += ` toLower("${keyword}") OR t.urls CONTAINS toLower("${keyword}")`;
        } else {
          this.queryString += ` OR toLower(t.text) CONTAINS toLower("${keyword}") OR t.urls CONTAINS toLower("${keyword}")`;
        }
      });
      this.queryString += `)`;
    }
  }

  users(users) {
    if (users && users.length > 0) {
      this.queryString += this.queryString.length > 0 ? `AND (u.username =` : `WHERE (u.username =`;
      users.map((user, idx) => {
        if (idx === 0) {
          this.queryString += ` "${user}"`;
        } else {
          this.queryString += ` OR u.username = "${user}"`;
        }
      });
      this.queryString += `)`;
    }
  }

  time(startTime, endTime) {
    if (startTime && endTime) 
      this.queryString += this.queryString.length > 0 ? ` AND "${startTime}"<=t.created_at<="${endTime}"` : ` WHERE "${startTime}"<=t.created_at<="${endTime}"`;
  }

  languages(lang){
    if (lang && lang.length > 0) {
        lang.map((l, idx) => {
            if (idx === 0) { 
              this.queryString += this.queryString.length > 0 ? ` AND (t.lang = "${l}" ` : ` WHERE (t.lang = "${l}" `; 
            } else {
                this.queryString += ` OR t.lang = "${l}" `;
            }
        })
        this.queryString += `)`
    }
  }

  excludeKeywords(excludeKeywords) {
    console.log("excludekeywords", excludeKeywords)
    if (excludeKeywords && excludeKeywords.length > 0) {
      this.queryString += this.queryString.length > 0 ? `AND NOT (toLower(t.text) CONTAINS` : `WHERE (NOT toLower(t.text) CONTAINS`;
      excludeKeywords.map((keyword, idx) => {
        if (idx === 0) {
          this.queryString += ` toLower("${keyword}")`;
        } else {
          this.queryString += ` OR toLower(t.text) CONTAINS toLower("${keyword}")`;
        }
      });
      this.queryString += `)`;
    }
    console.log("query X keywords",this.queryString)
  }

  excludeHashtags(excludeHashtags) {
    if (excludeHashtags && excludeHashtags.length > 0) {
      const formattedHashtags = excludeHashtags.map((h) => "#" + h);
      this.queryString += this.queryString.length > 0 ? `AND NOT (toLower(t.text) CONTAINS` : `WHERE (NOT toLower(t.text) CONTAINS`;
      formattedHashtags.map((keyword, idx) => {
        if (idx === 0) {
          this.queryString += ` toLower("${keyword}")`;
        } else {
          this.queryString += ` OR toLower(t.text) CONTAINS toLower("${keyword}")`;
        }
      });
      this.queryString += `)`;
    }
  }

  excludeUsers(excludeUsers) {
    if (excludeUsers && excludeUsers.length > 0) {
      this.queryString += this.queryString.length > 0 ? `AND NOT (u.username =` : `WHERE (NOT u.username =`;
      excludeUsers.map((user, idx) => {
        if (idx === 0) {
          this.queryString += ` "${user}"`;
        } else {
          this.queryString += ` OR u.username = "${user}"`;
        }
      });
      this.queryString += `)`;
    }
  }

  filterAbuse(filterAbuse) {
    if (filterAbuse && filterAbuse.length > 0) {
      this.queryString += this.queryString.length > 0 ? ` AND (a.text = ` : ` WHERE (a.text =`; 
      filterAbuse.map((abuse, idx) => {
        if (idx === 0) {
          this.queryString += ` "${abuse}"`;
        } else {
          this.queryString += ` OR a.text = "${abuse}"`;
        }
      });
      this.queryString += `)`;
    }
  }

  returnQuery() {
      return this.queryString;
  }
}

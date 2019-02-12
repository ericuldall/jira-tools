# JIRA Tools

JIRA Tools is a cli tool and library that allows you to perform actions against your JIRA projects via your command line or node.js scripts.


## Getting Started CLI

*INSTALL*
```
npm install -g jira-tools
```

*AUTHENTICATE*
```
jtools auth -i && source ~/.bashrc
```

*RUN A COMMAND*
```
jtools -p [PROJECT] realease get --all
```

## Commands

- auth
- release


## Getting Starts Library
*INSTALL*
```
npm install --save jira-tools
```

*CONFIGURE*
Create the following 2 files...

*config/custom-environment-variables.json*
```
{
  "jtools": {
    "auth": {
      "user": "JTOOLS_AUTH_USER",
      "password": "JTOOLS_AUTH_PASSWORD"
    },
    "api": {
      "url": "JTOOLS_API_URL",
      "version": "JTOOLS_API_VERSION"
    }
  }
}
```
config/default.json
```
{
  "jtools": {
    "api": {
      "url": "https://jira.atlassian.net",
      "path": "/rest/api/",
      "version": "2"
    }
  }
}
```

*AUTHENTICATE*
You can authenticate using the cli method above, or you can simply set the following env vars
1. JTOOLS_AUTH_USER=[JIRA_EMAIL]
2. JTOOLS_AUTH_PASSWORD=[base64(JIRA_PASSWORD)]
3. JTOOLS_API_URL=https://[YOUR_SUBDOMAIN].atlassian.net
4. (optional) JTOOLS_API_VERSION=3 (default: 2) - You can also change the default in default.json instead

*IMPLEMENTATION*
```
const Jira = require('jira-tools');
Jira.getIssues({
  jql: 'status = "In Progress"',
  startAt: 0,
  maxResults: 20'
}).then(json => {
  console.log(json); //get your issues
});
```

*Note:* This is a very simple wrapper to make API calls a bit easier. I implement the methods as I need them for my use cases. This is not an exahaustive list of methods available via the JIRA api.
If you'd like to see a method added, please send a [Pull Request](https://github.com/ericuldall/jira-tools/pulls) or [Open an Issue](https://github.com/ericuldall/jira-tools/issues).

[!!List of available methods!!](https://github.com/ericuldall/jira-tools/blob/master/utils/Jira.js)

'use strict';
module.exports = app => {
  const querystring = require('querystring');
  const { post: httpPost } = require('axios');
  const { Octokit } = require('@octokit/rest');
  const { createTokenAuth } = require("@octokit/auth-token");

  app.log('app loaded');
  app.on('issues.opened', async ctx => {
    const issueComment = ctx.issue({ body: 'Thanks for opening the issue!' });
    return ctx.github.issues.createComment(issueComment);
  });
  app.on('issues.edited', async ctx => {
    const { data } = await ctx.github.rateLimit.get();
    app.log(data.rate);
  });
  const server = app.route()

  server.get('/diagnostic', async (req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  server.get('/app_auth', async (req, res) => {
    const octokit = await app.auth()
    const { data } = await octokit.apps.getAuthenticated()
    res.json(data)
  });

  server.get('/login', async (req, res) => {
    const { CLIENT_ID, CLIENT_SECRET } = process.env;
    if (!(CLIENT_ID && CLIENT_SECRET)) {
      res.status(500).json({ status: "error", message: "invalid CLIENT_(ID/SECRET)" });
      return
    }

    // GitHub needs us to tell it where to redirect users after they've authenticated
    const protocol = req.headers['x-forwarded-proto'] || req.protocol
    const host = req.headers['x-forwarded-host'] || req.get('host')

    const params = querystring.stringify({
      client_id: process.env.CLIENT_ID,
      redirect_uri: `${process.env.PROXY_URL}/login/cb`
    })

    const url = `https://github.com/login/oauth/authorize?${params}`
    res.redirect(url)
  })

  server.get('/login/cb', async (req, res) => {
    /*
     * TODO: for handling error with oauth
     * error=redirect_uri_mismatch
     * error_description=The+redirect_uri+MUST+match+the+registered+callback+URL+for+this+application.&error_uri=https%3A%2F%2Fdeveloper.github.com%2Fapps%2Fmanaging-oauth-apps%2Ftroubleshooting-authorization-request-errors%2F%23redirect-uri-mismatch
     */
    // code:

    const { CLIENT_ID: client_id, CLIENT_SECRET: client_secret } = process.env;
    const { code } = req.query;

    // Exchange our "code" and credentials for a real token
    // Use our app's OAuth credentials and the code that GitHub gave us
    const tokenRes = await httpPost('https://github.com/login/oauth/access_token', {
       client_id, client_secret, code
    })

    app.log('DATA', tokenRes.data);
    // Authenticate our Octokit client with the new token
    const { access_token: accessToken } = querystring.parse(tokenRes.data);
    app.log('AUTH', { accessToken });

    const auth = createTokenAuth(accessToken);
    const authentication = await auth();

    app.log('AUTHENTICATION', authentication);

    const octokit = new Octokit({
      auth:  accessToken,
      authStrategy: createTokenAuth
    });
    const user = await octokit.users.getAuthenticated()
    app.log(user.data) // <-- This is what we want!

    res.status(200).json(user.data);
  });
}

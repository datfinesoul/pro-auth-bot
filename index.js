'use strict';
module.exports = app => {
  const querystring = require('querystring');

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
    // GitHub needs us to tell it where to redirect users after they've authenticated
    const protocol = req.headers['x-forwarded-proto'] || req.protocol
    const host = req.headers['x-forwarded-host'] || req.get('host')

    const params = querystring.stringify({
      client_id: process.env.CLIENT_ID,
      redirect_uri: `https://smee.io/FHyERq3bkMhXzPB/login/cb`
    })

    const url = `https://github.com/login/oauth/authorize?${params}`
    res.redirect(url)
  })

  server.post('/login/cb', async (req, res) => {
    app.log(req);
    res.status(200).json({ status: 'ok' });
  });
}

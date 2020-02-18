### Install

```bash
./scripts/setup_proxy
npm run dev
```

- hit http://localhost:3000 and perform setup
- more coming...

### Quirks
- `User authorization callback URL` on the Github Apps setting page
  will default to the "Chrome Saved Passwords" login for github, which
  then prevents proper submission of that page.
  1.) Clear the passwords for Github OR
  1.) Clear the field prior to submitting

- After installing a Github App, it still needs to be made active

- CLIENT_ID and CLIENT_SECRET need to be added to .env but manually pulled from
  https://github.com/settings/apps for the specific app

- `This GitHub App must be configured with a callback URL` error fires when the
  `User authorization callback URL` mentioned above is not set.  For whatever reason,
  github app manifests do not allow this to be set on creation, so for now it needs
  to be manually entered.

### Questions
- Can the app be automatically activated?
- Can the app be installed only for the org, and if so, what user needs to
  install it?

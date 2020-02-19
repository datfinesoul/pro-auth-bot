### Install

```bash
./scripts/setup_proxy
npm run dev
```

1. Navigate to the URL in the startup message (not localhost)
1. Edit "App Settings" afterward to make the app "active"
1. CLIENT_ID and CLIENT_SECRET need to be added to .env but manually pulled from
  https://github.com/settings/apps for the specific app
1. Add `http://<your ngrok url>/login/cb` to the `User authorization callback URL` on the
  settings page.

- NOTE: If you run npm dev dev before setup_proxy, a .env file will be
  automatically created.  In that case, please delete that file and follow the steps
  in order.


### Quirks
- `User authorization callback URL` on the Github Apps setting page
  will default to the "Chrome Saved Passwords" login for github, which
  then prevents proper submission of that page.
  1. Clear the passwords for Github OR
  1. Clear the field prior to submitting
- Same problem with the `secret`.  Before updating this page, please make sure none
  of the fields have a colored background indicating auto change.

- After installing a Github App, it still needs to be made active


- `This GitHub App must be configured with a callback URL` error fires when the
  `User authorization callback URL` mentioned above is not set.  For whatever reason,
  github app manifests do not allow this to be set on creation, so for now it needs
  to be manually entered.

### Questions
- Can the app be automatically activated?
- Can the app be installed only for the org, and if so, what user needs to
  install it?

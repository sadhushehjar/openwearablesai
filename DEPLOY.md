# Deploying openwearablesai.com

The site is built, committed on `main`, and the remote is already set to
`https://github.com/sadhushehjar/openwearablesai.git`.

Three things remain, and all three need your GitHub / GoDaddy login, so they
have to be run by you.

---

## 1. Create the repo and push

You have no GitHub credentials cached on this machine (no SSH key registered, no
token in the keychain), so start by authenticating.

```bash
brew install gh
```

```bash
gh auth login
```

Choose **GitHub.com → HTTPS → Login with a web browser** and follow the prompts.

Then, from `/Users/shehjarsadhu/Desktop/PesonalWebsiteUpdate`:

```bash
gh repo create openwearablesai --public --source=. --remote=origin --push
```

That creates the repository and pushes `main` in one step.

> If you would rather not install `gh`: create an empty **public** repo named
> `openwearablesai` at https://github.com/new (no README, no .gitignore), then
> run `git push -u origin main` and sign in when prompted.

---

## 2. Turn on Pages

Go to **Settings → Pages** in the new repo and set:

- **Source: GitHub Actions**

Do *not* pick "Deploy from a branch" — the workflow at
`.github/workflows/deploy.yml` publishes the build artifact directly.

The workflow runs automatically on every push to `main`. Watch the first run in
the **Actions** tab; it takes roughly two minutes.

Once it succeeds, in **Settings → Pages → Custom domain** enter:

```
openwearablesai.com
```

Leave **Enforce HTTPS** unchecked for now — GitHub cannot issue the certificate
until DNS resolves. Come back and tick it once step 3 has propagated.

---

## 3. Point the domain at GitHub (GoDaddy)

In GoDaddy: **My Products → openwearablesai.com → DNS → DNS Records**.

**Delete** any existing `A` record on `@` (GoDaddy adds a parking-page one by
default), and any `CNAME` on `www` pointing at a GoDaddy parking host.

**Add four A records** for the apex domain — these are GitHub's Pages IPs:

| Type | Name | Value           | TTL    |
| ---- | ---- | --------------- | ------ |
| A    | @    | 185.199.108.153 | 1 hour |
| A    | @    | 185.199.109.153 | 1 hour |
| A    | @    | 185.199.110.153 | 1 hour |
| A    | @    | 185.199.111.153 | 1 hour |

**Add one CNAME** so `www` works too:

| Type  | Name | Value                        | TTL    |
| ----- | ---- | ---------------------------- | ------ |
| CNAME | www  | sadhushehjar.github.io.      | 1 hour |

Note the trailing dot on the CNAME value — GoDaddy usually adds it for you.

DNS typically propagates in 10–30 minutes, occasionally longer. Check with:

```bash
dig +short openwearablesai.com
```

You want the four `185.199.x.153` addresses back. When that resolves, return to
**Settings → Pages** and tick **Enforce HTTPS**.

---

## Afterwards

Every push to `main` redeploys automatically:

```bash
git add -A && git commit -m "Update content" && git push
```

Content lives in `site/src/lib/data.ts`. The CNAME file at
`site/public/CNAME` is what keeps the custom domain attached through
redeploys — leave it in place.

## Troubleshooting

**Page loads but has no styling** — usually means the CNAME was dropped and the
site is being served from `sadhushehjar.github.io/openwearablesai/` instead of
the apex domain. Confirm `site/public/CNAME` still reads `openwearablesai.com`.

**404 on every route** — check that Pages source is set to *GitHub Actions*, not
a branch.

**Certificate error after enabling HTTPS** — remove and re-add the custom domain
in Settings → Pages; that re-triggers certificate issuance.

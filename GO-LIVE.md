# Go live and get found

Three tasks, in order. Task 1 must finish before task 2 works.

Current state, checked 8 September 2026:

| | |
| --- | --- |
| Site builds and deploys | ✅ working |
| Live at | `https://sadhushehjar.github.io/openwearablesai/` |
| `openwearablesai.com` points to | ❌ GoDaddy parking (`13.248.243.5`, `76.223.105.230`) |
| Custom domain on GitHub | ❌ not set — waiting on DNS |

---

## Task 1 — Point the domain at GitHub (GoDaddy)

### 1.1 Open the DNS editor

1. Go to <https://dcc.godaddy.com/control/portfolio> and sign in.
2. Find **openwearablesai.com** and click it.
3. Click **DNS** (or **Manage DNS**).

You are now on a list of DNS records.

### 1.2 Delete the parking records

GoDaddy points new domains at its own parking page. Those records must go or
they will fight the new ones.

Delete these, using the pencil/trash icon at the right of each row:

- Every record with **Type `A`** and **Name `@`** (there will be one, pointing at
  something like `76.223.105.230`)
- The record with **Type `CNAME`** and **Name `www`** if it points at
  `openwearablesai.com` or a GoDaddy parking host

Leave everything else alone. Do **not** touch the `NS` or `SOA` records.

### 1.3 Add GitHub's four A records

Click **Add New Record** four times. These are GitHub Pages' published
addresses, the same four for everyone:

| Type | Name | Value | TTL |
| --- | --- | --- | --- |
| A | `@` | `185.199.108.153` | 1 hour |
| A | `@` | `185.199.109.153` | 1 hour |
| A | `@` | `185.199.110.153` | 1 hour |
| A | `@` | `185.199.111.153` | 1 hour |

Yes, four separate records, all with Name `@`. That is correct and intentional:
it is how the traffic gets spread across GitHub's servers.

### 1.4 Add the www record

One more, so `www.openwearablesai.com` works too:

| Type | Name | Value | TTL |
| --- | --- | --- | --- |
| CNAME | `www` | `sadhushehjar.github.io.` | 1 hour |

Note the trailing dot. GoDaddy usually adds it for you; leave it if it appears.

### 1.5 Wait, then check

Usually 10–30 minutes. Run this in Terminal:

```bash
dig +short openwearablesai.com
```

You want the four `185.199.x.153` addresses back. While it still shows
`76.223.105.230`, it has not propagated yet — wait and run it again.

### 1.6 Tell me

When `dig` returns the GitHub addresses, say so. I will then:

- attach the custom domain to the repository
- remove the `/openwearablesai` base path from the build, which the apex domain
  does not use
- turn on **Enforce HTTPS** once GitHub has issued the certificate
- confirm the live site responds on both `openwearablesai.com` and `www`

Do not skip this handoff. The base path has to come out in the same change, or
the apex domain will load unstyled.

---

## Task 2 — Tell Google the site exists

Only after task 1 resolves. Submitting a domain that does not load wastes the
first crawl.

### 2.1 Create the property

1. Go to <https://search.google.com/search-console>, sign in with your Google
   account.
2. Click **Add property**.
3. Choose the **Domain** box on the left (not "URL prefix"). It covers the apex,
   `www`, http and https in one property.
4. Enter `openwearablesai.com` and click **Continue**.

### 2.2 Verify by DNS

Google shows you a **TXT record** to add, something like
`google-site-verification=AbCdEf...`.

1. Copy that value.
2. Back in GoDaddy DNS, **Add New Record**:

   | Type | Name | Value | TTL |
   | --- | --- | --- | --- |
   | TXT | `@` | *(paste the google-site-verification value)* | 1 hour |

3. Save, wait about 10 minutes, then click **Verify** in Search Console.

If it fails the first time, wait longer and click Verify again. DNS is slow, not
broken.

### 2.3 Submit the sitemap

1. In Search Console, open **Sitemaps** in the left sidebar.
2. Enter `sitemap.xml` in the box and click **Submit**.

The full URL is `https://openwearablesai.com/sitemap.xml` and it is already
live — the build generates it.

### 2.4 Request indexing

1. Paste `https://openwearablesai.com/` into the search bar at the very top of
   Search Console.
2. Click **Request indexing**.

This pushes you into the crawl queue rather than waiting to be found. Expect
days, not weeks.

---

## Task 3 — Link to it from profiles you already own

This is what actually decides whether you rank for your own name. Google needs
corroboration that this site is you, and the strongest signal is a link from a
page it already trusts and already associates with your name.

Do these in order of value:

### 3.1 Google Scholar — highest value

Your Scholar profile is likely the page that ranks first for "Shehjar Sadhu"
today, so a link from it carries the most weight.

1. Go to <https://scholar.google.com/citations?user=pOj-vwUAAAAJ&hl=en>
2. Click **Edit profile** (pencil icon next to your name).
3. Put `https://openwearablesai.com` in the **Homepage** field.
4. Save.

### 3.2 GitHub profile

1. <https://github.com/sadhushehjar> → **Edit profile**
2. **Website** field → `https://openwearablesai.com`
3. Save.

### 3.3 LinkedIn

1. Your profile → **Edit intro** (pencil under your name)
2. **Add website** → `https://openwearablesai.com`, type "Personal"
3. Also worth putting the URL in your **About** section as plain text.

### 3.4 The rest

- **ORCID** — Websites & social links section
- **ResearchGate** — profile, contact info
- **URI department page** — ask the web administrator to add it to your listing
- **Medium** — profile → about → website
- **Email signature** — small, but it puts the URL in front of collaborators

---

## What to expect

Your name is distinctive and you have real citations, so this is a favourable
case. Realistically:

- **Days** after indexing: the site appears when you search the exact phrase
  `openwearablesai` or `"Shehjar Sadhu" wearable`
- **2–6 weeks**: page one for `Shehjar Sadhu`
- **Months**: competing with your own Scholar and LinkedIn pages for the top
  spot, since those sit on very strong domains

Nothing here is a trick, and there is no version of this that is faster without
being the kind of thing that damages an academic profile. Real links from real
profiles, and a site that loads fast and says clearly who you are.

## Checking on it

```bash
dig +short openwearablesai.com          # DNS pointing at GitHub?
curl -sI https://openwearablesai.com    # site responding?
```

In Search Console, **Pages** shows what Google has indexed and **Performance**
shows which queries you are appearing for once data starts arriving.

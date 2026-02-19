SEO & Google Publish Checklist for Pegas (one-by-one)

Follow these steps after you publish the site to the live domain (https://pegas.lk).

1) Add property to Google Search Console
- Go to https://search.google.com/search-console
- Add a new property using the full site URL (use the https:// version).

2) Verify ownership (choose one)
A) HTML meta tag (quickest)
- In Search Console choose HTML tag verification.
- Copy the token string Google gives you (looks like `abc123...`).
- Open `index.html` and replace the empty token in the meta tag near the top:

  <meta name="google-site-verification" content="PUT_TOKEN_HERE" />

- Save and deploy the site, then click "Verify" in Search Console.

B) DNS TXT record (recommended for root domain)
- In Search Console choose DNS verification and copy the TXT value.
- Add a DNS TXT record for your domain (example for Cloudflare, registrar, or DNS provider).
- After the DNS change propagates, click "Verify".

3) Confirm `robots.txt` and `sitemap.xml`
- `robots.txt` should allow crawling and include `Sitemap: https://pegas.lk/sitemap.xml`.
- Repo already contains `sitemap.xml` and `robots.txt` with a sitemap line. Ensure the live domain serves the same files.

4) Submit sitemap
- In Search Console → Sitemaps, enter `https://pegas.lk/sitemap.xml` and submit.

5) Ensure HTTPS & canonical URLs
- Serve the site on HTTPS with a valid certificate (letsencrypt or provider-managed).
- Verify canonical tags are set (pages have `<link rel="canonical" href="https://pegas.lk/..." />`).

6) Mobile & performance checks
- Run Mobile-Friendly Test: https://search.google.com/test/mobile-friendly
- Run PageSpeed / Core Web Vitals: https://pagespeed.web.dev/ and address issues.

7) Request indexing of key pages
- In Search Console → URL Inspection, paste `https://pegas.lk/` (and any important pages) and click "Request Indexing".

8) Claim Google Business Profile (for local visibility)
- Visit https://business.google.com/ and create/claim the business profile for "Pegas".

9) Monitor Search Console
- Check Coverage, Enhancements (structured data), and Performance reports.
- Fix errors and re-submit pages as needed.

10) Optional: Rich results and structured data
- Validate JSON-LD with the Rich Results Test: https://search.google.com/test/rich-results
- Fix any schema errors.

Quick checks you can run locally before publishing
- Confirm `index.html` has the verification meta tag filled when you get the token.
- Confirm `site.webmanifest` includes `assets/images/favicon_image.png` (already set).
- Confirm `robots.txt` includes the sitemap line (already present).

If you want, I can:
- Insert your actual Search Console token into `index.html` (paste the token here), then verify the file is updated.
- Prepare a DNS TXT record example for your registrar (tell me your registrar/provider).
- Walk through submitting the sitemap and requesting indexing step-by-step while you perform verification.


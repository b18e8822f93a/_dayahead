# Day Ahead

Day Ahead is a static browser game for forecasting the UK's day-ahead
electricity price. Players use the available wind forecast to make a daily
prediction in GBP/MWh, then compare it with the published outturn.

The live site is available at [dayahead.co.uk](https://dayahead.co.uk).

## Using the site

- **Play**: enter a forecast for the displayed delivery date before the UK
  gate-close time shown on the page.
- **Results**: review saved forecasts and their error against the outturn.
- **Daily**: explore hourly day-ahead prices.
- **Data**: view the underlying hourly price and wind data.
- **Blog**: read the introduction to the game and the market context.

Forecast history is retained in the browser's `localStorage`. A submitted
forecast also sends its value, delivery date, and an anonymous browser ID to
the scoring endpoint; the site does not require an account.

## Run locally

This is a static site with no build step. From the repository root, serve the
files with any static HTTP server, for example:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Use a server rather than opening files
directly so that the page iframes and asset paths behave as they do in
production.

## Project layout

| Path | Purpose |
| --- | --- |
| `index.html` | Redirects visitors to the Daily page. |
| `play.html`, `daily.html`, `data.html`, `results.html`, `blog.html` | Top-level pages and navigation shell. |
| `play_.html`, `daily_.html`, `data_.html`, `results_.html` | Embedded application views loaded by the top-level pages. |
| `tsc2.min.js` | Shared navigation and top-level page behaviour. |
| `tsc.min.js` | Game, chart, result, and data-view behaviour. |
| `today.json.js` | Current-day wind-forecast data used by Play. |
| `outturns.json.js` | Historical hourly price and wind data used by Daily, Data, and Results. |
| `.github/workflows/static.yml` | Deploys the repository to GitHub Pages on pushes to `main`. |

The JavaScript and CSS dependencies are committed as browser assets, so no
package installation is required for a local preview.

## Data maintenance

The game reads its data from the bundled JavaScript files rather than from a
runtime API. Updating `today.json.js` refreshes the forecast displayed on
**Play**; updating `outturns.json.js` refreshes the historical prices and wind
values used elsewhere. Keep their field names and date formats compatible with
the existing page code when updating them.

## Recommended next step

The most valuable next step is an automated daily data-refresh pipeline. It
would fetch the latest wind forecast and day-ahead outturns, validate the
records, regenerate `today.json.js` and `outturns.json.js`, and publish the
updated static site. This would keep the game usable every day, remove the
manual update burden, and provide a clear foundation for later improvements
such as richer market inputs or a public leaderboard.

## Deployment

GitHub Actions deploys the repository as a GitHub Pages site whenever `main`
is updated. The custom domain is configured in `CNAME`. The `.htaccess` HTTPS
redirect is relevant only when the site is served by Apache; GitHub Pages
handles HTTPS separately.

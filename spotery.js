import puppeteer from "puppeteer";
import cheerio from "cheerio";

const MAX_SPOTS_PER_PAGE = 24;
const MAX_TIMES_PER_SPOT = 14;
const PAGE_COUNT = 3;
const BASE_URL = "https://www.spotery.com";

const escapeColons = (id) => id.replace(/:/g, "\\:");

const timeElementSelector = (spotIdx, timeIdx) =>
  escapeColons(`#pt1:iSpot:${spotIdx}:dcTime:iTime:${timeIdx}:dc_pgl4`);

const spotTitleSelector = (spotIdx) =>
  escapeColons(`#pt1:iSpot:${spotIdx}:dcTime:it1::text`);

const _scrapePage = async (page, pageIdx) => {
  const html = await page.$eval(escapeColons("#pt1:pgl21"), (node) => {
    return node.innerHTML;
  });
  const $ = cheerio.load(html);

  return [...Array(MAX_SPOTS_PER_PAGE).keys()]
    .map((spotDelta) => {
      const spotIdx = pageIdx * MAX_SPOTS_PER_PAGE + spotDelta;

      return [
        $(spotTitleSelector(spotIdx)).text(),
        [...Array(MAX_TIMES_PER_SPOT).keys()]
          .map((timeIdx) =>
            $(timeElementSelector(spotIdx, timeIdx)).text().trim()
          )
          .filter((s) => s.length > 0 && !s.match(/(Booked|Unavailable)/)),
        BASE_URL +
          $(escapeColons(`#pt1:iSpot:${spotIdx}:dcTime:dc_b2`))
            .children()
            .attr("href"),
      ];
    })
    .filter(([_, times]) => times.length > 0);
};

const _url = (date) =>
  `${BASE_URL}/search?psAddrCity=San%20Francisco&psReservationDateStr=${date}&psIsGridView=false`;

const scrapeSpots = async (date, headless = true) => {
  console.log("browser start");
  const browser = await puppeteer.launch({ headless });
  const page = await browser.newPage();
  await page.goto(_url(date));

  await Promise.all([
    page.waitForSelector(timeElementSelector(0, 0)),
    page.click(escapeColons("#pt1:lAva")),
  ]);

  var pageIdx = 0;
  var results = [];
  while (true) {
    results = results.concat(await _scrapePage(page, pageIdx));
    pageIdx += 1;

    if (pageIdx == PAGE_COUNT) break;

    await Promise.all([
      page.waitForSelector(spotTitleSelector(pageIdx * MAX_SPOTS_PER_PAGE)),
      page.click(escapeColons("#pt1:lNext")),
    ]);
  }

  console.log("browser close");
  await browser.close();

  return results;
};

export { scrapeSpots };

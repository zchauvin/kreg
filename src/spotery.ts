import puppeteer from "puppeteer";
import cheerio from "cheerio";
import _ from "lodash";
import { SPOTS, SpotName } from "./constants.js";

const MAX_SPOTS_PER_PAGE = 24;
const MAX_TIMES_PER_SPOT = 14;
const PAGE_COUNT = 3;
const BASE_URL = "https://www.spotery.com";

const escapeColons = (id: string) => id.replace(/:/g, "\\:");

const timeElementSelector = (spotIdx: number, timeIdx: number) =>
  escapeColons(`#pt1:iSpot:${spotIdx}:dcTime:iTime:${timeIdx}:dc_pgl4`);

const spotNameSelector = (spotIdx: number) =>
  escapeColons(`#pt1:iSpot:${spotIdx}:dcTime:it1`);

export interface ReservationInfo {
  name: SpotName;
  date: string;
  time: string;
}

const _scrapePage = async (
  page: puppeteer.Page,
  pageIdx: number,
  date: string
): Promise<ReservationInfo[]> => {
  const html = await page.$eval(escapeColons("#pt1:pgl21"), (node) => {
    return node.innerHTML;
  });
  const $ = cheerio.load(html);

  return _.flatten(
    [...Array(MAX_SPOTS_PER_PAGE).keys()].map((spotDelta) => {
      const spotIdx = pageIdx * MAX_SPOTS_PER_PAGE + spotDelta;

      const times = [...Array(MAX_TIMES_PER_SPOT).keys()]
        .map((timeIdx) =>
          $(timeElementSelector(spotIdx, timeIdx)).text().trim()
        )
        .filter((s) => s.length > 0 && !s.match(/(Booked|Unavailable)/));

      return times.map((time) => ({
        name: $(spotNameSelector(spotIdx)).text() as SpotName,
        date,
        time,
      }));
    })
  );
};

const _url = (date: string) =>
  `${BASE_URL}/search?psAddrCity=San%20Francisco&psReservationDateStr=${date}&psIsGridView=false`;

const scrapeSpots = async (
  date: string,
  headless = true
): Promise<ReservationInfo[]> => {
  const browser = await puppeteer.launch({ headless, args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.goto(_url(date));

  await Promise.all([
    page.waitForSelector(timeElementSelector(0, 0)),
    page.click(escapeColons("#pt1:lAva")),
  ]);

  var pageIdx = 0;
  var results: ReservationInfo[] = [];
  while (true) {
    results = results.concat(await _scrapePage(page, pageIdx, date));
    pageIdx += 1;

    if (pageIdx == PAGE_COUNT) break;

    await Promise.all([
      page.waitForSelector(spotNameSelector(pageIdx * MAX_SPOTS_PER_PAGE)),
      page.click(escapeColons("#pt1:lNext")),
    ]);
  }

  await browser.close();

  return results;
};

const bookingUrl = (name: SpotName, date: string) =>
  `https://www.spotery.com/spot/${SPOTS[name].id}?psReservationDateStr=${date}`;

export { scrapeSpots, bookingUrl };

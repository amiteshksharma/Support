var express = require('express');
const puppeteer = require('puppeteer');
var router = express.Router();

/* GET users listing. */
const preparePageForTests = async (page) => {

  // Pass the User-Agent Test.
  const userAgent = 'Mozilla/5.0 (X11; Linux x86_64)' +
    'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36';
  await page.setUserAgent(userAgent);
}

const isElementVisible = async (page, cssSelector) => {
  let visible = true;
  await page
    .waitForSelector(cssSelector, { visible: true, timeout: 2000 })
    .catch(() => {
      visible = false;
    });
  return visible;
};

router.post('/', function(req, res, next) {
  // const getSearch = req.body.search;
  const getSearch = req.body.search;
  const convertToParam = getSearch.replace(" ", "%20");
  console.log(convertToParam+"%20");

  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await preparePageForTests(page);
    await page.goto(`https://www.gofundme.com/mvc.php?route=homepage_norma/search&term=${convertToParam+"%20"}`);

    const selectorForLoadMoreButton = 'body > div.content-section.content-section--tan > div > div > div.cell.small-12.text-center.mt2x > a';
    let loadMoreVisible = await isElementVisible(page, selectorForLoadMoreButton);
    let count = 0;
    while (loadMoreVisible && count < 7) {
      await page
        .click(selectorForLoadMoreButton)
        .catch(() => {});
      loadMoreVisible = await isElementVisible(page, selectorForLoadMoreButton);
      count++;
    }

    await page.waitFor(2000);
    const fundMe = await page.evaluate(() => {
      let data = [];

      const getList = document.querySelectorAll('body > div.content-section.content-section--tan > div > div > div.grid-x.grid-margin-x.funds-contain.funds-contain--tiles-grid > div > div');
      for(let tile of getList) {
        const getTileText = tile.querySelector('div.fund-item.fund-description.clamp.mb')
        const getTileInfo = tile.querySelector('a');
        const getTileTitle = tile.querySelector('a > div');
        const getTileRaised = tile.querySelector('div > div > div.show-for-medium');
        const getTileImage = tile.querySelector('body > div.content-section.content-section--tan > div > div > div.grid-x.grid-margin-x.funds-contain.funds-contain--tiles-grid > div > div > a')


        //Get the image url
        const getImageUrl = getTileImage.getAttribute('style');
        let splitValue = 'No image';
        if(getImageUrl) {
          const toArray = getImageUrl.split(";");
          splitValue = toArray[1].substring(toArray[1].indexOf("url(") + 5, toArray[1].length - 2);
        }

        data.push({
          Image: splitValue,
          Text: getTileText.innerText.trim(),
          Link: getTileInfo.href,
          Title: getTileTitle.innerText,
          Raised: getTileRaised.innerText.trim().replace(/(\n)/gm, " ")
        });
      }
      return data;
    })

    console.log("return of function ==> ", fundMe);
    console.log("length of Array: ", fundMe.length);
  
    await browser.close();
    return res.send(fundMe);
  })();
});

module.exports = router;

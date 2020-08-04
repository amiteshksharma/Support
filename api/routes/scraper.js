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

router.get('/', function(req, res, next) {
  (async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await preparePageForTests(page);
    await page.goto('https://www.gofundme.com/mvc.php?route=homepage_norma/search&term=george%20floyd');

    await page.waitFor(3000);
    const fundMe = await page.evaluate(() => {
      let data = [];

      const getList = document.querySelectorAll('body > div.content-section.content-section--tan > div > div > div.grid-x.grid-margin-x.funds-contain.funds-contain--tiles-grid > div > div');
      for(let tile of getList) {
        const getTileInfo = tile.querySelector('a');
        const getTileTitle = tile.querySelector('a > div');
        const getTileRaised = tile.querySelector(' div > div > div.show-for-medium');

        data.push({
          Text: tile.innerText.trim().replace(/(\r\n|\n|\r)/gm, " "),
          Link: getTileInfo.href,
          Title: getTileTitle.innerText,
          Raised: getTileRaised.innerText.trim().replace(/(\n)/gm, " ")
        });
      }
      return data;
    })

    console.log("return of function ==> ", fundMe);
    
  
    await browser.close();
    return res.send("hello");
  })();
});

module.exports = router;

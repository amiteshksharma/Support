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

  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await preparePageForTests(page);
    await page.goto(`https://www.gofundme.com/mvc.php?route=homepage_norma/search&term=${getSearch}`);

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

router.post('/petitions', (req, res, next) => {
  const getSearch = req.body.search;

  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await preparePageForTests(page);

    let data = [];
    
    await page.waitFor(2000);
    let count = 0;
    while (count < 40) {
      await page.goto(`https://www.change.org/search?q=${getSearch}&offset=${count}`);

      const fundMe = await page.evaluate(() => {
        let loopData = [];
        console.log("here");
        const getList = document.querySelectorAll('body > div.page-wrap > #page > #content > div > div > div > div > div > div.search-results > ul > div.search-result');
        console.log("the list here ====> ", getList);

        for(let list of getList) {
            const getTilePetitionTo = list.querySelector('a > div > div > div.row > div.col-xs-12.col-sm-8.col-md-9 > div > div')
            const getTileInfo = list.querySelector('a');
            const getTileTitle = list.querySelector('a > div > div > div.row > div.col-xs-12.col-sm-8.col-md-9 > h3');
            const getTileImage = list.querySelector('a > div > div > div.row > div.col-xs-12.col-sm-4.col-md-3 > div > div > div > div') 
            const getTileUser = list.querySelector('a > div > div > ul > li:nth-child(1) > div > div > div > strong');
            let getTileState = list.querySelector('a > div > div > ul > li:nth-child(1) > div > div > div > span');
            const getTileSupporters = list.querySelector('a > div > div > ul > li:nth-child(2) > span:nth-child(2)')


            const getImageUrl = getTileImage.getAttribute('style');
            let splitValue = 'No image';
            if(getImageUrl) {
              splitValue = getImageUrl.substring(getImageUrl.indexOf("url(") + 5, getImageUrl.length - 2);
              console.log(splitValue);
            }

            if(getTileState === null) {
              getTileState = "No Location States"
            }

            loopData.push({
              Link: getTileInfo.href,
              Text: getTilePetitionTo.innerText,
              Title: getTileTitle.innerText,
              Image: splitValue,
              User: getTileUser.innerText,
              Signatures: getTileSupporters.innerText,
              State: getTileState.innerText
            })
        }
        return loopData;
      });

      for(let i = 0; i < fundMe.length; i++) {
        data.push(fundMe[i]);
      }

      count += 10;
    }

    await browser.close();
    return res.send(data);
  })();

})

module.exports = router;

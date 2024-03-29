// const puppeteer = require('puppeteer');
// //Error.stackTraceLimit = Infinity;
// async function autoscroll(page,limit){
//     await page.evaluate(async (limit) => {
//         //Error.stackTraceLimit = Infinity;
//         await new Promise((resolve,rejcet) => {
//             let intervalId = setInterval(() => {
//                 let scrollHeight = document.querySelector("div.m6QErb:nth-child(2)").scrollHeight;
//                 document.querySelector("div.m6QErb:nth-child(2)").scrollBy(0,scrollHeight);
    
//                 if(document.querySelectorAll(".d4r55").length >= limit){
//                     clearInterval(intervalId);
//                     return resolve();
                    
//                 }
    
//             },600);

//         });
//         return;
//     },limit);
//     return;
// }


// async function clickForMore(page){
//     await page.evaluate(() => {
//         Array.from(document.querySelectorAll(".w8nwRe")).forEach( btn => btn.click());
//         return;
//     });
// }

// async function scrape (limit){
//     const browser = await puppeteer.launch({headless:false});
//     //,product:'firefox',executablePath: '/usr/bin/firefox'
//     const page = await browser.newPage();
//     // page.setDefaultNavigationTimeout(0); 
//     // await page.setCacheEnabled(false);
//     await page.setViewport({ width: 650, height: 900});
//     await page.goto("https://www.google.com/maps/place/McDonald's/@41.5773679,-138.1470906,4z/data=!4m11!1m2!2m1!1smac+donald+america+google+map!3m7!1s0x80c2cd8a89a735bb:0x9fbb776e51cb8d9!8m2!3d33.9474096!4d-118.1179069!9m1!1b1!15sCh1tYWMgZG9uYWxkIGFtZXJpY2EgZ29vZ2xlIG1hcCIDiAEBWhQiEm1hYyBkb25hbGQgYW1lcmljYZIBFGZhc3RfZm9vZF9yZXN0YXVyYW50");
//     await page.waitForNetworkIdle(); // wait for slow network to get all http requests of page
    
//     //await page.waitForNavigation();
//     //await page.waitForTimeout(5000);
//     //await page.screenshot({path: 'example.png'});  
//     await autoscroll(page,limit);
//     await clickForMore(page);
//     const results = await page.evaluate(() => {
//         const fullNames = [];
//         Array.from(document.querySelectorAll(".d4r55")).forEach( fname => fullNames.push(fname.innerText));

//         const reviewsComments = [];
//         Array.from(document.querySelectorAll(".wiI7pd")).forEach( review => reviewsComments.push(review.innerText));

//         const stars = [];
//         Array.from(document.querySelectorAll(".kvMYJc")).forEach(star => stars.push(star.getAttribute("aria-label")));

//         return {fullNames,
//             reviewsComments,
//             stars};
//     });

//     await browser.close();

//     return results;


    
// };

// async function scrape2 (limit){
//     const browser = await puppeteer.launch({headless:false});
//     //,product:'firefox',executablePath: '/usr/bin/firefox'
//     const page = await browser.newPage();
//     // page.setDefaultNavigationTimeout(0); 
//     // await page.setCacheEnabled(false);
//     await page.setViewport({ width: 650, height: 900});
//     await page.goto("https://www.google.com/maps/place/McDonald's/@41.5773679,-138.1470906,4z/data=!4m11!1m2!2m1!1smac+donald+america+google+map!3m7!1s0x80c2cd8a89a735bb:0x9fbb776e51cb8d9!8m2!3d33.9474096!4d-118.1179069!9m1!1b1!15sCh1tYWMgZG9uYWxkIGFtZXJpY2EgZ29vZ2xlIG1hcCIDiAEBWhQiEm1hYyBkb25hbGQgYW1lcmljYZIBFGZhc3RfZm9vZF9yZXN0YXVyYW50");
//     await page.waitForNetworkIdle(); // wait for slow network to get all http requests of page
    
//     //await page.waitForNavigation();
//     await page.waitForTimeout(5000);
//     //await page.screenshot({path: 'example.png'});

//     await page.click("button[aria-label='Sort reviews']"); 
//     await page.waitForTimeout(2000);   
//     await page.click("#action-menu > ul > li:nth-child(4)");
//     await page.waitForNetworkIdle();
//     await page.waitForTimeout(5000);
    
//     await autoscroll(page,limit);
//     await clickForMore(page);
//     const results = await page.evaluate(() => {
//         const fullNames = [];
//         Array.from(document.querySelectorAll(".d4r55")).forEach( fname => fullNames.push(fname.innerText));

//         const reviewsComments = [];
//         Array.from(document.querySelectorAll(".wiI7pd")).forEach( review => reviewsComments.push(review.innerText));

//         const stars = [];
//         Array.from(document.querySelectorAll(".kvMYJc")).forEach(star => stars.push(star.getAttribute("aria-label")));

//         return {fullNames,
//             reviewsComments,
//             stars};
//     });

//     //await browser.close();

//     return results;


    
// };


// async function test(){
//     try{
//         await scrape(20);
//         console.log("test");
//         await scrape2(20);
//         console.log("test2");
//     }catch(e){
//         console.error(e);
//     }
// }
// test().then(()=>console.log("completed")).catch(e =>console.error(e));

const {scrape,scrape2} = require("./scrape");
const mongoose = require("mongoose");
// mongoose
//   .connect("mongodb://localhost/GoogleReviewsAnalysis")
//   .then(() => console.log("Connected to DB"))
//   .catch((err) => console.log("Couldn't connect to DB :", err));

const  Review  = require("./models/review");

async function getAllReviews(){
    try{
        const results = await scrape(900);
        const reviews = [];
        for(let i = 0;i< results.fullNames.length;++i){
            reviews.push({name:results.fullNames[i].trim(),comment:results.reviewsComments[i],star:results.stars[i].trim()});
        }

        const results2 = await scrape2(100);
        for(let i = 0;i< results2.fullNames.length;++i){
            reviews.push({name:results2.fullNames[i].trim(),comment:results2.reviewsComments[i],star:results2.stars[i].trim()});
        }

       return reviews;
    }catch(e){
        console.error(e);
        return e;
    }
    
}

async function scrapeAll(){

    try{
        const reviews = await getAllReviews();
        const results = await Review.insertMany(reviews); //just run these two line for one time to scrape what you need
        return results; 
        //return reviews;

    }catch(e){        
        return e;
    }
}

//main().then(() => console.log("scraped and saved reviews to DB successfully")).catch((e)=> console.error(e));

module.exports = scrapeAll;
var casper = require('casper').create({
	verbose: true,
	logLevel: 'debug',
	pageSettings: {
		loadImages: false,
		loadPlugins: false,
		userAgent: 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.93 Safari/537.36'
	}
});

var url = 'https://www.goodreads.com/user/sign_in?returnurl=%2Fgiveaway';
var pages = [];
var giveaways = [];

var getPages = function(pageCounter) {
	casper.waitForSelector('.next_page', function(){
		var currentUrl = casper.evaluate(function() {
			return document.URL;
		})
		pages.push(currentUrl);

		//var giveawayCounter = 1;
		//getGiveaways(currentUrl, giveawayCounter);

		casper.click('.next_page');

		if(JSON.stringify(casper.getElementsInfo('.next_page')[0].attributes.href)) {
			pageCounter++;
			getPages(pageCounter);
		} else {
			return;
		}
	});
};

/*
var getGiveaways = function(currentUrl, giveawayCounter) {
	var mainPageSelector = 'li.listElement:nth-child(' + giveawayCounter + ') > div:nth-child(2) > div:nth-child(1) > a:nth-child(1)';
	
	try {
			casper.click(mainPageSelector);
			casper.waitForSelector('a[id^="addressSelect"]', function() {
				casper.click('a[id^="addressSelect"]');
				casper.waitForSelector('.gr-button', function() {
					casper.evaluate(function() {
						document.getElementById('terms').click();
						document.getElementById('want_to_read').click();
					});
					casper.click('.gr-button');
					casper.waitForSelector('div.box:nth-child(1)', function(){
						casper.capture('/home/sahil/Desktop/' + i + '.png');
						casper.open(currentUrl);
					})
				})
			});
		} catch(e) {
			console.log(e);
		}
	console.log(mainPageSelector);
}
*/

casper.start(url, function() {
	this.waitForSelector('input.gr-button', function() {
		this.evaluate(function() {
			document.getElementById('user_email').value = 'YOUR_EMAIL';
			document.getElementById('user_password').value = 'YOUR_PASSWORD';
			document.querySelector('input.gr-button').click();
		})
	});

	this.then(function() {
		var i = 0;
		getPages(i);
	});

	//Test only - remove during final run
	this.then(function() {
		for(var i=0;i<pages.length;i++) {
			console.log(i);
			console.log(pages[i]);
		}
	})
});

casper.run();
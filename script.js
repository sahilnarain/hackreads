'use strict'
var async = require('async');

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
	casper.wait(Math.random()*7000, function() {
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
	})
};

var getGiveaways = function(currentUrl, giveawayCounter) {

	var mainPageSelector = 'li.listElement:nth-child(' + giveawayCounter + ') > div:nth-child(2) > div:nth-child(1) > a:nth-child(1)';
	
	try {
			casper.click(mainPageSelector);
			casper.wait(Math.random()*7000, function() {
				casper.waitForSelector('a[id^="addressSelect"]', function() {
					casper.wait(Math.random()*7000, function() {
						casper.click('a[id^="addressSelect"]');
						casper.waitForSelector('.gr-button', function() {
							casper.evaluate(function() {
								document.getElementById('terms').click();
								document.getElementById('want_to_read').click();
							});
							casper.wait(Math.random()*7000, function() {
								casper.click('.gr-button');
								casper.capture('/home/sahil/Desktop/'+currentUrl+giveawayCounter+'.png');
							})
						})
					});
				});
			})
				
		} catch(e) {
			console.log(e);
		}
}

casper.start(url, function() {
	this.waitForSelector('input.gr-button', function() {
		this.evaluate(function() {
			document.getElementById('user_email').value = 'mile_ac@yahoo.com';
			document.getElementById('user_password').value = 'goodreads';
			document.querySelector('input.gr-button').click();
		})
	});

	this.then(function() {
		var i = 0;
		getPages(i);
	});

	this.then(function() {
		var i = 1;
		async.each(pages, function(page) {
			getGiveaways(page, i)
		})
	})
});

casper.run();
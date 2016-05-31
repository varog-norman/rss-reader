//-------------------------------------------------------------------------------------------------//
//--------------------------------------- Data storage (M) ----------------------------------------//
//-------------------------------------------------------------------------------------------------//


'use strict';

var JSONPCallbackIndex = 0;

var defaultChannels = [
	'http://rss.cnn.com/rss/edition.rss',
	'http://feeds.reuters.com/reuters/businessNews',
	'https://news.yahoo.com/rss/',
	'http://feeds.abcnews.com/abcnews/topstories',
	'http://feeds.foxnews.com/foxnews/latest',
	'http://www.usnews.com/rss/news'
];

var channels = [];

var colors = ['#1abc9c', '#f1c40f', '#2ecc71', '#e67e22', '#3498db', '#e74c3c', '#9b59b6', '#bdc3c7', '#34495e', '#95a5a6', '#1488C8', '#F7E041', '#E91222', '#30A443', '#C7B29B', '#29475F', '#F8DE73', '#D76817', '#666666', '#F45750', '#FE6EDA', '#5BADAF', '#64543E', '#2C2D31', '#E08283', '#D83E40'];

var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

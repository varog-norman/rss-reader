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

//-------------------------------------------------------------------------------------------------//
//--------------------------------------- Handlers (C) --------------------------------------------//
//-------------------------------------------------------------------------------------------------//


document.addEventListener('DOMContentLoaded', assignEvents);

function assignEvents() {
	document.getElementById('add_channel').addEventListener('click', addChannel);
	document.getElementById('stats_show').addEventListener('click', showStats);
	document.querySelector('.layer_wrap').addEventListener('click', closeStats);
}

//______ Function "tick" loads default channels asynchronously

(function tick(channelIndex) {

	if(channelIndex < defaultChannels.length) {
		getChannelFeed(defaultChannels[channelIndex], tick.bind(null, channelIndex + 1));
	}

})(0);

function getChannelFeed(url, callback) {
	var url = encodeURIComponent(url);
	var script = document.createElement('script');

	window[`callback${JSONPCallbackIndex}`] = saveData;

	//______ Using API rss2json.com

	script.src = `https://rss2json.com/api.json?callback=callback${JSONPCallbackIndex}&rss_url=${url}`;

	JSONPCallbackIndex++;

	document.head.appendChild(script);
	callback && callback();

	function saveData(data) {

		var channel = {
			title: data.feed.title,
			items: data.items
		}

		var newChannelIndex = channels.push(channel) - 1;

		script.parentNode.removeChild(script);
		script = null;
		window[`callback${JSONPCallbackIndex}`] = null;

		renderChannel(newChannelIndex);
	}
}

//______ Get safe text from html (to prevent harmful scripts)

function getSafeText(unsafeHtml) {
	var elem = document.createElement('div');
	elem.innerHTML = unsafeHtml;

	return elem.textContent;
}

function countChannelsAmount() {
	var counter = 0;
	
	channels.forEach((elem) => {

		if(elem) {
			counter++;
		}

	});

	return counter;
}

function countMessages(channelIndex) {
	return channels[channelIndex].items.length;
}

function countAuthorsAmount() {
	var authors = ['_test_'];

	channels.forEach((channel) => {

		if(channel) {
		
			channel.items.forEach((item) => {

				if(item.author) {
					var isRepeat = false;

					authors.forEach((entry, i) => {

						if(entry == item.author) {
							isRepeat = true;
						}


					});

					if(!isRepeat) {
						authors.push(item.author);
					}

				}

			});

		}

	});

	authors.shift();
	
	return authors.length;
}

//______ Function "countLetters" returns an array of objects that contain letters and percentages of their appearance

function countLetters(messageIndex, channelIndex) {
	var text = channels[channelIndex].items[messageIndex].description;
	text = getSafeText(text).toLowerCase();

	if(!text) {
		return 'Current message has no description';
	} 

	var chartData = [];
	var lettersAmount = text.match(/[a-zA-Z]/g).length;

	alphabet.forEach((letter) => {
		var currentLetterAmount = text.match(new RegExp(`${letter}`, `g`));
		
		if(currentLetterAmount) {
			var percent = currentLetterAmount.length / lettersAmount * 100;

			chartData.push({
				letter: letter,
				percent: percent.toFixed(2)
			});
		}

	});

	return chartData;
}

function prettyDate(str) {
	var date = new Date(str);
	var dayOfWeek = date.getDay();
	var day = date.getDate();
	var month = date.getMonth();
	var year = date.getFullYear();
	var hours = date.getHours();
	var minutes = date.getMinutes();

	day = `${Math.floor(day / 10)}${day % 10}`;
	hours = `${Math.floor(hours / 10)}${hours % 10}`;
	minutes = `${Math.floor(minutes / 10)}${minutes % 10}`;

	var newDate = `${days[dayOfWeek]}, ${day} ${months[month]} ${year} ${hours}:${minutes}`;

	return newDate;
}
//-------------------------------------------------------------------------------------------------//
//--------------------------------------- View (V) ------------------------------------------------//
//-------------------------------------------------------------------------------------------------//

function renderChannel(newChannelIndex) {
	var container = document.getElementById('channels');

	var wrapper = document.createElement('li');
	wrapper.className = 'wrapper';
	wrapper.onclick = setChannel.bind(null, wrapper, newChannelIndex);

	var channel = document.createElement('div');
	channel.textContent = getSafeText(channels[newChannelIndex].title);
	wrapper.appendChild(channel);

	var remove = document.createElement('div');
	remove.textContent = 'X';
	remove.className = 'remove';
	remove.onclick = function(e) {
		e.stopPropagation();
		removeChannel(wrapper, newChannelIndex);
	}
	wrapper.appendChild(remove);

	container.appendChild(wrapper);

	writeStatsChannels(countChannelsAmount());
	writeStatsAuthors(countAuthorsAmount());
}

function setChannel(channel, channelIndex) {
	var elem = document.querySelector('.current_channel');

	if(elem) {
		elem.classList.remove('current_channel');
		channel.classList.add('current_channel');
	} else {
		channel.classList.add('current_channel');
	}

	renderMessages(channelIndex);

	writeStatsMessages(countMessages(channelIndex));
}

function renderMessages(channelIndex) {
	var container = document.getElementById('messages');
	container.innerHTML = '';

	channels[channelIndex].items.forEach((elem, i) => {

		var wrapper = document.createElement('li');
		wrapper.className = 'wrapper';
		wrapper.onclick = setMessage.bind(null, wrapper, i, channelIndex);

		var message = document.createElement('div');
		message.textContent = getSafeText(elem.title);
		wrapper.appendChild(message);

		container.appendChild(wrapper);
	});
}

function setMessage(message, messageIndex, channelIndex) {
	var elem = document.querySelector('.current_message');

	if(elem) {
		elem.classList.remove('current_message');
		message.classList.add('current_message');
	} else {
		message.classList.add('current_message');
	}

	renderCurrentMessage(messageIndex, channelIndex);

	drawChart(countLetters(messageIndex, channelIndex));
}

function renderCurrentMessage(messageIndex, channelIndex) {
	var container = document.getElementById('current_message');
	container.innerHTML = '';

	var pubDateText = channels[channelIndex].items[messageIndex].pubDate;
	var titleText = channels[channelIndex].items[messageIndex].title;
	var imgText = channels[channelIndex].items[messageIndex].thumbnail;
	var descriptionText = channels[channelIndex].items[messageIndex].description;
	var linkText = channels[channelIndex].items[messageIndex].link;

	var pubDate = document.createElement('div');
	pubDate.className = 'pub_date';
	var date = prettyDate(pubDateText);
	pubDate.textContent = date;
	container.appendChild(pubDate);

	var title = document.createElement('div');
	title.className = 'text_title';
	title.textContent = getSafeText(titleText);
	container.appendChild(title);

	if(imgText) {
		var img = document.createElement('img');
		img.className = 'image';
		img.src = imgText;
		container.appendChild(img);
	}

	var description = document.createElement('div');
	description.className = 'text';
	description.textContent = getSafeText(descriptionText);
	container.appendChild(description);

	var link = document.createElement('a');
	link.href = linkText;
	link.target = '_blank';
	link.textContent = 'Learn more';
	container.appendChild(link);
}

function addChannel() {
	var url = document.getElementById('new_channel').value;

	if(url) {
		getChannelFeed(url);
	} else {
		return alert('URL is wrong')
	}
}

function removeChannel(channel, channelIndex) {
	channel.parentNode.removeChild(channel);
	channels[channelIndex] = null;

	writeStatsChannels(countChannelsAmount());
	writeStatsAuthors(countAuthorsAmount());
}

function showStats() {
	var layer = document.querySelector('.layer_wrap');
	var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
	var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;

	layer.style.display = 'block';
	layer.style.top = `${scrollTop}px`;
	layer.style.left = `${scrollLeft}px`;

	document.body.style.overflow = 'hidden';
}

function closeStats(e) {
	var layer = document.querySelector('.layer_wrap');
	var closeButton = document.getElementById('stats_close');

	if((e.target == layer) || (e.target == closeButton)) {
		layer.style.display = 'none';
		document.body.style.overflow = 'auto'
	}
}

function writeStatsChannels(amount) {
	document.getElementById('stats_channels').textContent = `${amount} channels`;
}

function writeStatsMessages(amount) {
	document.getElementById('stats_messages').textContent = `${amount} messages in current channel`;
}

function writeStatsAuthors(amount) {
	document.getElementById('stats_authors').textContent = `${amount} authors`;
}

//______ Draw chart by using Chart.js (chartjs.org)

function drawChart(chartData) {
	var container = document.getElementById('stats_chart');
	container.innerHTML = '';

	if(!(chartData instanceof Array)) {
		container.textContent = chartData;
	} else {
		var title = document.createElement('div');
		title.textContent = 'Frequency of appearing letters in current message:';
		container.appendChild(title);

		var canvas = document.createElement('canvas');
		canvas.id = 'myChart';
		container.appendChild(canvas);

		var ctx = document.getElementById("myChart");

		var options = {};
		var data = {
			labels: [],
			datasets: [
				{
					data: [],
					backgroundColor: [],
					hoverBackgroundColor: []
				}
			]
		};

		chartData.forEach((elem, i) => {

			data.labels.push(elem.letter);
			data.datasets[0].data.push(elem.percent);
			data.datasets[0].backgroundColor.push(colors[i]);
			data.datasets[0].hoverBackgroundColor.push(colors[i]);

		});

		var myPieChart = new Chart(ctx,{
		    type: 'pie',
		    data: data,
		    options: options
		});
	}
}
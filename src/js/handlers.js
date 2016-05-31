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
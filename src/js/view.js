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
var dataURI = "/data";

const weatherForm = document.querySelector(".search-section form");
const search = document.querySelector(".search-section input");
const msg = document.querySelector(".search-section .msg");
const list = document.querySelector(".cards-section .cities");

var citiesIdArray = [];

// on button click
weatherForm.addEventListener("submit", (event) => {
	event.preventDefault();
	msg.textContent = "";
	let inputVal = search.value;

	// empty input
	if (inputVal === "") {
		msg.textContent = "Insert name of the city";
		weatherForm.reset();
		search.focus();
	} else {
		const locationApi = dataURI + "?city=" + search.value;

		// fetching weather data
		fetch(locationApi).then((response) => {
			response
				.json()
				.then((data) => {
					if (	// check for duplicate
						citiesIdArray.length !== 0 &&
						citiesIdArray.includes(data.weather.cityId)
					) {
						msg.textContent =
							"You already have data for this city.";
					} else if (citiesIdArray.length > 4) { // limiting the search of cities
						msg.textContent = "You can search only 5 cities.";
					} else {
						citiesIdArray.push(data.weather.cityId);

						// Handling icons
						var iconLink = ``;
						var weatherDescription = data.weather.description;

						switch (weatherDescription) {
							case "rain":
								iconLink = `https://img.icons8.com/offices/80/000000/rain.png`;
								break;
							case "moderate rain":
								iconLink = `https://img.icons8.com/offices/80/000000/rain.png`;
								break;
							case "shower rain":
								iconLink = `https://img.icons8.com/offices/80/000000/torrential-rain.png`;
								break;
							case "thunderstorm":
								iconLink = `https://img.icons8.com/offices/80/000000/storm.png`;
								break;
							case "heavy intensity rain":
								iconLink = `https://img.icons8.com/offices/80/000000/torrential-rain.png`;
								break;
							case "clear sky":
								iconLink = `https://img.icons8.com/offices/80/000000/sun.png`;
								break;
							case "mist":
								iconLink = `https://img.icons8.com/offices/80/000000/fog-day.png`;
								break;
							case "haze":
								iconLink = `https://img.icons8.com/offices/80/000000/fog-day.png`;
								break;
							case "fog":
								iconLink = `https://img.icons8.com/offices/80/000000/fog-day.png`;
								break;
							case "snow":
								iconLink = `https://img.icons8.com/offices/80/000000/snow.png`;
								break;
							default:
								iconLink = `https://img.icons8.com/offices/80/000000/clouds.png`;
						}
						//END ICON
					
						// Adding cards HTML + data
						const li = document.createElement("li");
						li.classList.add("city");

						let markup = `<h2 class="city-name" data-name="${
							data.weather.cityName
						},${data.weather.country}">
							<span>${data.weather.cityName}</span>
							<sup>${data.weather.country}</sup>
							</h2>
							<div class="city-temp">${Math.round(
								data.weather.temperature - 273,15
							)}<sup>°C</sup></div>
							<figure>
							<img class="city-icon" src="${iconLink}" alt="${
									data.weather.description
								}">
							<figcaption> ${data.weather.description} </figcaption>
							<figcaption id=shopTextId"> Shops: </figcaption>
							<br>		
							</figure>`;

						markup += "<ul>";
						data.businesses.forEach((v) => {
							markup +=
								"<li id=shopDataRow>"+ "Shop: " + v.name + "<br>" + " Tel: " + v.phone + "<br>"  + " Type: " + v.title + "</li>" +  
								"<hr id = shopDataSeparator>"
						});

						markup = markup + "</ul>";

						li.innerHTML = markup;

						list.appendChild(li);
					}
				})
				.catch((error) => {
					console.log(error);
					msg.textContent = "Please, insert a valid city.";
				});

			msg.textContent = "";
			weatherForm.reset();
			search.focus();
		}).catch(function() {
			console.log(error);
			msg.textContent = error;
		});;
	}
});

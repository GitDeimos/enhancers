const express = require("express");
const axios = require("axios");
const hbs = require("hbs");
const path = require("path");
const app = express();
const yelp = require("yelp-fusion");
const weatherAndShopsConstant = require("./config");

const client = yelp.client(weatherAndShopsConstant.yelp.SECRET_KEY);

const PORT = process.env.PORT || 5000;

// contains the path of public
const publicStaticDirPath = path.join(__dirname, "./public");
// contains the path of views
const viewsPath = path.join(__dirname, "./views");
// contains the path of partials
const partialsPath = path.join(__dirname, "./partials");

// Static dir path
app.use(express.static(publicStaticDirPath));

// Views
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// yelp function
async function getYelpData(cityN) {
	return client
		.search({
			location: cityN
		})
		.then((res) => {
			const businesses = Array();
			res.jsonBody.businesses.map((v) => {
				businesses.push({
					name: v.name,
					phone: v.phone,
					title: v.categories[0].title
				});
			});
			return businesses;
		})
		.catch((e) => {
			console.log(e);
		});
}

// Open weather map function
async function getWeatherData(cityN) {
	const url =
		weatherAndShopsConstant.openWeather.BASE_URL +
		encodeURIComponent(cityN) +
		"&appid=" +
		weatherAndShopsConstant.openWeather.SECRET_KEY;

	return axios.get(url)
	.then((v) => {
        //console.log(v)
		return {
			temperature: v.data.main.temp,
			description: v.data.weather[0].description,
			cityId: v.data.id,
			cityName: v.data.name,
			country: v.data.sys.country
		};
	})
	.catch(function (error) {
		if (error.response) {
		  // Request made and server responded
		  console.log(error.response.data);
		  console.log(error.response.status);
		  console.log(error.response.headers);
		} else if (error.request) {
		  // The request was made but no response was received
		  console.log(error.request);
		} else {
		  // Something happened in setting up the request that triggered an Error
		  console.log('Error', error.message);
		}
	});
}

// Middleware routes
app.get("/", (req, res) => {
	res.render("index", {
		title: "Weather & Shops"
	});
});

// needed data
app.get("/data", async (req, res) => {
	const weatherData = await getWeatherData(req.query.city);
	const yelpData = await getYelpData(req.query.city);

	res.send({ weather: weatherData, businesses: yelpData });
});

// yelp
app.get("/shops", async (req, res) => {
	res.send(await getYelpData(req.query.city));
});

// open weather map
app.get("/weather", async (req, res) => {
	res.send(await getWeatherData(req.query.city));
});

// if 404 error
app.get("*", (req, res) => {
	res.render("404", {
		title: "404 - something went wrong."
	});
});

app.listen(PORT, () => console.log(`Server running at port ${PORT}`));

import {
  getRestaurants,
  getDailyMenu,
  getWeeklyMenu,
} from './api.js';

import {
  displayRestaurants,
} from './restaurants.js';


const restaurantList =
  document.querySelector('#restaurant-list');

const restaurantInfo =
  document.querySelector('#restaurant-info');

const menuContent =
  document.querySelector('#menu-content');

const dailyButton =
  document.querySelector('#daily-button');

const weeklyButton =
  document.querySelector('#weekly-button');

const searchInput =
  document.querySelector('#search-input');

const cityFilter =
  document.querySelector('#city-filter');

const companyFilter =
  document.querySelector('#company-filter');

const favoritesOnly =
  document.querySelector('#favorites-only');

const mapContainer =
  document.querySelector('#map-container');

const nearestButton =
  document.querySelector('#nearest-button');

const locationMessage =
  document.querySelector('#location-message');


let restaurants = [];

let selectedRestaurant = null;

let nearestRestaurantId = null;


async function loadRestaurants() {

  try {

    restaurants =
      await getRestaurants();

    showRestaurants(restaurants);

    populateCities();

    populateCompanies();

  } catch (error) {

    console.error(error);

    restaurantList.innerHTML =
      '<p>Could not load restaurants.</p>';
  }
}


function showRestaurants(list) {

  displayRestaurants(
    list,
    restaurantList,
    selectRestaurant,
    filterRestaurants,
    nearestRestaurantId
  );
}


function selectRestaurant(restaurant) {

  selectedRestaurant = restaurant;

  dailyButton.classList.add('active');

  weeklyButton.classList.remove('active');

  restaurantInfo.innerHTML = '';


  const name =
    document.createElement('h3');

  name.textContent =
    restaurant.name;


  const address =
    document.createElement('p');

  address.textContent =
    `${restaurant.address}, ${restaurant.city}`;


  restaurantInfo.append(
    name,
    address
  );


  loadDailyMenu();

  displayMap(restaurant);
}


function displayMap(restaurant) {

  mapContainer.innerHTML = '';


  if (
    !restaurant.location ||
    !restaurant.location.coordinates
  ) {

    mapContainer.innerHTML =
      '<p>Location is not available for this restaurant.</p>';

    return;
  }


  const coordinates =
    restaurant.location.coordinates;

  const longitude =
    coordinates[0];

  const latitude =
    coordinates[1];


  if (!latitude || !longitude) {

    mapContainer.innerHTML =
      '<p>Location is not available for this restaurant.</p>';

    return;
  }


  const map =
    document.createElement('iframe');

  map.classList.add(
    'restaurant-map'
  );


  const left =
    longitude - 0.01;

  const right =
    longitude + 0.01;

  const bottom =
    latitude - 0.005;

  const top =
    latitude + 0.005;


  map.src =
    `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${latitude}%2C${longitude}`;


  map.title =
    `Map of ${restaurant.name}`;


  mapContainer.appendChild(map);
}


async function loadDailyMenu() {

  if (!selectedRestaurant) {
    return;
  }

  menuContent.innerHTML =
    '<p>Loading daily menu...</p>';


  try {

    const menu =
      await getDailyMenu(
        selectedRestaurant._id,
        'en'
      );

    displayDailyMenu(menu);

  } catch (error) {

    console.error(error);

    menuContent.innerHTML =
      '<p>Could not load daily menu.</p>';
  }
}


function displayDailyMenu(menu) {

  menuContent.innerHTML = '';


  if (
    !menu.courses ||
    menu.courses.length === 0
  ) {

    menuContent.innerHTML =
      '<p>No menu available today.</p>';

    return;
  }


  menu.courses.forEach((course) => {

    const item =
      document.createElement('div');


    const name =
      document.createElement('h3');

    name.textContent =
      course.name;


    const details =
      document.createElement('p');


    const price =
      course.price || '';

    const diets =
      course.diets || '';


    details.textContent =
      `${price} ${diets}`.trim();


    item.append(
      name,
      details
    );

    menuContent.appendChild(item);
  });
}


async function loadWeeklyMenu() {

  if (!selectedRestaurant) {
    return;
  }

  menuContent.innerHTML =
    '<p>Loading weekly menu...</p>';


  try {

    const menu =
      await getWeeklyMenu(
        selectedRestaurant._id,
        'en'
      );

    displayWeeklyMenu(menu);

  } catch (error) {

    console.error(error);

    menuContent.innerHTML =
      '<p>Could not load weekly menu.</p>';
  }
}


function displayWeeklyMenu(menu) {

  menuContent.innerHTML = '';


  if (
    !menu.days ||
    menu.days.length === 0
  ) {

    menuContent.innerHTML =
      '<p>No weekly menu available.</p>';

    return;
  }


  menu.days.forEach((day) => {

    const section =
      document.createElement('section');


    const date =
      document.createElement('h3');

    date.textContent =
      day.date;


    section.appendChild(date);


    if (
      !day.courses ||
      day.courses.length === 0
    ) {

      const noCourses =
        document.createElement('p');

      noCourses.textContent =
        'No menu available for this day.';

      section.appendChild(noCourses);

    } else {

      day.courses.forEach((course) => {

        const item =
          document.createElement('div');


        const name =
          document.createElement('h4');

        name.textContent =
          course.name;


        const details =
          document.createElement('p');


        const price =
          course.price || '';

        const diets =
          course.diets || '';


        details.textContent =
          `${price} ${diets}`.trim();


        item.append(
          name,
          details
        );

        section.appendChild(item);
      });
    }


    menuContent.appendChild(section);
  });
}


function populateCities() {

  cityFilter.innerHTML =
    '<option value="">All cities</option>';


  const cities = [
    ...new Set(
      restaurants.map(
        (restaurant) =>
          restaurant.city
      )
    ),
  ]
    .filter(Boolean)
    .sort();


  cities.forEach((city) => {

    const option =
      document.createElement('option');

    option.value = city;

    option.textContent = city;

    cityFilter.appendChild(option);
  });
}


function populateCompanies() {

  companyFilter.innerHTML =
    '<option value="">All providers</option>';


  const companies = [
    ...new Set(
      restaurants.map(
        (restaurant) =>
          restaurant.company
      )
    ),
  ]
    .filter(Boolean)
    .sort();


  companies.forEach((company) => {

    const option =
      document.createElement('option');

    option.value = company;

    option.textContent = company;

    companyFilter.appendChild(option);
  });
}


function getFavorites() {

  const favorites =
    localStorage.getItem('favorites');

  if (favorites) {
    return JSON.parse(favorites);
  }

  return [];
}


function filterRestaurants() {

  const search =
    searchInput.value
      .toLowerCase()
      .trim();


  const selectedCity =
    cityFilter.value;


  const selectedCompany =
    companyFilter.value;


  const favoriteIds =
    getFavorites();


  const filteredRestaurants =
    restaurants.filter((restaurant) => {

      const restaurantName =
        restaurant.name.toLowerCase();


      const matchesSearch =
        restaurantName.includes(search);


      const matchesCity =
        selectedCity === '' ||
        restaurant.city === selectedCity;


      const matchesCompany =
        selectedCompany === '' ||
        restaurant.company === selectedCompany;


      const matchesFavorite =
        !favoritesOnly.checked ||
        favoriteIds.includes(
          restaurant._id
        );


      return (
        matchesSearch &&
        matchesCity &&
        matchesCompany &&
        matchesFavorite
      );
    });


  showRestaurants(
    filteredRestaurants
  );


  if (
    filteredRestaurants.length === 0
  ) {

    restaurantList.innerHTML =
      '<p>No restaurants found.</p>';
  }
}


function findNearestRestaurant() {

  if (!navigator.geolocation) {

    locationMessage.textContent =
      'Location is not supported by your browser.';

    return;
  }


  locationMessage.textContent =
    'Finding your location...';


  navigator.geolocation.getCurrentPosition(
    locationFound,
    locationError
  );
}


function locationFound(position) {

  const userLatitude =
    position.coords.latitude;

  const userLongitude =
    position.coords.longitude;


  let nearestRestaurant = null;

  let shortestDistance =
    Infinity;


  restaurants.forEach((restaurant) => {

    if (
      !restaurant.location ||
      !restaurant.location.coordinates
    ) {
      return;
    }


    const longitude =
      restaurant.location.coordinates[0];

    const latitude =
      restaurant.location.coordinates[1];


    if (!latitude || !longitude) {
      return;
    }


    const distance =
      calculateDistance(
        userLatitude,
        userLongitude,
        latitude,
        longitude
      );


    if (distance < shortestDistance) {

      shortestDistance =
        distance;

      nearestRestaurant =
        restaurant;
    }
  });


  if (!nearestRestaurant) {

    locationMessage.textContent =
      'Could not find a nearby restaurant.';

    return;
  }


  nearestRestaurantId =
    nearestRestaurant._id;


  locationMessage.textContent =
    `Nearest restaurant: ${nearestRestaurant.name} (${shortestDistance.toFixed(1)} km away)`;


  filterRestaurants();

  selectRestaurant(
    nearestRestaurant
  );
}


function locationError() {

  locationMessage.textContent =
    'Location permission was not allowed.';
}


function calculateDistance(
  lat1,
  lon1,
  lat2,
  lon2
) {

  const earthRadius =
    6371;


  const latitudeDifference =
    toRadians(lat2 - lat1);

  const longitudeDifference =
    toRadians(lon2 - lon1);


  const a =
    Math.sin(latitudeDifference / 2) *
    Math.sin(latitudeDifference / 2) +

    Math.cos(toRadians(lat1)) *
    Math.cos(toRadians(lat2)) *

    Math.sin(longitudeDifference / 2) *
    Math.sin(longitudeDifference / 2);


  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );


  return earthRadius * c;
}


function toRadians(number) {

  return number *
    (Math.PI / 180);
}


dailyButton.addEventListener(
  'click',
  () => {

    dailyButton.classList.add(
      'active'
    );

    weeklyButton.classList.remove(
      'active'
    );

    loadDailyMenu();
  }
);


weeklyButton.addEventListener(
  'click',
  () => {

    weeklyButton.classList.add(
      'active'
    );

    dailyButton.classList.remove(
      'active'
    );

    loadWeeklyMenu();
  }
);


searchInput.addEventListener(
  'input',
  filterRestaurants
);


cityFilter.addEventListener(
  'change',
  filterRestaurants
);


companyFilter.addEventListener(
  'change',
  filterRestaurants
);


favoritesOnly.addEventListener(
  'change',
  filterRestaurants
);


nearestButton.addEventListener(
  'click',
  findNearestRestaurant
);


loadRestaurants();
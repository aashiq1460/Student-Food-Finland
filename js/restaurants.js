export function displayRestaurants(
  restaurants,
  container,
  onSelect,
  onFavoriteChange,
  nearestRestaurantId = null
) {
  container.innerHTML = '';

  if (!Array.isArray(restaurants)) {
    container.innerHTML =
      '<p>No restaurant data available.</p>';

    return;
  }

  restaurants.forEach((restaurant) => {

    const restaurantElement =
      document.createElement('div');

    restaurantElement.classList.add('restaurant');


    if (
      restaurant._id === nearestRestaurantId
    ) {
      restaurantElement.classList.add('nearest');
    }


    const name =
      document.createElement('h3');

    name.textContent = restaurant.name;


    const city =
      document.createElement('p');

    city.textContent = restaurant.city;


    const address =
      document.createElement('p');

    address.classList.add(
      'restaurant-address'
    );

    address.textContent =
      restaurant.address ||
      'No address available';


    const company =
      document.createElement('p');

    company.classList.add(
      'restaurant-company'
    );

    company.textContent =
      restaurant.company
        ? `Provider: ${restaurant.company}`
        : 'Provider not available';


    restaurantElement.append(
      name,
      city,
      address,
      company
    );


    if (
      restaurant._id === nearestRestaurantId
    ) {

      const nearestText =
        document.createElement('p');

      nearestText.classList.add(
        'nearest-text'
      );

      nearestText.textContent =
        '★ Nearest restaurant';

      restaurantElement.appendChild(
        nearestText
      );
    }


    const viewButton =
      document.createElement('button');

    viewButton.textContent =
      'View Menu';

    viewButton.addEventListener(
      'click',
      () => {
        onSelect(restaurant);
      }
    );


    const favoriteButton =
      document.createElement('button');

    favoriteButton.classList.add(
      'favorite-button'
    );


    const favorites =
      getFavorites();


    if (
      favorites.includes(
        restaurant._id
      )
    ) {
      favoriteButton.textContent =
        '★ Favorite';
    } else {
      favoriteButton.textContent =
        '☆ Favorite';
    }


    favoriteButton.addEventListener(
      'click',
      () => {

        toggleFavorite(
          restaurant._id
        );

        if (onFavoriteChange) {
          onFavoriteChange();
        }
      }
    );


    restaurantElement.append(
      viewButton,
      favoriteButton
    );


    container.appendChild(
      restaurantElement
    );
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


function toggleFavorite(id) {

  let favorites = getFavorites();

  if (favorites.includes(id)) {

    favorites =
      favorites.filter(
        (favoriteId) => {
          return favoriteId !== id;
        }
      );

  } else {

    favorites.push(id);

  }

  localStorage.setItem(
    'favorites',
    JSON.stringify(favorites)
  );
}
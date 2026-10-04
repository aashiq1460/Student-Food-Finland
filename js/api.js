const API_URL =
  'https://media2.edu.metropolia.fi/restaurant/api/v1';

export async function getRestaurants() {
  const response = await fetch(`${API_URL}/restaurants`);

  if (!response.ok) {
    throw new Error('Could not fetch restaurants');
  }

  const data = await response.json();

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data.restaurants)) {
    return data.restaurants;
  }

  throw new Error('Restaurant data is in an unexpected format');
}

export async function getDailyMenu(id, language = 'en') {
  const response = await fetch(
    `${API_URL}/restaurants/daily/${id}/${language}`
  );

  if (!response.ok) {
    throw new Error('Could not fetch daily menu');
  }

  return response.json();
}

export async function getWeeklyMenu(id, language = 'en') {
  const response = await fetch(
    `${API_URL}/restaurants/weekly/${id}/${language}`
  );

  if (!response.ok) {
    throw new Error('Could not fetch weekly menu');
  }

  return response.json();
}
import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  id: string;
  city: string;
  latitude: number;
  longitude: number;
}
// TODO: Define a class for the Weather object
class Weather {
  temperature: number;
  humidity: number;
  description: string;
  windSpeed: number;
  pressure: number;
  icon: string;

  constructor(
    temperature: number,
    humidity: number,
    description: string,
    windSpeed: number,
    pressure: number,
    icon: string
  ) {
    this.temperature = temperature;
    this.humidity = humidity;
    this.description = description;
    this.windSpeed = windSpeed;
    this.pressure = pressure;
    this.icon = icon;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL?: string;

  private apiKey?: string;

  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';

    this.apiKey = process.env.API_KEY || '';
  }
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<Coordinates> {
    const url = this.buildGeocodeQuery(query);
    const response = await fetch(url);
    const data = await response.json();
  
    // Extracting the first result
    const location = data.results[0];
    return {
      id: location.id,
      city: location.formatted,
      latitude: location.geometry.lat,
      longitude: location.geometry.lng,
    };
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    return {
      id: locationData.id,
      city: locationData.city,
      latitude: parseFloat(locationData.latitude.toString()), 
      longitude: parseFloat(locationData.longitude.toString())
    };
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(query: string): string {
    return `${this.baseURL}/geocode?q=${query}&key=${this.apiKey}`;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.apiKey}`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(query: string): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const url = this.buildWeatherQuery(coordinates);
    const response = await fetch(url);
    return await response.json();
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    return new Weather (
      response.main.temp,
      response.main.humidity,
      response.weather[0].description,
      response.wind.speed,
      response.main.pressure,
      response.weather[0].icon
    );
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const forecastArray: Weather[] = [currentWeather];
    weatherData.forEach((data) => {
      forecastArray.push(new Weather(
        data.main.temp,
        data.main.humidity,
        data.weather[0].description,
        data.wind.speed,
        data.main.pressure,
        data.weather[0].icon
      ));
    });
  
    return forecastArray;  // Return the full array of Weather objects
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string): Promise<Weather[]> {
    const coordinates = await this.fetchAndDestructureLocationData(city);
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecastData = weatherData.list || []; 
    return this.buildForecastArray(currentWeather, forecastData);
  }
}

export default new WeatherService();

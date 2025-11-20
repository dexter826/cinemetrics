import { TMDB_API_KEY, TMDB_BASE_URL } from '../constants';
import { TMDBMovieResult, TMDBMovieDetail } from '../types';

export const searchMovies = async (query: string): Promise<TMDBMovieResult[]> => {
  if (!query || !TMDB_API_KEY) return [];
  
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`
    );
    
    if (!response.ok) throw new Error('TMDB API Error');
    
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Failed to search movies:", error);
    return [];
  }
};

export const getMovieDetails = async (movieId: number): Promise<TMDBMovieDetail | null> => {
  if (!TMDB_API_KEY) return null;

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`
    );

    if (!response.ok) throw new Error('TMDB API Error');

    return await response.json();
  } catch (error) {
    console.error("Failed to get movie details:", error);
    return null;
  }
};

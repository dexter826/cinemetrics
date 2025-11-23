import { Movie } from '../types';

export const getDisplayTitle = (movie: Movie): string => {
  if (movie.country && (movie.country.includes('Vietnam') || movie.country.includes('VN')) && movie.title_vi) {
    return movie.title_vi;
  }
  return movie.title;
};
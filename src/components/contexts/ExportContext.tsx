import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Movie } from '../../types';

interface ExportContextType {
  isExportModalOpen: boolean;
  setIsExportModalOpen: (open: boolean) => void;
  movies: Movie[];
  setMovies: (movies: Movie[]) => void;
}

const ExportContext = createContext<ExportContextType | undefined>(undefined);

export const useExport = () => {
  const context = useContext(ExportContext);
  if (!context) {
    throw new Error('useExport must be used within an ExportProvider');
  }
  return context;
};

interface ExportProviderProps {
  children: ReactNode;
}

export const ExportProvider: React.FC<ExportProviderProps> = ({ children }) => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);

  return (
    <ExportContext.Provider value={{
      isExportModalOpen,
      setIsExportModalOpen,
      movies,
      setMovies
    }}>
      {children}
    </ExportContext.Provider>
  );
};
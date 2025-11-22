import React, { useEffect, useState } from 'react';
import { X, FolderPlus, Film } from 'lucide-react';
import { Movie, Album } from '../types';
import { subscribeToAlbums } from '../services/albumService';
import { useAuth } from './AuthProvider';
import { useToast } from './Toast';
import { updateAlbum } from '../services/albumService';
import Loading from './Loading';

interface AlbumSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: Movie | null;
}

const AlbumSelectorModal: React.FC<AlbumSelectorModalProps> = ({ isOpen, onClose, movie }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToAlbum, setAddingToAlbum] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToAlbums(user.uid, data => {
      setAlbums(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleAddToAlbum = async (album: Album) => {
    if (!album.docId || !movie?.docId) return;
    if (!user) return;

    // Check if movie is already in this album
    if (album.movieDocIds.includes(movie.docId)) {
      showToast('Phim đã có trong album này', 'info');
      return;
    }

    // Check if movie is watched (can only add watched movies to albums)
    if ((movie.status || 'history') !== 'history') {
      showToast('Chỉ có thể thêm phim đã xem vào album', 'error');
      return;
    }

    try {
      setAddingToAlbum(album.docId);
      const newIds = Array.from(new Set([...(album.movieDocIds || []), movie.docId]));
      await updateAlbum(album.docId, { movieDocIds: newIds });
      showToast(`Đã thêm "${movie.title}" vào album "${album.name}"`, 'success');
      onClose();
    } catch (error) {
      showToast('Thêm phim vào album thất bại', 'error');
    } finally {
      setAddingToAlbum(null);
    }
  };

  if (!isOpen || !movie) return null;

  const availableAlbums = albums.filter(album => 
    album.movieDocIds && !album.movieDocIds.includes(movie.docId || '')
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden">
              <img 
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : '/logo_text.png'}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-text-main truncate">{movie.title}</h2>
              <p className="text-sm text-text-muted">Chọn album để thêm phim này</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loading size={32} />
            </div>
          ) : availableAlbums.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <FolderPlus className="text-text-muted" size={32} />
              </div>
              <h3 className="text-lg font-medium text-text-main mb-2">Không có album phù hợp</h3>
              <p className="text-sm text-text-muted max-w-sm mx-auto">
                {albums.length === 0 
                  ? 'Bạn chưa tạo album nào. Hãy tạo album trước để thêm phim vào.'
                  : 'Phim này đã có trong tất cả album của bạn.'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {availableAlbums.map(album => (
                <button
                  key={album.docId}
                  onClick={() => handleAddToAlbum(album)}
                  disabled={addingToAlbum === album.docId}
                  className="w-full p-4 rounded-xl border border-black/10 dark:border-white/10 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-linear-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <Film size={20} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-text-main group-hover:text-primary transition-colors">
                        {album.name}
                      </h3>
                      <p className="text-sm text-text-muted">
                        {album.movieDocIds.length} phim hiện tại
                      </p>
                    </div>
                    <div className="text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      {addingToAlbum === album.docId ? 'Đang thêm...' : 'Thêm vào'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlbumSelectorModal;
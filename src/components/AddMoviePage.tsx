import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Calendar, Star, Save, Loader2, Link as LinkIcon } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { addMovie, updateMovie } from '../services/movieService';
import { getMovieDetails } from '../services/tmdbService';
import { useToast } from './Toast';
import { TMDB_IMAGE_BASE_URL } from '../constants';
import Navbar from './Navbar';

const AddMoviePage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { tmdbId } = useParams();
  const location = useLocation();
  
  // If coming from search, we might have the basic movie object in state
  const initialMovie = location.state?.movie;
  const mediaType = location.state?.mediaType || 'movie';
  const movieToEdit = location.state?.movieToEdit;

  const [formData, setFormData] = useState({
    title: '',
    runtime: '',
    poster: '',
    date: new Date().toISOString().split('T')[0],
    rating: 0,
    review: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [tmdbDetails, setTmdbDetails] = useState<any>(null);

  useEffect(() => {
    if (movieToEdit) {
      // Edit Mode
      const d = movieToEdit.watched_at instanceof Object && 'toDate' in movieToEdit.watched_at
        ? movieToEdit.watched_at.toDate()
        : new Date(movieToEdit.watched_at);

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      setFormData({
        title: movieToEdit.title,
        runtime: movieToEdit.runtime.toString(),
        poster: movieToEdit.poster_path,
        date: dateStr,
        rating: movieToEdit.rating || 0,
        review: movieToEdit.review || ''
      });
    } else if (tmdbId) {
      // Fetch details logic...
      const fetchDetails = async () => {
        setIsLoadingDetails(true);
        try {
          const details = await getMovieDetails(Number(tmdbId), mediaType);
          if (details) {
            setTmdbDetails(details);
            const title = details.title || details.name || '';
            const runtime = details.runtime || (details.episode_run_time && details.episode_run_time[0]) || 0;
            
            setFormData(prev => ({
              ...prev,
              title: title,
              runtime: runtime.toString(),
              poster: details.poster_path || '',
            }));
          }
        } catch (error) {
          console.error("Failed to fetch details", error);
          showToast("Không thể tải thông tin phim", "error");
        } finally {
          setIsLoadingDetails(false);
        }
      };
      fetchDetails();
    }
  }, [tmdbId, mediaType, movieToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);

    try {
      const [y, m, d] = formData.date.split('-').map(Number);
      const watchedDate = new Date(y, m - 1, d, 12, 0, 0);

      if (movieToEdit && movieToEdit.docId) {
        // Update Existing
        await updateMovie(movieToEdit.docId, {
          title: formData.title,
          runtime: parseInt(formData.runtime) || 0,
          poster_path: formData.poster,
          watched_at: watchedDate,
          rating: formData.rating,
          review: formData.review,
        });
        showToast("Cập nhật phim thành công!", 'success');
      } else if (tmdbId && tmdbDetails) {
        // Add from TMDB
        await addMovie({
          uid: user.uid,
          id: tmdbDetails.id,
          title: formData.title,
          poster_path: formData.poster,
          runtime: parseInt(formData.runtime) || 0,
          source: 'tmdb',
          media_type: mediaType,
          watched_at: watchedDate,
          rating: formData.rating,
          review: formData.review
        });
        showToast("Thêm phim thành công!", 'success');
      } else {
        // Manual Entry
        await addMovie({
          uid: user.uid,
          id: Date.now(),
          title: formData.title,
          poster_path: formData.poster,
          runtime: parseInt(formData.runtime) || 0,
          source: 'manual',
          media_type: 'movie',
          watched_at: watchedDate,
          rating: formData.rating,
          review: formData.review
        });
        showToast("Thêm phim thành công!", 'success');
      }

      navigate('/');
    } catch (error) {
      console.error(error);
      showToast("Lưu phim thất bại.", 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingDetails) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text-main pb-20">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-text-muted hover:text-text-main mb-6 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Quay lại
        </button>

        <h1 className="text-2xl font-bold mb-8">
          {movieToEdit ? 'Chỉnh sửa phim' : (tmdbId ? 'Chi tiết phim' : 'Thêm phim thủ công')}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Movie Info Section */}
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-full sm:w-1/3">
              <div className="aspect-[2/3] bg-black/5 dark:bg-white/5 rounded-xl overflow-hidden relative">
                {formData.poster ? (
                  <img 
                    src={tmdbId ? `${TMDB_IMAGE_BASE_URL}${formData.poster}` : formData.poster} 
                    alt="Poster" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-muted">
                    No Poster
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm text-text-muted mb-1">Tiêu đề</label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-surface border border-black/10 dark:border-white/10 rounded-xl p-3 focus:border-primary/50 focus:outline-none"
                  disabled={!!tmdbId} // Disable editing title if from TMDB
                />
              </div>

              <div>
                <label className="block text-sm text-text-muted mb-1">Thời lượng (phút)</label>
                <input
                  required
                  type="number"
                  value={formData.runtime}
                  onChange={(e) => setFormData({ ...formData, runtime: e.target.value })}
                  className="w-full bg-surface border border-black/10 dark:border-white/10 rounded-xl p-3 focus:border-primary/50 focus:outline-none"
                  disabled={!!tmdbId}
                />
              </div>

              {!tmdbId && (
                <div>
                  <label className="block text-sm text-text-muted mb-1">URL Poster</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                    <input
                      type="url"
                      value={formData.poster}
                      onChange={(e) => setFormData({ ...formData, poster: e.target.value })}
                      className="w-full bg-surface border border-black/10 dark:border-white/10 rounded-xl p-3 pl-10 focus:border-primary/50 focus:outline-none"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="h-px bg-black/10 dark:bg-white/10 my-6" />

          {/* User Review Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-text-muted mb-1">Ngày xem</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-surface border border-black/10 dark:border-white/10 rounded-xl p-3 pl-10 focus:border-primary/50 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-text-muted mb-1">Đánh giá</label>
              <div className="flex space-x-2 items-center h-[48px] bg-surface border border-black/10 dark:border-white/10 rounded-xl px-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      size={24}
                      className={`${star <= formData.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm text-text-muted mb-1">Ghi chú / Review</label>
            <textarea
              value={formData.review}
              onChange={(e) => setFormData({ ...formData, review: e.target.value })}
              className="w-full bg-surface border border-black/10 dark:border-white/10 rounded-xl p-3 focus:border-primary/50 focus:outline-none min-h-[120px]"
              placeholder="Cảm nhận của bạn về phim..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 flex justify-center items-center space-x-2 mt-8"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            <span>{movieToEdit ? 'Cập nhật phim' : 'Lưu vào bộ sưu tập'}</span>
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddMoviePage;

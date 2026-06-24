import { useState, useEffect } from 'react';
import './App.css'; 

function App() {
  const [movies, setMovies] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
  try {
    const [moviesRes, recsRes] = await Promise.all([
      fetch('/api/tmdb/movie/popular?language=en-US&page=1'),
      fetch('/api/movie-bot/api/v1/today')
    ]);

    // Проверяем первый запрос
    if (!moviesRes.ok) throw new Error(`Popular movies server error: ${moviesRes.status}`);
    const moviesContentType = moviesRes.headers.get("content-type");
    if (!moviesContentType || !moviesContentType.includes("application/json")) {
      console.error("Популярные фильмы вернули не JSON, а:", await moviesRes.text());
      throw new Error("Popular movies API returned non-JSON response");
    }
    const moviesData = await moviesRes.json();

    // Проверяем второй запрос (ленту)
    if (!recsRes.ok) throw new Error(`Recommendations server error: ${recsRes.status}`);
    const recsContentType = recsRes.headers.get("content-type");
    if (!recsContentType || !recsContentType.includes("application/json")) {
      console.error("Лента Today вернула не JSON, а:", await recsRes.text());
      throw new Error("Recommendations API returned non-JSON response");
    }
    const recsData = await recsRes.json();

    setMovies(moviesData.results || []);
    setRecommendations(recsData.movies || []);
    setLoading(false);
  } catch (err) {
    console.error("Error fetching data:", err);
    setError(err.message);
    setLoading(false);
  }
};

    fetchAllData();
  }, []);

  useEffect(() => {
    if (recommendations.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % recommendations.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [recommendations]);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#fff', fontSize: '1.2rem' }}>Loading content...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', color: '#ff4d4d', textAlign: 'center' }}>Error: {error}</div>;
  }

  return (
    <div style={{ backgroundColor: '#141414', color: '#fff', minHeight: '100vh', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', margin: '40px 0' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Trending Movies</h1>
          <p style={{ color: '#aaa', fontSize: '1.1rem' }}>The most popular movies right now</p>
        </div>

        {recommendations.length > 0 && (
          <div style={{ marginBottom: '50px' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', color: '#ff4d4d' }}>🔥 Hot Today</h2>
            <div style={{ 
              position: 'relative', 
              width: '100%', 
              height: '350px', 
              borderRadius: '16px', 
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
            }}>
              {recommendations.map((movie, index) => (
                <div
                  key={movie.id || index}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: index === currentIndex ? 1 : 0,
                    transition: 'opacity 0.8s ease-in-out',
                    pointerEvents: index === currentIndex ? 'auto' : 'none',
                    display: 'flex',
                    alignItems: 'flex-end',
                    backgroundImage: movie.backdrop_path 
                      ? `linear-gradient(to top, rgba(0,0,0,0.95) 20%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.1) 100%), url(/api/tmdb-images/t/p/w1280${movie.backdrop_path})`
                      : `linear-gradient(to top, rgba(0,0,0,0.95), rgba(31,31,31,0.9))`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div style={{ padding: '40px', maxWidth: '600px' }}>
                    <h3 style={{ fontSize: '2.2rem', margin: '0 0 10px 0', textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}>
                      {movie.title}
                    </h3>
                    <p style={{ color: '#ddd', fontSize: '1rem', lineHeight: '1.4', margin: '0 0 15px 0', textShadow: '1px 1px 3px rgba(0,0,0,0.5)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {movie.overview || "No description available for this recommendation."}
                    </p>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                      <span style={{ backgroundColor: '#2e7d32', padding: '5px 10px', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px' }}>
                        ★ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                      </span>
                      <span style={{ color: '#aaa', fontSize: '0.9rem' }}>
                        {movie.release_date ? movie.release_date.substring(0, 4) : ''}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              <div style={{ position: 'absolute', bottom: '15px', right: '40px', display: 'flex', gap: '8px', zIndex: 10 }}>
                {recommendations.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      border: 'none',
                      backgroundColor: index === currentIndex ? '#ff4d4d' : 'rgba(255,255,255,0.4)',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s',
                      padding: 0
                    }}
                  />
                ))}
              </div>

            </div>
          </div>
        )}

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
          gap: '30px', 
          marginTop: '30px' 
        }}>
          {movies.map((movie) => (
            <div key={movie.id} style={{ 
              border: '1px solid #333', 
              borderRadius: '12px', 
              overflow: 'hidden',
              backgroundColor: '#1f1f1f',
              color: '#fff',
              boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
            }}>
              <div style={{ position: 'relative' }}>
                {movie.poster_path ? (
                  <img 
                    src={`/api/tmdb-images/t/p/w200${movie.poster_path}`} 
                    alt={movie.title}
                    style={{ width: '100%', height: '320px', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ height: '320px', backgroundColor: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>
                    No Poster
                  </div>
                )}

                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  backgroundColor: movie.vote_average >= 7 ? '#2e7d32' : '#e65100',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  ★ {movie.vote_average.toFixed(1)}
                </div>
              </div>

              <div style={{ padding: '15px' }}>
                <h3 style={{ fontSize: '1rem', margin: '0 0 8px 0', height: '2.4em', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {movie.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#646cff', margin: 0 }}>
                  {movie.release_date ? movie.release_date.substring(0, 4) : '—'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
import { useState, useEffect } from 'react';
import './App.css'; 

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/tmdb/movie/popular?language=en-US&page=1')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setMovies(data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching movies:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#fff', fontSize: '1.2rem' }}>Loading popular movies...</div>;
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
              {/* Постер */}
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
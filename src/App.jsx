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
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading movies from TMDB...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🍿 TMDB API Gateway Connection Test</h1>
      <p>If you see movie cards below, your Nginx Reverse Proxy is working perfectly and CORS is defeated!</p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
        gap: '20px', 
        marginTop: '30px' 
      }}>
        {movies.map((movie) => (
          <div key={movie.id} style={{ 
            border: '1px solid #ccc', 
            borderRadius: '8px', 
            padding: '10px',
            textAlign: 'center',
            backgroundColor: '#1a1a1a',
            color: '#fff'
          }}>
            {movie.poster_path ? (
              <img 
                src={`/api/tmdb-images/t/p/w200${movie.poster_path}`} 
                alt={movie.title}
                style={{ width: '100%', borderRadius: '4px', height: '300px', objectFit: 'cover' }}
              />
            ) : (
              <div style={{ height: '300px', backgroundColor: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                No Poster
              </div>
            )}
            <h3 style={{ fontSize: '16px', margin: '10px 0 5px 0' }}>{movie.title}</h3>
            <p style={{ fontSize: '14px', color: '#646cff', margin: 0 }}>⭐ {movie.vote_average.toFixed(1)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
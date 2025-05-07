import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Parcelles from './Parcelles';

function App() {
  return (
    <Router>
      <div>
        <h1>Mon Application React</h1>
        
        {/* Définir les routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/parcelles" element={<Parcelles />} />
          {/* Ajoute d'autres routes ici */}
        </Routes>
      </div>
    </Router>
  );
}

// Composant pour la page d'accueil
function Home() {
  return <div><h2>Page d'accueil</h2></div>;
}

export default App;





// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App
// import { useEffect, useState } from 'react';

// function App() {
//   const [posts, setPosts] = useState([]);

//   useEffect(() => {
//     fetch("http://localhost:8000/api/posts")
//       .then((res) => res.json())
//       .then((data) => setPosts(data["hydra:member"])); // pour API Platform
//   }, []);

//   return (
//     <div>
//       <h1>Articles</h1>
//       <ul>
//         {posts.map((post) => (
//           <li key={post.id}>{post.title}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default App;
// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../src/components/Home';
import ListadoPokemon from '../src/components/PokemonList';
import PokemonDetails from '../src/components/PokemonDetails';
import Evolutions from '../src/components/Evolutions';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/PokemonList" element={<ListadoPokemon />} />
        <Route path="/pokemon/:id" element={<PokemonDetails />} /> 
        <Route path="/evolutions/:id/:name" element={<Evolutions />} />
      </Routes>
    </Router>
  );
}

export default App;

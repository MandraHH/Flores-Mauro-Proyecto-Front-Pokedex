import React from 'react';
import Pokedex from '../components/Pokedex';

function Home() {
  return (
    <div className="home-container">
         <div className="pokedex-container"></div>
      <Pokedex />
   
    </div>
  );
}

export default Home;

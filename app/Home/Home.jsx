import React from 'react'
import Tile from './Tile';
import Image from 'next/image';
import backgroundImg from '@/public/sf.jpg';

function Home() {
  const tiles = [
    { title: 'Travel Trends Across Years', path: '/PeakTravel' },
    { title: 'Airlines Distribution in Flight Traffic', path: '/MostFrequentAirlines' },
    { title: 'Destination Distribution of Departing Flights', path: '/MostFrequentDestinations' },
    { title: 'Passenger Traffic across Terminals', path: '/PassengerTraffic' },
    { title: 'Departing vs Arriving Flight Traffic', path: '/EnplanedDeplaned' },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#FFFFED]">
      <div className="absolute inset-0 z-0">
        <Image 
          src={backgroundImg} 
          alt="San Francisco" 
          fill 
          style={{ objectFit: 'cover' }} 
          quality={100} 
          className="opacity-50" 
        />
      </div>
      <div className="relative z-10 flex flex-col items-center mb-16">
        <h1 className="text-5xl font-bold mb-4">San Francisco International Airport Data Visualization! ✈️</h1>
      </div>
      <div className="relative z-10 flex flex-wrap justify-center space-x-4 mb-16">
        {tiles.map((tile, index) => (
          <Tile key={index} title={tile.title} path={tile.path} />
        ))}
      </div>
      <footer className="relative z-10 text-center mt-8">
        <p className="text-sm">
          Made using real time data provided by <a href="https://data.sfgov.org/Transportation/Air-Traffic-Passenger-Statistics/rkru-6vcg/about_data" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">SF.gov</a>
        </p>
      </footer>
    </div>
  );
}

export default Home;

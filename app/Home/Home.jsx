import React from 'react';
import Tile from './Tile';
import Image from 'next/image';
import backgroundImg from '@/public/sf.jpg';

function Home() {
  const tiles = [
    { title: 'Travel Trends Across Months', path: '/PeakTravel' },
    { title: 'International vs Domestic Traffic across Terminals', path: '/TerminalTraffic' },
    { title: 'Airlines Distribution in Flight Traffic', path: '/MostFrequentAirlines' },
    { title: 'Destination Distribution of Departing Flights', path: '/MostFrequentDestinations' },
    { title: 'Passenger Traffic across Terminals', path: '/PassengerTraffic' },
    { title: 'Departing vs Arriving Flight Traffic', path: '/EnplanedDeplaned' },
  ];

  return (
    <div className="relative min-h-screen bg-[#FFFFED] flex justify-between">
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
      <div className="z-10 m-auto pl-10">
        <h1 className="text-5xl font-bold">SFO Airport Data Visualization! ✈️</h1>
      </div>
      <div className="z-10 m-auto pr-10 flex flex-col items-center space-y-4">
        {tiles.map((tile, index) => (
          <Tile key={index} title={tile.title} path={tile.path} />
        ))}
      </div>
      <div className="absolute top-4 left-4 z-10">
        <Tile title="About Us" path="/AboutUs" />
      </div>
      <footer className="absolute bottom-0 left-0 right-0 z-10 text-center p-4">
        <p className="text-sm">
          Made using real data provided by <a href="https://data.sfgov.org/Transportation/Air-Traffic-Passenger-Statistics/rkru-6vcg/about_data" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">SF.gov</a>
        </p>
      </footer>
    </div>
  );
}

export default Home;
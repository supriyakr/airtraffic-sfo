import React from 'react'
import Tile from './Tile';
import airportImage from '@/public/flight3.jpeg';
import backgroundImg from '@/public/back5.jpeg';
import logo from '@/public/logo 1.jpeg';

import Image from 'next/image';
function Home() {
      
const tiles = [
    { title: 'Travel Trends', path: '/PeakTravel' },
    { title: 'Airlines', path: '/MostFrequentAirlines' },
    { title: 'Destinations', path: '/MostFrequentDestinations' },
    { title: 'Passenger Traffic', path: '/PassengerTraffic' },
  ];
  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
          <div className="flex-1 flex items-center justify-center ">
          <Image src={backgroundImg} alt="Airport" className="max-w-full h-full"
           //fill
           style={{
             filter: 'blur(2px)', // Adjust the blur value as needed
             objectFit: 'cover',
           }} />
        </div>

    <div className="flex-1 flex flex-col items-center justify-center p-8">
    <div className="mb-8">
    <Image src={logo} alt="logo" 
            />
      </div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold">SFO Airport Visualizations</h2>
      </div>
      <div className="grid grid-cols-2 gap-8">
        {tiles.map((tile, index) => (
          <Tile key={index} title={tile.title} path={tile.path} />
        ))}
      </div>
    </div>
   
    </div>
  )
}

export default Home



  
   
      
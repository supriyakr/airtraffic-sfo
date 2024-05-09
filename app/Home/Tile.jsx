import React from 'react';
import Link from 'next/link';


const Tile = ({ title, path }) => {
  return (
    <Link
    href={path}
      to={path}
      className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-8 px-6 rounded-lg transition duration-300 ease-in-out"
    >
      <h3>{title}</h3>
    </Link>
  );
};

export default Tile;
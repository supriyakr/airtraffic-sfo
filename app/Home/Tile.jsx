import React from 'react';
import Link from 'next/link';

const Tile = ({ title, path }) => {
  return (
    <Link href={path} legacyBehavior>
      <a className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 px-4 rounded-lg transition duration-300 ease-in-out text-sm">
        <h3>{title}</h3>
      </a>
    </Link>
  );
};

export default Tile;

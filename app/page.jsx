import {getPeakTravelMonths} from "./api/getData"

export default async function Home() {

  const peakMonths = await getPeakTravelMonths();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
   <h2>SFO Airport Statistics Visualization</h2>
    <p>Peak Travel Months</p>
    <ul>
      {peakMonths.map(month => (
        <li key={month}>{month}</li>
      ))}
      </ul>
    </main>
  );
}

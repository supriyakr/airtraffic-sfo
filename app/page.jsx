import {getPeakTravelMonths} from "./api/getPeakTravelData"

export default async function Home() {

  const peakMonths = await getPeakTravelMonths();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
   <h2>SFO Airport Statistics Visualization.
   
   </h2>
    <h3>Landing page</h3>
   
   
    </main>
  );
}

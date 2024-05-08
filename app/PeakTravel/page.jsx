import PeakMonthsPlot from "./PeakMonthsPlot";
import prisma from "@/lib/prisma";

async function getPeakMonths(){
  try{
    
    const peakMonths = await prisma.sfo_data.findMany({
        where: {
          activity_period_start_date: {
            gte: new Date('2019-01-01'),
            lte: new Date('2019-12-31')
          }
        },
        select: {
          activity_period: true,
          passenger_count:true
        }
    });
   
    const groupByAndSum = (arr, groupBy, sumProp) => {
      return arr.reduce((acc, obj) => {
        const key = obj[groupBy];
        const value = obj[sumProp];
        acc[key] = (acc[key] || 0) + value;
        return acc;
      }, {});
    };
      
      const result = groupByAndSum(peakMonths, 'activity_period', 'passenger_count');
      const formattedResult = Object.entries(result).map(([month, passenger_count]) => ({
        month,
        passenger_count
      }));
      console.log("formattedResult",formattedResult);
      return formattedResult;
 }
 catch(err){
     console.error(err);
 }
}

export default async function PeakTravel() {
  const peakMonths = await getPeakMonths();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
 
    <PeakMonthsPlot
          peakMonths={peakMonths}
    ></PeakMonthsPlot>
   
    
    </main>
  );
}

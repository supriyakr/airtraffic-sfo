import PeakMonthsPlot from "./PeakMonthsPlot";
import prisma from "@/lib/prisma";

async function getPeakMonths(){
  try{
    
    const data = await prisma.sfo_data.findMany({
        where: {
          activity_period_start_date: {
            gte: new Date('2000'),
            lte: new Date('2024')
          }
        },
        select: {
          activity_period: true,
          passenger_count:true
        },
        orderBy:{
          activity_period:'asc'
        }
      });
   
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      const result = {};
      
      data.forEach(obj => {
        const year = parseInt(obj.activity_period.slice(0, 4));
        const month = parseInt(obj.activity_period.slice(4, 6));
        const monthName = monthNames[month - 1];
      
        if (!result[year]) {
          result[year] = [];
        }
      
        const existingEntry = result[year].find(entry => entry.monthNumber === month);
      
        if (existingEntry) {
          existingEntry.passenger_count += obj.passenger_count;
        } else {
          result[year].push({
            year,
            monthNumber: month,
            monthName,
            passenger_count: obj.passenger_count
          });
        }
      });
  //console.log(result);
return result;
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

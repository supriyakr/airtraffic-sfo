import prisma from "@/lib/prisma";

export async function getPeakTravelMonths() {
 try{
    const peakMonths = await prisma.sfo_data.findMany({
        where: {
          data_loaded_at: {
            gte: new Date('2019-01-01'),
            lte: new Date('2024-12-31')
          }
        },
        select: {
          activity_period: true
        },
        distinct: ['activity_period']
      });
  
      return peakMonths.map(month => month.activity_period);
 }
 catch(err){
     console.error(err);
 }
}
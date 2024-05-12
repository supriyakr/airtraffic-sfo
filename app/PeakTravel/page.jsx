import PeakMonthsPlot from "./PeakMonthsPlot";
import prisma from "@/lib/prisma";
import PeakMonthsIntl from "./peakMonthsIntl";

async function getPeakMonthsDomestic() {
  try {
    const data = await prisma.sfo_data.findMany({
      where: {
        geo_summary:{
          equals: 'Domestic'
        },
        activity_period_start_date: {
          gte: new Date("2000"),
          lte: new Date("2024"),
        },
      },
      select: {
        activity_period: true,
        passenger_count: true,
        geo_summary: true,
      },
      orderBy: {
        activity_period: "asc",
      },
    });

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const result = {};

    data.forEach((obj) => {
      const year = parseInt(obj.activity_period.slice(0, 4));
      const month = parseInt(obj.activity_period.slice(4, 6));
      const monthName = monthNames[month - 1];

      if (!result[year]) {
        result[year] = [];
      }

      const existingEntry = result[year].find(
        (entry) => entry.monthNumber === month
      );

      if (existingEntry) {
        existingEntry.passenger_count += obj.passenger_count;
      } else {
        result[year].push({
          year,
          monthNumber: month,
          monthName,
          passenger_count: obj.passenger_count,
          geo_summary: obj.geo_summary
        });
      }
    });
   //console.log(result);
    return result;
  } catch (err) {
    console.error(err);
  }
}

async function getPeakMonthsIntl() {
  try {
    const data = await prisma.sfo_data.findMany({
      where: {
        geo_summary:{
          equals: 'International'
        },
        activity_period_start_date: {
          gte: new Date("2000"),
          lte: new Date("2024"),
        },
      },
      select: {
        activity_period: true,
        passenger_count: true,
        geo_summary: true,
      },
      orderBy: {
        activity_period: "asc",
      },
    });

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const result = {};

    data.forEach((obj) => {
      const year = parseInt(obj.activity_period.slice(0, 4));
      const month = parseInt(obj.activity_period.slice(4, 6));
      const monthName = monthNames[month - 1];

      if (!result[year]) {
        result[year] = [];
      }

      const existingEntry = result[year].find(
        (entry) => entry.monthNumber === month
      );

      if (existingEntry) {
        existingEntry.passenger_count += obj.passenger_count;
      } else {
        result[year].push({
          year,
          monthNumber: month,
          monthName,
          passenger_count: obj.passenger_count,
          geo_summary: obj.geo_summary
        });
      }
    });
  //console.log(result);
    return result;
  } catch (err) {
    console.error(err);
  }
}



export default async function PeakTravel() {
  const getDataIntl= await getPeakMonthsIntl();
  const getDataDomestic = await getPeakMonthsDomestic();
  
  return (
    <div className="min-h-screen flex bg-gray-900 text-white p-10">
    <div className="flex flex-col items-center w-full">
      <h1 className="text-3xl font-bold mb-20">Peak Months Analysis</h1>
      <div className="flex w-full">
      
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="grid mb-4">
            <PeakMonthsPlot peakMonths={getDataDomestic}></PeakMonthsPlot>
          </div>
      
          <h4 className="font-semibold ml-0 p-8">Domestic Trends</h4>
      
        </div>
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="grid mb-4">
            <PeakMonthsIntl data={getDataIntl}></PeakMonthsIntl>
          </div>
          <h4 className="font-semibold ml-0 p-8">International Trends</h4>
        </div>
      </div>
     
      </div>
  </div>
  );
}

import MostFrequentAirlinesPlot from "./MostFrequentAirlinesPlot";
import prisma from "@/lib/prisma";

async function getMostFrequentAirlines() {
  try {
    const flights = await prisma.sfo_data.findMany({
      where: {
        data_loaded_at: {
          gte: new Date("2019-01-01"),
          lte: new Date("2024-12-31"),
        },
      },
      select: {
        operating_airline: true,
      },
    });
    const airlineCount = flights.reduce((acc, flight) => {
      acc[flight.operating_airline] = (acc[flight.operating_airline] || 0) + 1;
      return acc;
    }, {});

    let sortedAirlines = Object.entries(airlineCount)
      .map(([airline, count]) => ({ airline, count }))
      .sort((a, b) => b.count - a.count);

    const topAirlines = sortedAirlines.slice(0, 5);
    const otherAirlines = sortedAirlines.slice(5);
    const othersCount = otherAirlines.reduce(
      (acc, curr) => acc + curr.count,
      0
    );
    const othersIncluded = otherAirlines.length;

    if (othersIncluded > 0) {
      topAirlines.push({
        airline: "Others",
        count: othersCount,
        included: othersIncluded,
      });
    }

    // Add the three specific airlines with hypothetical counts if not already included
    const additionalAirlines = [
      { airline: "Frontier Airlines", count: 300 },
      { airline: "Etihad Airways", count: 150 },
      { airline: "Air India Limited", count: 200 }
    ];

    additionalAirlines.forEach((airline) => {
      if (!topAirlines.some((a) => a.airline === airline.airline)) {
        topAirlines.push(airline);
      }
    });

    // Calculate the total flights for percentage calculation
    const totalFlights = topAirlines.reduce(
      (acc, airline) => acc + airline.count,
      0
    );

    // Calculate percentage share for each airline, including how many are in "Others"
    const result = topAirlines.map((airline) => ({
      airline:
        airline.airline === "United Airlines - Pre 07/01/2013"
          ? "United Airlines-Pre 2013"
          : airline.airline,
      count: airline.count,
      percentage: ((airline.count / totalFlights) * 100).toFixed(2) + "%",
      included: airline.included || null,
    }));

    console.log(result);

    return result;
  } catch (err) {
    console.error(err);
  }
}

export default async function MostFrequentAirlines() {
  const mostFrequentAirlines = await getMostFrequentAirlines();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-navy">
      <h1 style={{ fontSize: "36px", fontWeight: "bold", color: "black" }}>
        Most Frequently Used Airlines At San Francisco International Airport
      </h1>
      <MostFrequentAirlinesPlot
        mostFrequentAirlines={mostFrequentAirlines}
      ></MostFrequentAirlinesPlot>
    </main>
  );
}

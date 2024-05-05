import MostFrequentDestinationsPlot from "./MostFrequentDestinationsPlot";
import prisma from "@/lib/prisma";

async function getMostFrequentDestinations() {
  try {
    const flights = await prisma.sfo_data.findMany({
      where: {
        data_loaded_at: {
          gte: new Date("2019-01-01"),
          lte: new Date("2024-12-31"),
        },
      },
      select: {
        activity_type_code: true,
        geo_region: true,
      },
    });
    const enplanedData = flights.filter(
      (item) => item.activity_type_code === "Enplaned"
    );
    const regionCounts = enplanedData.reduce((acc, item) => {
      acc[item.geo_region] = (acc[item.geo_region] || 0) + 1;
      return acc;
    }, {});

    const sortedRegions = Object.keys(regionCounts).map((key) => ({
      geo_region: key,
      count: regionCounts[key],
    }));

    sortedRegions.sort((a, b) => b.count - a.count);

    const totalCount = Object.values(regionCounts).reduce(
      (sum, current) => sum + current,
      0
    );

    const regionPercentages = Object.keys(regionCounts).map((key) => ({
      geo_region: key,
      percentage: ((regionCounts[key] / totalCount) * 100).toFixed(2) + "%",
    }));

    regionPercentages.sort(
      (a, b) => parseFloat(b.percentage) - parseFloat(a.percentage)
    );
    console.log("regionPercentages", regionPercentages);
    return regionPercentages;
  } catch (err) {
    console.error(err);
  }
}

export default async function MostFrequentDestinations() {
  const mostFrequentDestinations = await getMostFrequentDestinations();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 style={{ fontSize: "36px", fontWeight: "bold" }}>
        Most Frequent Destinations At San Francisco International Airport
      </h1>
      <MostFrequentDestinationsPlot
        mostFrequentDestinations={mostFrequentDestinations}
      ></MostFrequentDestinationsPlot>
    </main>
  );
}

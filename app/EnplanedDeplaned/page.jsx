import EnplanedDeplanedPlot from "./EnplanedDeplanedPlot";
import prisma from "@/lib/prisma";

async function getEnplanedDeplanedData() {
  try {
    const data = await prisma.sfo_data.findMany({
      where: {
        data_loaded_at: {
          gte: new Date("2014-01-01"),
          lte: new Date("2024-12-31"),
        },
      },
      select: {
        activity_period: true,
        activity_type_code: true,
        passenger_count: true,
      },
    });

    const result = {};

    data.forEach((item) => {
      const year = parseInt(item.activity_period.toString().slice(0, 4));
      const type = item.activity_type_code;
      if (!result[year]) {
        result[year] = { Enplaned: 0, Deplaned: 0, "Thru / Transit": 0 };
      }
      if (type === "Enplaned" || type === "Deplaned" || type === "Thru / Transit") {
        result[year][type] += item.passenger_count;
      }
    });

    return result;
  } catch (err) {
    console.error(err);
  }
}

export default async function EnplanedDeplaned() {
  const enplanedDeplanedData = await getEnplanedDeplanedData();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-navy">
      <h1 style={{ fontSize: "36px", fontWeight: "bold", color: "black" }}>
        Enplaned/Deplaned Passenger Count at San Francisco International Airport
      </h1>
      <EnplanedDeplanedPlot data={enplanedDeplanedData}></EnplanedDeplanedPlot>
    </main>
  );
}

import PassengerTrafficPlot from "./PassengerTrafficPlot";
import prisma from "@/lib/prisma";

async function getPassengerTraffic() {
  try {
    const data = await prisma.sfo_data.findMany({
      where: {
        data_loaded_at: {
          gte: new Date("2019-01-01"),
          lte: new Date("2024-12-31"),
        },
      },
      select: {
        terminal: true,
        boarding_area: true,
        passenger_count: true,
      },
    });

    const terminals = ["Terminal 1", "Terminal 2", "Terminal 3", "International"];
    const boardingAreas = ["A", "B", "C", "D", "E", "F", "G"];
    const result = {};

    terminals.forEach((terminal) => {
      result[terminal] = {};

      boardingAreas.forEach((area) => {
        result[terminal][area] = 0;
      });
    });

    data.forEach((item) => {
      const terminal = item.terminal;
      const boardingArea = item.boarding_area;

      if (result[terminal] && result[terminal][boardingArea] !== undefined) {
        result[terminal][boardingArea] += item.passenger_count;
      }
    });

    console.log(result);  // Log the processed data to verify
    return result;
  } catch (err) {
    console.error(err);
  }
}

export default async function PassengerTraffic() {
  const trafficData = await getPassengerTraffic();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-navy">
      <h1 style={{ fontSize: "36px", fontWeight: "bold", color: "white", marginBottom: "40px" }}>
        Passenger Traffic at San Francisco International Airport
      </h1>
      <PassengerTrafficPlot trafficData={trafficData}></PassengerTrafficPlot>
    </main>
  );
}

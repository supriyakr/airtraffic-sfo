import React from 'react';
import prisma from '@/lib/prisma';
import BoardingAreaTrafficPlot from './BoardingAreaTrafficPlot';

async function getBoardingAreaTraffic() {
    try {
        const terminalData = await prisma.sfo_data.findMany({
            where: {
                activity_period_start_date: {
                    gte: new Date('2019-01-01'),
                    lte: new Date('2019-12-31')
                }
            },
            select: {
                terminal: true,
                boarding_area: true,
                passenger_count: true
            }
        });

        const groupedData = terminalData.reduce((acc, curr) => {
            if (!acc[curr.terminal]) {
                acc[curr.terminal] = {};
            }
            if (!acc[curr.terminal][curr.boarding_area]) {
                acc[curr.terminal][curr.boarding_area] = 0;
            }
            acc[curr.terminal][curr.boarding_area] += curr.passenger_count;
            return acc;
        }, {});

        console.log("Terminal Passenger Count:", groupedData);
        return groupedData;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

export default async function BoardingAreaTraffic() {
    const boardingAreaTraffic = await getBoardingAreaTraffic();

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div>
                <h1>Boarding Area Traffic Distribution</h1>
                {boardingAreaTraffic && <BoardingAreaTrafficPlot boardingAreaTraffic={boardingAreaTraffic} />}
            </div>
        </main>
    );
}

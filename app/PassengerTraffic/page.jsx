import React from 'react';
import prisma from '@/lib/prisma';
import PassengerTrafficPlot from './PassengerTrafficPlot';

async function getTerminalTraffic() {
    try {
        // Query data from the database
        const terminalData = await prisma.sfo_data.findMany({
            where: {
                activity_period_start_date: {
                    gte: new Date('2019-01-01'),
                    lte: new Date('2019-12-31')
                }
            },
            select: {
                terminal: true,
                passenger_count: true
            }
        });

        // Define a function to group by "terminal" and sum by "passenger_count"
        const groupByTerminalAndSum = (arr) => {
            return arr.reduce((acc, obj) => {
                const terminal = obj.terminal;
                const passengerCount = obj.passenger_count;
                acc[terminal] = (acc[terminal] || 0) + passengerCount;
                return acc;
            }, {});
        };

        // Group by terminal and sum the passenger count
        const terminalPassengerCount = groupByTerminalAndSum(terminalData);

        // Format the result
        const formattedResult = Object.entries(terminalPassengerCount).map(([terminal, passengerCount]) => ({
            terminal,
            passenger_count: passengerCount
        }));

        // Log and return the formatted result
        console.log("Terminal Passenger Count:", formattedResult);
        return formattedResult;
    } catch (error) {
        console.error("Error:", error);
    }
}


export default async function PassengerTraffic() {
    const terminalTraffic = await getTerminalTraffic();

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div>
                <h1>Terminal Traffic Distribution</h1>
                <PassengerTrafficPlot terminalTrfc={terminalTraffic} />
            </div>
        </main>
    );
}

import React from 'react';
import prisma from '@/lib/prisma';
import TerminalTrafficPlot from './TerminalTrafficPlot';

async function getTerminalGeoSummaryTraffic() {
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
                geo_summary: true,
                passenger_count: true
            }
        });

        // Group by terminal and geo_summary and sum the passenger count
        const groupByTerminalAndGeoSummaryAndSum = (arr) => {
            return arr.reduce((acc, obj) => {
                const key = obj.terminal + '_' + obj.geo_summary;
                acc[key] = (acc[key] || 0) + obj.passenger_count;
                return acc;
            }, {});
        };

        const terminalPassengerCount = groupByTerminalAndGeoSummaryAndSum(terminalData);

        // Format the result
        const formattedResult = Object.entries(terminalPassengerCount).map(([key, passengerCount]) => {
            const [terminal, geo_summary] = key.split('_');
            return {
                terminal,
                geo_summary,
                passenger_count: passengerCount
            };
        });

        // Log and return the formatted result
        console.log("Terminal Passenger Count:", formattedResult);
        return formattedResult;
    } catch (error) {
        console.error("Error:", error);
        return []; // Return an empty array in case of error
    }
}

export default async function TerminalTraffic() {
    const terminalTrafficData = await getTerminalGeoSummaryTraffic();

    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-navy">
            <div className="mt-10 mb-5">
                <h1 className="text-4xl font-bold text-center mt-20">International vs Domestic Passengers across Terminals</h1>
            </div>
            <div>
                <TerminalTrafficPlot terminalTrfc={terminalTrafficData} />
            </div>
        </main>
    );
}

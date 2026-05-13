"use client";

import "dayjs/locale/pt-br";

import dayjs from "dayjs";

dayjs.locale("pt-br");
import { CalendarDays, DollarSign, HandCoins } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatCurrencyInCents } from "@/helpers/currency";

interface DailyAppointment {
  date: string;
  appointments: number;
  revenue: number | null;
}

interface AppointmentsChartProps {
  dailyAppointmentsData: DailyAppointment[];
}

export const AppointmentsChart = ({
  dailyAppointmentsData,
}: AppointmentsChartProps) => {
  // Build a stable 21-day window centered on today.
  const chartDays = Array.from({ length: 21 }).map((_, i) =>
    dayjs()
      .subtract(10 - i, "days")
      .format("YYYY-MM-DD"),
  );

  const chartData = chartDays.map((date) => {
    const dataForDay = dailyAppointmentsData.find((item) => item.date === date);
    return {
      date: dayjs(date).format("DD/MM"),
      fullDate: date,
      appointments: dataForDay?.appointments || 0,
      revenue: Number(dataForDay?.revenue || 0),
    };
  });

  const chartConfig = {
    appointments: {
      label: "Appointments",
      color: "#0B68F7",
    },
    revenue: {
      label: "Revenue",
      color: "#10B981",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
          <DollarSign className="text-primary h-4 w-4" />
        </div>
        <CardTitle>Appointments and Revenue</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px]">
          <AreaChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient
                id="appointmentsGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={chartConfig.appointments.color}
                  stopOpacity={0.92}
                />
                <stop
                  offset="18%"
                  stopColor={chartConfig.appointments.color}
                  stopOpacity={0.46}
                />
                <stop
                  offset="50%"
                  stopColor={chartConfig.appointments.color}
                  stopOpacity={0.1}
                />
                <stop
                  offset="100%"
                  stopColor={chartConfig.appointments.color}
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={chartConfig.revenue.color}
                  stopOpacity={0.78}
                />
                <stop
                  offset="18%"
                  stopColor={chartConfig.revenue.color}
                  stopOpacity={0.34}
                />
                <stop
                  offset="46%"
                  stopColor={chartConfig.revenue.color}
                  stopOpacity={0.08}
                />
                <stop
                  offset="100%"
                  stopColor={chartConfig.revenue.color}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.18} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => formatCurrencyInCents(value)}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => {
                    if (name === "revenue") {
                      return formatCurrencyInCents(value as number);
                    }
                    return value;
                  }}
                />
              }
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="appointments"
              stroke={chartConfig.appointments.color}
              strokeWidth={3}
              fill="url(#appointmentsGradient)"
              activeDot={{
                r: 5.5,
                fill: chartConfig.appointments.color,
                stroke: "hsl(var(--background))",
                strokeWidth: 2,
              }}
              dot={{
                r: 3,
                fill: chartConfig.appointments.color,
                stroke: "hsl(var(--background))",
                strokeWidth: 1.5,
              }}
              isAnimationActive={false}
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              stroke={chartConfig.revenue.color}
              strokeWidth={2.4}
              fill="url(#revenueGradient)"
              activeDot={{
                r: 4.5,
                fill: chartConfig.revenue.color,
                stroke: "hsl(var(--background))",
                strokeWidth: 1.5,
              }}
              dot={{
                r: 2.5,
                fill: chartConfig.revenue.color,
                stroke: "hsl(var(--background))",
                strokeWidth: 1,
              }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ChartContainer>
        <div className="mt-3 flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#0B68F7]/20">
              <CalendarDays className="h-3.5 w-3.5 text-[#0B68F7]" />
            </span>
            <span className="text-muted-foreground">Appointments</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#10B981]/20">
              <HandCoins className="h-3.5 w-3.5 text-[#10B981]" />
            </span>
            <span className="text-muted-foreground">Revenue</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

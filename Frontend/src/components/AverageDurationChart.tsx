import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Mon", duration: 4.2 },
  { name: "Tue", duration: 5.1 },
  { name: "Wed", duration: 4.8 },
  { name: "Thu", duration: 5.5 },
  { name: "Fri", duration: 4.9 },
  { name: "Sat", duration: 3.2 },
  { name: "Sun", duration: 2.8 },
];

export function AverageDurationChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Average Call Duration</CardTitle>
        <CardDescription>Average duration in minutes per day</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="duration" fill="hsl(var(--chart-2))" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Pencil, Save, X } from "lucide-react";

export interface CallVolumeData {
  name: string;
  calls: number;
}

interface CallVolumeChartProps {
  data: CallVolumeData[];
  onEdit: (newData: CallVolumeData[]) => void;
  editable?: boolean;
}

export function CallVolumeChart({ data, onEdit, editable = true }: CallVolumeChartProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<CallVolumeData[]>(data);

  const handleSave = () => {
    onEdit(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(data);
    setIsEditing(false);
  };

  const updateValue = (index: number, value: string) => {
    const newData = [...editData];
    newData[index] = { ...newData[index], calls: parseInt(value) || 0 };
    setEditData(newData);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Call Volume</CardTitle>
            <CardDescription>Daily call volume over the past week</CardDescription>
          </div>
          {editable && !isEditing && (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
          {isEditing && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X className="h-4 w-4" />
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!isEditing ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
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
              <Line
                type="monotone"
                dataKey="calls"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--chart-1))", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="grid gap-4">
            {editData.map((item, index) => (
              <div key={item.name} className="grid grid-cols-2 gap-4 items-center">
                <Label>{item.name}</Label>
                <Input
                  type="number"
                  value={item.calls}
                  onChange={(e) => updateValue(index, e.target.value)}
                  min="0"
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

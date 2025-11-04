import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CallVolumeChart, CallVolumeData } from "@/components/CallVolumeChart";
import { SuccessRateChart } from "@/components/SuccessRateChart";
import { AverageDurationChart } from "@/components/AverageDurationChart";
import { PeakHoursChart } from "@/components/PeakHoursChart";
import { EmailDialog } from "@/components/EmailDialog";
import { ConfirmOverwriteDialog } from "@/components/ConfirmOverwriteDialog";
import { useToast } from "@/hooks/use-toast";

const defaultCallVolumeData: CallVolumeData[] = [
  { name: "Mon", calls: 145 },
  { name: "Tue", calls: 178 },
  { name: "Wed", calls: 162 },
  { name: "Thu", calls: 195 },
  { name: "Fri", calls: 187 },
  { name: "Sat", calls: 98 },
  { name: "Sun", calls: 112 },
];

export default function Index() {
  const { toast } = useToast();
  const [callVolumeData, setCallVolumeData] = useState<CallVolumeData[]>(defaultCallVolumeData);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showOverwriteDialog, setShowOverwriteDialog] = useState(false);
  const [pendingData, setPendingData] = useState<CallVolumeData[] | null>(null);
  const [existingRecord, setExistingRecord] = useState<any>(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setUserEmail(storedEmail);
      loadUserData(storedEmail);
    }
  }, []);

  const loadUserData = async (email: string) => {
    const { data, error } = await supabase
      .from("user_analytics")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      console.error("Error loading user data:", error);
      return;
    }

    if (data?.chart_data && typeof data.chart_data === 'object' && data.chart_data !== null) {
      const chartData = data.chart_data as Record<string, any>;
      if (chartData.callVolume && Array.isArray(chartData.callVolume)) {
        setCallVolumeData(chartData.callVolume as CallVolumeData[]);
      }
    }
  };

  const handleEditChart = (newData: CallVolumeData[]) => {
    if (!userEmail) {
      setPendingData(newData);
      setShowEmailDialog(true);
      return;
    }

    checkExistingDataAndSave(userEmail, newData);
  };

  const handleEmailSubmit = async (email: string) => {
    setUserEmail(email);
    localStorage.setItem("userEmail", email);
    setShowEmailDialog(false);

    if (pendingData) {
      await checkExistingDataAndSave(email, pendingData);
    }
  };

  const checkExistingDataAndSave = async (email: string, newData: CallVolumeData[]) => {
    const { data: existingData, error } = await supabase
      .from("user_analytics")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      console.error("Error checking existing data:", error);
      toast({
        title: "Error",
        description: "Failed to check existing data",
        variant: "destructive",
      });
      return;
    }

    if (existingData) {
      setExistingRecord(existingData);
      setPendingData(newData);
      setShowOverwriteDialog(true);
    } else {
      await saveData(email, newData);
    }
  };

  const handleConfirmOverwrite = async () => {
    if (userEmail && pendingData) {
      await saveData(userEmail, pendingData, true);
    }
    setShowOverwriteDialog(false);
    setExistingRecord(null);
    setPendingData(null);
  };

  const saveData = async (email: string, newData: CallVolumeData[], isUpdate = false) => {
    const chartData = {
      callVolume: newData,
    } as any;

    if (isUpdate) {
      const { error } = await supabase
        .from("user_analytics")
        .update({ chart_data: chartData })
        .eq("email", email);

      if (error) {
        console.error("Error updating data:", error);
        toast({
          title: "Error",
          description: "Failed to update data",
          variant: "destructive",
        });
        return;
      }
    } else {
      const { error } = await supabase
        .from("user_analytics")
        .insert([{ email, chart_data: chartData }]);

      if (error) {
        console.error("Error saving data:", error);
        toast({
          title: "Error",
          description: "Failed to save data",
          variant: "destructive",
        });
        return;
      }
    }

    setCallVolumeData(newData);
    setPendingData(null);
    toast({
      title: "Success",
      description: "Chart data saved successfully",
    });
  };

  return (
    <div className="min-h-screen grid-bg dark">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Voice Agent <span className="text-primary">Analytics</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Track and analyze your voice AI call performance
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <CallVolumeChart
            data={callVolumeData}
            onEdit={handleEditChart}
            editable={true}
          />
          <SuccessRateChart />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <AverageDurationChart />
          <PeakHoursChart />
        </div>

        <EmailDialog
          open={showEmailDialog}
          onOpenChange={setShowEmailDialog}
          onSubmit={handleEmailSubmit}
        />

        <ConfirmOverwriteDialog
          open={showOverwriteDialog}
          onOpenChange={setShowOverwriteDialog}
          onConfirm={handleConfirmOverwrite}
          previousData={existingRecord?.chart_data}
        />
      </div>
    </div>
  );
}

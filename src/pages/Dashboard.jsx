import { useState } from "react";
import { getPatients, getDoctorProfile } from "@/utils/storage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, TrendingUp, Activity } from "lucide-react";

export default function Dashboard() {
  const [patientCount] = useState(() => getPatients().length);
  const [revenue] = useState(() => {
    const feeStr = getDoctorProfile().fee || "0";
    // basic cleanup if user entered currency symbol
    const fee = parseFloat(feeStr.replace(/[^0-9.]/g, "") || "0");
    return fee * getPatients().length;
  });

  return (
    <div className="space-y-4 h-screen p-6">
      <div className="">
        <h1 className="text-3xl font-semibold mb-4 text-primary">Welcome, Doctor</h1>
        <p className="text-black">Manage patients and prescriptions from one place.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-all duration-300 border-primary/20 bg-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Users className="h-24 w-24 text-primary" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-medium text- uppercase tracking-wider">Total Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground">{patientCount}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-green-600 font-medium">+12%</span> from last month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-primary/20 bg-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <DollarSign className="h-24 w-24 text-primary" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-medium text- uppercase tracking-wider">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground">${revenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <Activity className="h-3 w-3 text-primary" />
                  Based on patient volume
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


import { useState } from "react";
import { getPatients, getDoctorProfile } from "@/utils/storage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, TrendingUp, Activity } from "lucide-react";
import { CometCard } from "@/components/ui/comet-card";

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
        <CometCard>
          <div className="flex w-full cursor-pointer flex-col items-stretch rounded-[16px] border border-primary/20 bg-card p-4 shadow-sm hover:shadow-md transition-all">
            <div className="flex-1">
              <div className="relative aspect-[3/2] w-full overflow-hidden rounded-[12px]">
                <img
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  alt="Patients"
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                  <div className="text-3xl font-bold text-white">{patientCount}</div>
                  <div className="text-sm text-green-300 font-medium flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> +12% growth
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-shrink-0 items-center justify-between font-mono text-foreground">
              <div className="text-sm font-semibold uppercase tracking-wider">Total Patients</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Users className="h-3 w-3" /> Active
              </div>
            </div>
          </div>
        </CometCard>

        <CometCard>
          <div className="flex w-full cursor-pointer flex-col items-stretch rounded-[16px] border border-primary/20 bg-card p-4 shadow-sm hover:shadow-md transition-all">
            <div className="flex-1">
              <div className="relative aspect-[3/2] w-full overflow-hidden rounded-[12px]">
                <img
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  alt="Revenue"
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                  <div className="text-3xl font-bold text-white">${revenue.toLocaleString()}</div>
                  <div className="text-sm text-green-300 font-medium flex items-center gap-1">
                    <Activity className="h-3 w-3" /> Estimated
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-shrink-0 items-center justify-between font-mono text-foreground">
              <div className="text-sm font-semibold uppercase tracking-wider">Total Revenue</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <DollarSign className="h-3 w-3" /> YTD
              </div>
            </div>
          </div>
        </CometCard>
      </div>
    </div>
  );
}


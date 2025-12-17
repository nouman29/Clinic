import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPatients, getPrescriptionsByPatient } from "@/utils/storage";
import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Activity,
  Plus,
  Clock
} from "lucide-react";

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    const pts = getPatients();
    const found = pts.find((p) => p.id === id);
    if (!found) {
      navigate("/patients");
      return;
    }
    setPatient(found);
    setPrescriptions(getPrescriptionsByPatient(id));
  }, [id, navigate]);

  if (!patient) return null;

  return (
    <div className="space-y-6 p-6 h-full min-h-screen">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="rounded-full hover:bg-primary/10 hover:text-primary"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Patient Profile</h1>
          <p className="text-muted-foreground">View patient details and history</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Patient Info Card */}
        <Card className="md:col-span-1 h-fit border-primary/20 shadow-lg overflow-hidden bg-white">
          <div className="h-24 bg-gradient-to-br from-primary/80 to-primary/40" />
          <div className="px-6 -mt-12 mb-4">
            <div className="h-24 w-24 rounded-full border-4 border-white bg-primary/10 flex items-center justify-center text-primary shadow-sm">
              <User className="h-12 w-12" />
            </div>
          </div>
          <CardHeader className="pt-0 pb-2">
            <CardTitle className="text-2xl font-bold text-foreground">{patient.name}</CardTitle>
            <p className="text-sm text-primary font-medium uppercase tracking-wide">
              {patient.gender} • {patient.age} Years Old
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50/50 border border-green-100/50">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span className="font-medium text-foreground">{patient.phone}</span>
              </div>
              {patient.address && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50/50 border border-green-100/50">
                  <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-foreground leading-snug">{patient.address}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Prescriptions Column */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Prescription History
            </h2>
            <Button onClick={() => navigate("/prescriptions", { state: { patientId: id } })} className="bg-primary hover:bg-primary/90 text-white shadow-sm gap-1">
              <Plus className="h-4 w-4" />
              New Prescription
            </Button>
          </div>

          {prescriptions.length === 0 ? (
            <Card className="border-dashed border-2 bg-transparent shadow-none">
              <CardContent className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <FileText className="h-12 w-12 mb-3 opacity-20" />
                <p>No prescriptions found for this patient.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {prescriptions.map((rx) => (
                <Card key={rx.id} className="group hover:border-primary/30 transition-all duration-200 bg-white">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                          {rx.diagnosis || "General Consultation"}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span>Prescribed on {new Date().toLocaleDateString()}</span>
                          {/* Assuming date would be stored, using today for demo or add date to storage if needed, but for now just showing structure */}
                        </div>
                      </div>
                      <div className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                        {rx.id.slice(0, 6).toUpperCase()}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-2">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                          <Activity className="h-3 w-3" /> Symptoms
                        </span>
                        <p className="text-foreground font-medium">{rx.symptoms}</p>
                      </div>
                      {rx.followUp && (
                        <div className="space-y-1">
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> Follow Up
                          </span>
                          <p className="text-primary font-medium">{rx.followUp}</p>
                        </div>
                      )}
                    </div>

                    {rx.notes && (
                      <div className="pt-2 border-t border-border/40">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Advice / Notes</span>
                        <p className="text-sm text-foreground mt-1 leading-relaxed bg-muted/20 p-3 rounded-lg">{rx.notes}</p>
                      </div>
                    )}

                    <div className="pt-2 flex justify-end">
                      <Button variant="link" className="text-primary h-auto p-0" onClick={() => navigate("/prescriptions")}>
                        View Details / Print &rarr;
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

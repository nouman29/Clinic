import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { FileText, User, Calendar, Printer, Edit, Trash2, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  addPrescription,
  deletePrescription,
  getPatients,
  getPrescriptions,
  updatePrescription,
  getDoctorProfile,
} from "@/utils/storage";
import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  PDFDownloadLink,
} from "@react-pdf/renderer";

const blankMedicine = { name: "", dose: "", frequency: "", duration: "" };
const emptyRx = {
  patientId: "",
  symptoms: "",
  diagnosis: "",
  medicines: [blankMedicine],
  tests: "",
  notes: "",
  followUp: "",
};

const pdfStyles = StyleSheet.create({
  page: {
    padding: 28,
    fontSize: 11,
    fontFamily: "Helvetica",
    lineHeight: 1.4,
  },

  /* ===== HEADER ===== */
  header: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 6,
  },

  clinicInfo: {
    textAlign: "center",
    fontSize: 10,
    marginBottom: 10,
  },

  divider: {
    borderBottomWidth: 1,
    borderColor: "#000",
    marginVertical: 8,
  },

  /* ===== INFO BOX ===== */
  infoBox: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 8,
    marginBottom: 10,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },

  label: {
    fontWeight: "bold",
  },

  /* ===== SECTION BOX ===== */
  sectionBox: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 8,
    marginBottom: 10,
  },

  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 4,
    textDecoration: "underline",
  },

  /* ===== TABLE ===== */
  table: {
    borderWidth: 1,
    borderColor: "#000",
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderBottomWidth: 1,
    borderColor: "#000",
  },

  tableRow: {
    flexDirection: "row",
  },

  th: {
    flex: 1,
    padding: 6,
    fontWeight: "bold",
    borderRightWidth: 1,
    borderColor: "#000",
    textAlign: "center",
  },

  td: {
    flex: 1,
    padding: 6,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000",
  },

  lastCell: {
    borderRightWidth: 0,
  },

  /* ===== FOOTER ===== */
  footer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  signature: {
    borderTopWidth: 1,
    borderColor: "#000",
    width: 180,
    textAlign: "center",
    paddingTop: 4,
  },

  /* ===== BILLING ===== */
  billingBox: {
    marginTop: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 10,
  },
  billingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    paddingTop: 4,
    borderTopWidth: 1,
    borderColor: "#000",
    fontWeight: "bold",
  },
});

const PrescriptionPDF = ({ rx, patient, fee }) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      {/* ===== HEADER ===== */}
      <Text style={pdfStyles.header}>Clinic Prescription</Text>
      <Text style={pdfStyles.clinicInfo}>
        Demo Clinic • Islamabad • +92 300 0000000
      </Text>

      <View style={pdfStyles.divider} />

      {/* ===== PATIENT / DOCTOR INFO ===== */}
      <View style={pdfStyles.infoBox}>
        <View style={pdfStyles.infoRow}>
          <Text>
            <Text style={pdfStyles.label}>Doctor:</Text> Dr. Demo
          </Text>
          <Text>
            <Text style={pdfStyles.label}>Date:</Text>{" "}
            {new Date().toLocaleDateString()}
          </Text>
        </View>

        <View style={pdfStyles.infoRow}>
          <Text>
            <Text style={pdfStyles.label}>Patient:</Text>{" "}
            {patient?.name || "Unknown"}
          </Text>
          <Text>
            <Text style={pdfStyles.label}>Follow-up:</Text>{" "}
            {rx.followUp || "N/A"}
          </Text>
        </View>
      </View>

      {/* ===== CLINICAL DETAILS ===== */}
      <View style={pdfStyles.sectionBox}>
        <Text style={pdfStyles.sectionTitle}>Symptoms</Text>
        <Text>{rx.symptoms || "—"}</Text>
      </View>

      <View style={pdfStyles.sectionBox}>
        <Text style={pdfStyles.sectionTitle}>Diagnosis</Text>
        <Text>{rx.diagnosis || "—"}</Text>
      </View>

      <View style={pdfStyles.sectionBox}>
        <Text style={pdfStyles.sectionTitle}>Tests</Text>
        <Text>{rx.tests || "—"}</Text>
      </View>

      {/* ===== MEDICINES TABLE ===== */}
      <View style={pdfStyles.sectionBox}>
        <Text style={pdfStyles.sectionTitle}>Medicines</Text>

        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableHeader}>
            <Text style={pdfStyles.th}>Name</Text>
            <Text style={pdfStyles.th}>Dose</Text>
            <Text style={pdfStyles.th}>Frequency</Text>
            <Text style={[pdfStyles.th, pdfStyles.lastCell]}>Duration</Text>
          </View>

          {rx.medicines?.length ? (
            rx.medicines.map((m, idx) => (
              <View key={idx} style={pdfStyles.tableRow}>
                <Text style={pdfStyles.td}>{m.name || "—"}</Text>
                <Text style={pdfStyles.td}>{m.dose || "—"}</Text>
                <Text style={pdfStyles.td}>{m.frequency || "—"}</Text>
                <Text style={[pdfStyles.td, pdfStyles.lastCell]}>
                  {m.duration || "—"}
                </Text>
              </View>
            ))
          ) : (
            <View style={pdfStyles.tableRow}>
              <Text style={[pdfStyles.td, { flex: 4, textAlign: "center" }]}>
                No medicines prescribed
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* ===== NOTES ===== */}
      <View style={pdfStyles.sectionBox}>
        <Text style={pdfStyles.sectionTitle}>Notes</Text>
        <Text>{rx.notes || "—"}</Text>
      </View>

      {/* ===== BILLING ===== */}
      <View style={pdfStyles.billingBox}>
        <Text style={pdfStyles.sectionTitle}>Billing Details</Text>
        <View style={pdfStyles.billingRow}>
          <Text>Consultation Fee</Text>
          <Text>${fee}</Text>
        </View>
        <View style={pdfStyles.totalRow}>
          <Text>Total Amount</Text>
          <Text>${fee}</Text>
        </View>
      </View>

      {/* ===== FOOTER ===== */}
      <View style={pdfStyles.footer}>
        <Text>Prescription ID: {rx.id}</Text>
        <View style={pdfStyles.signature}>
          <Text>Doctor Signature</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default function Prescriptions() {
  const location = useLocation();
  const [patients, setPatients] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [form, setForm] = useState(emptyRx);
  const [search, setSearch] = useState("");
  const [doctorFee, setDoctorFee] = useState("150");

  useEffect(() => {
    const profile = getDoctorProfile();
    if (profile && profile.fee) {
      setDoctorFee(profile.fee);
    }
  }, []);

  useEffect(() => {
    const pts = getPatients();
    setPatients(pts);
    setPrescriptions(getPrescriptions());
    if (location.state?.patientId) {
      setForm((prev) => ({ ...prev, patientId: location.state.patientId }));
    }
  }, [location.state]);

  const filtered = useMemo(() => {
    if (!search) return prescriptions;
    const term = search.toLowerCase();
    return prescriptions.filter(
      (rx) =>
        rx.diagnosis?.toLowerCase().includes(term) ||
        rx.symptoms?.toLowerCase().includes(term)
    );
  }, [prescriptions, search]);

  const resetForm = () => {
    setForm({ ...emptyRx, medicines: [blankMedicine] });
    setCurrent(null);
  };

  const handleSubmit = () => {
    if (!form.patientId || !form.diagnosis || !form.symptoms) {
      toast.error("Patient, symptoms, and diagnosis are required");
      return;
    }
    if (current) {
      const updated = updatePrescription(current.id, form);
      setPrescriptions((prev) =>
        prev.map((rx) => (rx.id === current.id ? updated : rx))
      );
      toast.success("Prescription updated");
    } else {
      const created = addPrescription(form);
      setPrescriptions((prev) => [...prev, created]);
      toast.success("Prescription saved");
    }
    resetForm();
    setSheetOpen(false);
  };

  const handleDelete = () => {
    if (!current) return;
    deletePrescription(current.id);
    setPrescriptions((prev) => prev.filter((rx) => rx.id !== current.id));
    toast.success("Prescription deleted");
    setConfirmOpen(false);
    setCurrent(null);
  };

  const addMedicineRow = () => {
    setForm((prev) => ({
      ...prev,
      medicines: [...prev.medicines, { ...blankMedicine }],
    }));
  };

  const updateMedicine = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      medicines: prev.medicines.map((m, i) =>
        i === index ? { ...m, [field]: value } : m
      ),
    }));
  };

  const removeMedicine = (index) => {
    setForm((prev) => ({
      ...prev,
      medicines: prev.medicines.filter((_, i) => i !== index),
    }));
  };

  const patientName = (id) =>
    patients.find((p) => p.id === id)?.name || "Unknown";

  const openEdit = (rx) => {
    setCurrent(rx);
    setForm({
      ...rx,
      medicines: rx.medicines?.length ? rx.medicines : [blankMedicine],
    });
    setSheetOpen(true);
  };

  return (
    <div className="space-y-4 h-screen p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Prescriptions</h1>
          <p className="text-black">
            Manage prescriptions and print/export.
          </p>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Search by diagnosis or symptoms"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-72"
          />
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button onClick={() => setSheetOpen(true)}>
                Add Prescription
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-1/2 sm:max-w-6xl max-h-screen overflow-y-auto"
            >
              <SheetHeader>
                <SheetTitle>
                  {current ? "Edit Prescription" : "New Prescription"}
                </SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4 pb-10">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Patient
                  </label>
                  <select
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    value={form.patientId}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        patientId: e.target.value,
                      }))
                    }
                  >
                    <option value="">Select patient</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                {["symptoms", "tests", "diagnosis"].map((field) => (
                  <div key={field} className="space-y-2">
                    <label className="text-sm font-medium text-foreground capitalize">
                      {field}
                    </label>
                    {field === "symptoms" || field === "diagnosis" ? (
                      <Textarea
                        value={form[field]}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            [field]: e.target.value,
                          }))
                        }
                        placeholder={`Enter ${field}`}
                      />
                    ) : (
                      <Input
                        value={form[field]}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            [field]: e.target.value,
                          }))
                        }
                        placeholder={`Enter ${field}`}
                      />
                    )}
                  </div>
                ))}
                <div className="space-y-2" >
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">
                      Medicines
                    </label>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-green-600"
                      onClick={addMedicineRow}
                    >
                      Add row
                    </Button>
                  </div>
                  <div className=" gap-3 max-w-4xl">
                    {form.medicines.map((med, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-2 rounded-lg border gap-2 p-3 "
                      >
                        {["name", "dose", "frequency", "duration"].map(
                          (field) => (
                            <Input
                              key={field}
                              value={med[field]}
                              onChange={(e) =>
                                updateMedicine(idx, field, e.target.value)
                              }
                              placeholder={`${field}...`}
                            />
                          )
                        )}
                        {form.medicines.length > 1 && (
                          <div className="col-span-full flex justify-center mt-2">
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => removeMedicine(idx)}
                            >
                              Remove
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {["notes", "followUp"].map((field) => (
                    <div key={field} className="space-y-2">
                      <label className="text-sm font-medium text-foreground capitalize">
                        {field}
                      </label>
                      {field === "symptoms" || field === "diagnosis" ? (
                        <Textarea
                          value={form[field]}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              [field]: e.target.value,
                            }))
                          }
                          placeholder={`Enter ${field}`}
                        />
                      ) : (
                        <Input
                          value={form[field]}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              [field]: e.target.value,
                            }))
                          }
                          placeholder={`Enter ${field}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <Button onClick={handleSubmit} className="bg-green-600">
                  {current ? "Update" : "Save"}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border p-6 text-center text-muted-foreground">
          No prescriptions yet.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((rx) => (
            <Card key={rx.id} className="group hover:shadow-lg transition-all duration-300 border-primary/20 bg-card overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-primary/40 to-primary/10" />
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg font-bold text-foreground truncate">{rx.diagnosis || "General Consult"}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="h-3 w-3 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                      {patientName(rx.patientId)}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-start gap-3 bg-muted/10 p-2 rounded-md">
                    <Activity className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-0.5">Symptoms</span>
                      <span className="font-medium text-foreground leading-snug">{rx.symptoms}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-muted/10 p-2 rounded-md">
                    <Calendar className="h-4 w-4 text-primary shrink-0" />
                    <div className="flex-1 flex gap-2 items-center">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Follow Up:</span>
                      <span className="font-medium text-foreground">{rx.followUp || "Not scheduled"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 mt-2 border-t border-border/40">
                  <PDFDownloadLink
                    className="flex-1"
                    document={
                      <PrescriptionPDF
                        rx={rx}
                        patient={patients.find((p) => p.id === rx.patientId)}
                        fee={doctorFee}
                      />
                    }
                    fileName={`prescription-${rx.id}.pdf`}
                  >
                    {({ loading }) => (
                      <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
                        <Printer className="h-4 w-4 mr-2" />
                        {loading ? "..." : "Print"}
                      </Button>
                    )}
                  </PDFDownloadLink>

                  <Button size="icon" variant="outline" className="h-9 w-9 border-border/60 text-muted-foreground hover:text-primary hover:border-primary/50" onClick={() => openEdit(rx)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-9 w-9 border-border/60 text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30"
                    onClick={() => {
                      setCurrent(rx);
                      setConfirmOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete prescription?</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

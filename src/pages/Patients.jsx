import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { addPatient, deletePatient, getPatients, updatePatient } from "@/utils/storage";
import { User, Phone, MapPin, Edit, Trash2 } from "lucide-react";

const emptyForm = { name: "", age: "", gender: "", phone: "", address: "" };

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    setPatients(getPatients());
  }, []);

  const filtered = useMemo(() => {
    return patients.filter((p) => {
      const term = search.toLowerCase();
      return p.name?.toLowerCase().includes(term) || p.phone?.toLowerCase().includes(term);
    });
  }, [patients, search]);

  const handleSubmit = () => {
    if (!form.name || !form.age || !form.gender || !form.phone) {
      toast.error("Please fill required fields");
      return;
    }
    if (current) {
      const updated = updatePatient(current.id, form);
      setPatients((prev) => prev.map((p) => (p.id === current.id ? updated : p)));
      toast.success("Patient updated");
    } else {
      const created = addPatient(form);
      setPatients((prev) => [...prev, created]);
      toast.success("Patient added");
    }
    setForm(emptyForm);
    setCurrent(null);
    setSheetOpen(false);
  };

  const handleDelete = () => {
    if (!current) return;
    deletePatient(current.id);
    setPatients((prev) => prev.filter((p) => p.id !== current.id));
    toast.success("Patient deleted");
    setConfirmOpen(false);
    setCurrent(null);
  };

  const openEdit = (patient) => {
    setCurrent(patient);
    setForm({ name: patient.name, age: patient.age, gender: patient.gender, phone: patient.phone, address: patient.address || "" });
    setSheetOpen(true);
  };

  const openAdd = () => {
    setCurrent(null);
    setForm(emptyForm);
    setSheetOpen(true);
  };

  return (
    <div className="space-y-4 h-screen p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Patients</h1>
          <p className="text-black">Manage patient records.</p>
        </div>
        <div className="flex gap-2">
          <Input placeholder="Search by name or phone" value={search} onChange={(e) => setSearch(e.target.value)} className="w-64" />
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button onClick={openAdd}>Add Patient</Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-1/2 sm:max-w-2xl max-h-screen overflow-y-auto">
              <SheetHeader>
                <SheetTitle>{current ? "Edit Patient" : "Add Patient"}</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                {["name", "age", "gender", "phone", "address"].map((field) => (
                  <div key={field} className="space-y-2">
                    <label className="text-sm font-medium capitalize text-foreground">{field}</label>
                    <Input
                      value={form[field]}
                      onChange={(e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))}
                      placeholder={field === "age" ? "30" : `Enter ${field}`}
                    />
                  </div>
                ))}
                <Button onClick={handleSubmit}>{current ? "Update" : "Save"}</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border p-6 text-center text-black">No patients yet.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((patient) => (
            <Card key={patient.id} className="group hover:shadow-lg transition-all duration-300 border-primary/20 bg-card overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-primary/40 to-primary/10" />
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <User className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg font-bold text-foreground truncate">{patient.name}</CardTitle>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mt-1">
                    {patient.gender} • {patient.age} Years
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-center gap-3 bg-muted/10 p-2 rounded-md">
                    <Phone className="h-4 w-4 text-primary shrink-0" />
                    <span className="font-medium text-foreground">{patient.phone}</span>
                  </div>
                  {patient.address && (
                    <div className="flex items-start gap-3 bg-muted/10 p-2 rounded-md">
                      <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span className="line-clamp-2 text-foreground">{patient.address}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-3 mt-2 border-t border-border/40">
                  <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm" asChild>
                    <Link to={`/patients/${patient.id}`}>View Profile</Link>
                  </Button>
                  <Button size="icon" variant="outline" className="h-9 w-9 border-border/60 text-muted-foreground hover:text-primary hover:border-primary/50" onClick={() => openEdit(patient)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-9 w-9 border-border/60 text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30"
                    onClick={() => {
                      setCurrent(patient);
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
            <DialogTitle>Delete patient?</DialogTitle>
            <DialogDescription>This will also remove related prescriptions.</DialogDescription>
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


import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function Signup() {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Step 1: Basic Info
    const [basicInfo, setBasicInfo] = useState({
        name: "",
        email: "",
        age: "",
        password: "",
        role: ""
    });

    // Step 2: Role-Specific Info
    const [doctorInfo, setDoctorInfo] = useState({
        specialization: "",
        experience: "",
        availability: {
            days: [],
            workingHours: { start: "09:00", end: "17:00" }
        },
        consultationFee: ""
    });

    const [nurseInfo, setNurseInfo] = useState({
        department: "",
        shift: "Morning"
    });

    const [patientInfo, setPatientInfo] = useState({
        medicalHistory: "",
        allergies: "",
        bloodGroup: ""
    });

    const handleBasicChange = (e) => {
        setBasicInfo({ ...basicInfo, [e.target.name]: e.target.value });
    };

    const handleRoleSpecificChange = (setter, state, e) => {
        setter({ ...state, [e.target.name]: e.target.value });
    };

    const handleDoctorDayChange = (day) => {
        const currentDays = doctorInfo.availability.days;
        const newDays = currentDays.includes(day)
            ? currentDays.filter((d) => d !== day)
            : [...currentDays, day];

        setDoctorInfo({
            ...doctorInfo,
            availability: { ...doctorInfo.availability, days: newDays }
        });
    };

    const handleDoctorHourChange = (e) => {
        setDoctorInfo({
            ...doctorInfo,
            availability: {
                ...doctorInfo.availability,
                workingHours: { ...doctorInfo.availability.workingHours, [e.target.name]: e.target.value }
            }
        });
    };

    const nextStep = (e) => {
        e.preventDefault();
        const { name, email, age, password, role } = basicInfo;
        if (!name || !email || !age || !password || !role) {
            toast.error("Please fill in all basic fields");
            return;
        }
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        if (role === 'admin') {
            handleSubmit(e);
        } else {
            setStep(2);
        }
    };

    const handleSubmit = async (e) => {
        e && e.preventDefault();

        // Validation for step 2
        if (basicInfo.role === 'doctor') {
            if (doctorInfo.availability.days.length === 0) {
                toast.error("Please select at least one available day");
                return;
            }
        }

        setIsLoading(true);

        const payload = {
            ...basicInfo,
            age: parseInt(basicInfo.age),
            ...(basicInfo.role === 'doctor' && {
                ...doctorInfo,
                experience: parseInt(doctorInfo.experience),
                consultationFee: parseInt(doctorInfo.consultationFee)
            }),
            ...(basicInfo.role === 'nurse' && nurseInfo),
            ...(basicInfo.role === 'patient' && patientInfo),
        };

        try {
            const response = await fetch("http://localhost:5001/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || "Account created successfully!");
                navigate("/login");
            } else {
                toast.error(data.message || "Registration failed. Please try again.");
            }
        } catch (error) {
            console.error("Registration error:", error);
            toast.error("Unable to connect to server. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-cover bg-[url('https://plus.unsplash.com/premium_photo-1682130157004-057c137d96d5?q=80&w=2064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')]">
            <Card className="w-[450px] bg-white/95 shadow-2xl border-t-4 border-primary my-10">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold flex items-center justify-between">
                        Create Account
                        {step === 2 && <span className="text-sm font-normal text-muted-foreground">Step 2 of 2</span>}
                    </CardTitle>
                    <CardDescription>
                        {step === 1
                            ? "Enter your basic information to get started."
                            : `Complete your ${basicInfo.role} profile.`}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {step === 1 ? (
                        <form className="space-y-4" onSubmit={nextStep}>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Name</label>
                                <Input name="name" value={basicInfo.name} onChange={handleBasicChange} placeholder="John Doe" required />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Email</label>
                                <Input name="email" type="email" value={basicInfo.email} onChange={handleBasicChange} placeholder="john@example.com" required />
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Age</label>
                                    <Input name="age" type="number" value={basicInfo.age} onChange={handleBasicChange} placeholder="25" min="1" required />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Role</label>
                                    <select
                                        name="role"
                                        value={basicInfo.role}
                                        onChange={handleBasicChange}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        required
                                    >
                                        <option value="">Select role</option>
                                        <option value="doctor">Doctor</option>
                                        <option value="nurse">Nurse</option>
                                        <option value="patient">Patient</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Password</label>
                                <Input name="password" type="password" value={basicInfo.password} onChange={handleBasicChange} placeholder="••••••••" required />
                            </div>
                            <Button className="w-full mt-4" type="submit">
                                {basicInfo.role === 'admin' ? "Sign Up" : "Next Step"}
                            </Button>
                        </form>
                    ) : (
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {basicInfo.role === 'doctor' && (
                                <div className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <label className="text-sm font-medium">Specialization</label>
                                            <Input name="specialization" value={doctorInfo.specialization} onChange={(e) => handleRoleSpecificChange(setDoctorInfo, doctorInfo, e)} placeholder="Cardiology" required />
                                        </div>
                                        <div className="grid gap-2">
                                            <label className="text-sm font-medium">Fee ($)</label>
                                            <Input name="consultationFee" type="number" value={doctorInfo.consultationFee} onChange={(e) => handleRoleSpecificChange(setDoctorInfo, doctorInfo, e)} placeholder="100" required />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium">Experience (Years)</label>
                                        <Input name="experience" type="number" value={doctorInfo.experience} onChange={(e) => handleRoleSpecificChange(setDoctorInfo, doctorInfo, e)} placeholder="10" required />
                                    </div>

                                    <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                                        <label className="text-sm font-bold block border-b pb-1">Availability</label>

                                        <div className="grid gap-2">
                                            <label className="text-xs font-medium text-muted-foreground uppercase">Working Days</label>
                                            <div className="relative">
                                                <div
                                                    className="flex min-h-[40px] w-full flex-wrap gap-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer hover:border-primary transition-colors pr-8 overflow-hidden"
                                                    onClick={() => document.getElementById('days-dropdown').classList.toggle('hidden')}
                                                >
                                                    {doctorInfo.availability.days.length === 0 ? (
                                                        <span className="text-muted-foreground">Select days to tick...</span>
                                                    ) : (
                                                        doctorInfo.availability.days.map(day => (
                                                            <span key={day} className="bg-primary text-primary-foreground px-2 py-0.5 rounded-md text-xs flex items-center gap-1">
                                                                {day}
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => { e.stopPropagation(); handleDoctorDayChange(day); }}
                                                                    className="font-bold hover:text-black"
                                                                >
                                                                    ×
                                                                </button>
                                                            </span>
                                                        ))
                                                    )}
                                                    <div className="absolute right-2 top-2 text-muted-foreground pointer-events-none">
                                                        ▼
                                                    </div>
                                                </div>

                                                <div id="days-dropdown" className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-xl hidden animate-in fade-in slide-in-from-top-1 duration-200">
                                                    <div className="p-2 grid gap-1 max-h-[200px] overflow-y-auto">
                                                        {DAYS.map(day => (
                                                            <div
                                                                key={day}
                                                                className={`flex items-center justify-between p-2 rounded transition-colors cursor-pointer ${doctorInfo.availability.days.includes(day) ? 'bg-primary/10' : 'hover:bg-muted'}`}
                                                                onClick={() => handleDoctorDayChange(day)}
                                                            >
                                                                <span className={`text-sm select-none ${doctorInfo.availability.days.includes(day) ? 'font-medium text-primary' : ''}`}>{day}</span>
                                                                {doctorInfo.availability.days.includes(day) && (
                                                                    <span className="text-primary text-xs font-bold">✓</span>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="border-t p-2 text-center bg-muted/20">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="w-full text-xs h-7"
                                                            type="button"
                                                            onClick={(e) => { e.stopPropagation(); document.getElementById('days-dropdown').classList.add('hidden'); }}
                                                        >
                                                            Close
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mt-2">
                                            <div className="grid gap-1">
                                                <label className="text-xs font-medium text-muted-foreground uppercase">Start Time</label>
                                                <Input name="start" type="time" value={doctorInfo.availability.workingHours.start} onChange={handleDoctorHourChange} required />
                                            </div>
                                            <div className="grid gap-1">
                                                <label className="text-xs font-medium text-muted-foreground uppercase">End Time</label>
                                                <Input name="end" type="time" value={doctorInfo.availability.workingHours.end} onChange={handleDoctorHourChange} required />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {basicInfo.role === 'nurse' && (
                                <div className="space-y-4">
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium">Department</label>
                                        <Input name="department" value={nurseInfo.department} onChange={(e) => handleRoleSpecificChange(setNurseInfo, nurseInfo, e)} placeholder="ER" required />
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium">Shift</label>
                                        <select
                                            name="shift"
                                            value={nurseInfo.shift}
                                            onChange={(e) => handleRoleSpecificChange(setNurseInfo, nurseInfo, e)}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                            required
                                        >
                                            <option value="Morning">Morning (8am - 4pm)</option>
                                            <option value="Evening">Evening (4pm - 12am)</option>
                                            <option value="Night">Night (12am - 8am)</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {basicInfo.role === 'patient' && (
                                <div className="space-y-4">
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium">Medical History</label>
                                        <textarea
                                            name="medicalHistory"
                                            value={patientInfo.medicalHistory}
                                            onChange={(e) => handleRoleSpecificChange(setPatientInfo, patientInfo, e)}
                                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                            placeholder="Previous surgeries, conditions..."
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium">Allergies</label>
                                        <Input name="allergies" value={patientInfo.allergies} onChange={(e) => handleRoleSpecificChange(setPatientInfo, patientInfo, e)} placeholder="Penicillin, Peanuts..." />
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium">Blood Group</label>
                                        <select
                                            name="bloodGroup"
                                            value={patientInfo.bloodGroup}
                                            onChange={(e) => handleRoleSpecificChange(setPatientInfo, patientInfo, e)}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                            required
                                        >
                                            <option value="">Select Blood Group</option>
                                            <option value="A+">A+</option>
                                            <option value="A-">A-</option>
                                            <option value="B+">B+</option>
                                            <option value="B-">B-</option>
                                            <option value="AB+">AB+</option>
                                            <option value="AB-">AB-</option>
                                            <option value="O+">O+</option>
                                            <option value="O-">O-</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-2 mt-6">
                                <Button className="flex-1" variant="outline" type="button" onClick={() => setStep(1)} disabled={isLoading}>
                                    Back
                                </Button>
                                <Button className="flex-1" type="submit" disabled={isLoading}>
                                    {isLoading ? "Creating..." : "Sign Up"}
                                </Button>
                            </div>
                        </form>
                    )}
                    <div className="text-center text-sm text-muted-foreground mt-4">
                        Already have an account?{" "}
                        <Link to="/login" className="text-primary hover:underline font-medium">
                            Login here
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

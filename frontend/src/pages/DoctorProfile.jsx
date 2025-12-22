import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import doctorImage from "@/assets/doctor.png";
import { useState, useEffect } from "react";
import { getDoctorProfile, updateDoctorProfile } from "@/utils/storage";
import { Edit2, Check, X } from "lucide-react";

export default function DoctorProfile() {
    const [doctor, setDoctor] = useState({
        name: "Dr. Sarah Johnson",
        specialty: "Cardiologist",
        fee: "150",
        experience: "12 Years",
        rating: "4.9",
        patients: "1000+",
        bio: "Dr. Sarah Johnson is a renowned Cardiologist with over a decade of experience in diagnosing and treating heart conditions. She is dedicated to providing personalized care to her patients and is well-versed in the latest medical technologies.",
        education: [
            "MD in Cardiology - Harvard Medical School",
            "Residency at Mayo Clinic",
            "Fellowship at Johns Hopkins Hospital"
        ],
        contact: {
            email: "sarah.johnson@clinic.com",
            phone: "+1 (555) 123-4567"
        }
    });

    const [isEditingFee, setIsEditingFee] = useState(false);
    const [tempFee, setTempFee] = useState("");

    useEffect(() => {
        const savedProfile = getDoctorProfile();
        if (savedProfile && savedProfile.fee) {
            setDoctor(prev => ({ ...prev, fee: savedProfile.fee }));
        }
    }, []);

    const handleEditFee = () => {
        setTempFee(doctor.fee);
        setIsEditingFee(true);
    };

    const handleSaveFee = () => {
        updateDoctorProfile({ fee: tempFee });
        setDoctor(prev => ({ ...prev, fee: tempFee }));
        setIsEditingFee(false);
    };

    const handleCancelFee = () => {
        setIsEditingFee(false);
    };

    return (
        <div className="space-y-6 h-full p-6 min-h-screen">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Left Column - Profile Image & Quick Actions */}
                <div className="w-full md:w-1/3 lg:w-1/4 space-y-6">
                    <Card className="overflow-hidden border-none shadow-lg bg-white">
                        <div className="aspect-square relative">
                            <img
                                src={doctorImage}
                                alt={doctor.name}
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            />
                        </div>
                        <CardContent className="p-6 text-center bg-white">
                            <h2 className="text-2xl font-bold text-slate-800">{doctor.name}</h2>
                            <p className="text-primary font-medium mt-1">{doctor.specialty}</p>
                            <div className="mt-6 space-y-3">
                                <Button className="w-full bg-black shadow-md hover:shadow-lg transition-all">Book Appointment</Button>
                                <Button className="w-full bg-black shadow-md hover:shadow-lg transition-all">Contact Doctor</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-primary/5 border-none shadow-md bg-white">
                        <CardContent className="p-6 space-y-4 text-black">
                            <div className="flex justify-between items-center border-b border-primary/10 pb-3">
                                <span className="text-slate-600">Consultation Fee</span>
                                <div className="flex items-center gap-2">
                                    {isEditingFee ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl font-bold text-primary">$</span>
                                            <Input
                                                value={tempFee}
                                                onChange={(e) => setTempFee(e.target.value)}
                                                className="w-20 h-8"
                                            />
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600" onClick={handleSaveFee}>
                                                <Check className="h-4 w-4" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600" onClick={handleCancelFee}>
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl font-bold text-primary">${doctor.fee}</span>
                                            <Button size="icon" variant="ghost" className="h-6 w-6 text-slate-400 hover:text-primary" onClick={handleEditFee}>
                                                <Edit2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-between items-center border-b border-primary/10 pb-3">
                                <span className="text-slate-600">Experience</span>
                                <span className="font-semibold">{doctor.experience}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-600">Rating</span>
                                <span className="font-semibold flex items-center gap-1">
                                    ⭐ {doctor.rating}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Details */}
                <div className="flex-1 space-y-6">
                    <Card className="border-none shadow-md bg-white">
                        <CardHeader>
                            <CardTitle className="text-xl text-slate-800">Biography</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-600 leading-relaxed text-lg">{doctor.bio}</p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-md bg-white">
                        <CardHeader>
                            <CardTitle className="text-xl text-slate-800">Education & Training</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                {doctor.education.map((edu, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                                        <span className="text-slate-700 text-lg">{edu}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border-none shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-slate-50">
                            <CardHeader>
                                <CardTitle className="text-lg text-slate-700">Contact Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex items-center gap-3 text-slate-600">
                                    <span className="font-semibold">Email:</span>
                                    <a href={`mailto:${doctor.contact.email}`} className="hover:text-primary transition-colors">{doctor.contact.email}</a>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600">
                                    <span className="font-semibold">Phone:</span>
                                    <a href={`tel:${doctor.contact.phone}`} className="hover:text-primary transition-colors">{doctor.contact.phone}</a>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-slate-50">
                            <CardHeader>
                                <CardTitle className="text-lg text-slate-700">Availability</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-slate-600">
                                        <span>Mon - Fri</span>
                                        <span className="font-medium">9:00 AM - 5:00 PM</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600">
                                        <span>Saturday</span>
                                        <span className="font-medium">10:00 AM - 2:00 PM</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

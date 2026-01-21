import { Card } from "../../Library/Card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../Lib/select";
import { ScrollArea } from "@/Lib/scroll-area";
import React from 'react'

const BirthdaysCard = () => {
    const people = [
        { name: "Umair Ali", role: "Sr. Accountant in Finance", date: "17 Nov" },
        { name: "Hassan Hussain", role: "UX UI Designer", date: "17 Nov" },
        { name: "Sumaira Jameel", role: "Full stack Developer", date: "18 Nov" },
        { name: "Hira Fatima", role: "Team Lead Mobile Apps", date: "20 Nov" },
    ];
    return (
        <Card className="p-5 rounded-lg shadow-sm border border-gray-200 w-full">
            <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold text-lg">Birthdays & Anniversaries</h2>
                <Select>
                    <SelectTrigger className="w-28 h-8 text-sm bg-gray-50">
                        <SelectValue placeholder="Weekly" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <ScrollArea className="h-[190px] pr-1 ">
                {people.map((p, i) => (
                    <div key={i} className="flex items-center justify-between mb-1 border-b last:border-none pb-2">
                        <div className="flex items-center gap-3">
                            <img
                                src="https://firebasestorage.googleapis.com/v0/b/linkedin-clone-d79a1.appspot.com/o/man.png?alt=media&token=4b126130-032a-45b5-bea4-87adb0d096dc%22"
                                alt="avatar"
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                                <p className="font-medium text-sm flex items-center gap-1">
                                    {p.name}
                                    <span>🎂</span>
                                </p>
                                <p className="text-xs text-gray-500">{p.role}</p>
                            </div>
                        </div>
                        <span className="text-gray-500 text-sm">{p.date}</span>
                    </div>
                ))}
            </ScrollArea>
        </Card>
    )
}

export default BirthdaysCard


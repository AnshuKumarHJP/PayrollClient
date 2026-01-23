import React from "react";
import { FileText, Download } from "lucide-react";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "../../Library/Select"; // <-- ShadCN
import { Card, CardContent, CardHeader, CardTitle } from "../../Library/Card";

export default function SalarySlipCard() {
    return (
        <Card className="w-full">
            {/* TOP: Title + Dropdown */}
            <CardHeader className="">
                <CardTitle className="text-lg flex  justify-between items-center">Salary Slip
                    <Select defaultValue="current">
                        <SelectTrigger className="h-8 w-36 text-sm rounded-lg bg-gray-50 border-gray-200">
                            <SelectValue placeholder="Select Month" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="current">Current Month</SelectItem>
                            <SelectItem value="sep">September 2023</SelectItem>
                            <SelectItem value="aug">August 2023</SelectItem>
                            <SelectItem value="jul">July 2023</SelectItem>
                        </SelectContent>
                    </Select>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center my-4">
                    <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center shadow-inner">
                        <FileText className="w-12 h-12 text-red-500" />
                    </div>

                    <p className="mt-4 text-gray-700 text-sm">
                        Salary-Slip of Oct-2023
                    </p>
                </div>
                {/* Download Button */}
                <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-sm font-medium hover:bg-blue-700 transition">
                    <Download className="w-4 h-4" />
                    Download
                </button>
            </CardContent>

        </Card>
    );
}

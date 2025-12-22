import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../Lib/button";
import { Input } from "../Lib/input";
import { Label } from "../Lib/label";
import { Alert, AlertDescription } from "../Lib/alert";
import { AuthenticateUser } from "../Store/Auth/Action";

import PayrollVector from "../Image/PayrollVector.png";
import GoogleIcn from "../Image/google-color-svgrepo-com.svg";
import FullLogo from "../Image/hfactor-logo-dark.png";
import Loading from "../Component/Loading";
import AppIcon from "../Component/AppIcon";

const carouselSlides = [
  {
    quote: "Our payroll accuracy improved dramatically after switching...",
    name: "Anita Sharma",
    role: "HR Manager",
    title: "Ciel HR Services",
  },
  {
    quote:
      "Salary processing that used to take an entire day now finishes...",
    name: "Rajiv Menon",
    role: "Payroll Lead",
    title: "Panasonic Appliances",
  },
  {
    quote:
      "The automated tax calculations and statutory compliance features...",
    name: "Sonal Gupta",
    role: "Finance Controller",
    title: "Pana India Pvt. Ltd.",
  },
  {
    quote:
      "Employee self-service for payslips and reimbursements reduced HR tickets...",
    name: "Vikas R.",
    role: "HR Business Partner",
    title: "Integrum Technologies",
  },
];

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activeSlide, setActiveSlide] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [loginTriggered, setLoginTriggered] = useState(false);
  const nextSlide = () =>
    setActiveSlide((prev) => (prev + 1) % carouselSlides.length);
  const prevSlide = () =>
    setActiveSlide((prev) =>
      prev === 0 ? carouselSlides.length - 1 : prev - 1
    );

  // FIX: Correct loading location
  const authLoading = useSelector((state) => state.Auth?.LogResponce?.isLoading);
  const authError = useSelector((state) => state.Auth?.LogResponce?.error);
  const authSuccess = useSelector((state) => state.Auth?.LogResponce?.Success);

  const [formData, setFormData] = useState({ UserName: "15172", password: "test" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (loginTriggered && authSuccess) {
      navigate("/");
    }
  }, [authSuccess, loginTriggered]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoginTriggered(true);

    if (!formData.UserName || !formData.password) {
      setError("Please fill all fields");
      return;
    }

    dispatch(AuthenticateUser(formData));
  };

  return (
    <div className="min-h-screen flex bg-emerald-50 relative">

      {/* GLOBAL LOADING OVERLAY */}
      {authLoading && <Loading />}

      {/* LEFT PANEL */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-lg p-6 md:p-10 shadow-md rounded-tr-2xl rounded-bl-2xl">

          <div className="mb-8">
            <img src={FullLogo} alt="logo" className="h-6 md:h-10" />
          </div>

          <h2 className="text-md md:text-2xl font-bold text-gray-900">Welcome back</h2>
          <p className="text-xs md:textsm text-gray-500 mt-1">Please enter your details.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4 md:space-y-6">
            {(error || authError) && (
              <Alert variant="destructive">
                <AlertDescription>{error || authError}</AlertDescription>
              </Alert>
            )}

            {/* EMAIL */}
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="text"
                placeholder="Enter your email"
                value={formData.UserName}
                onChange={(e) =>
                  handleInputChange("UserName", e.target.value)
                }
              />
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* OPTIONS */}
            <div className="sm:flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600 text-xs">
                <input type="checkbox" className="cursor-pointer" />
                Remember for 30 days
              </label>

              <button className="text-purple-600 hover:underline text-xs">
                Forgot password
              </button>
            </div>

            {/* SIGN IN BUTTON */}
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              {authLoading ? "Signing in..." : "Sign In"}
            </Button>

            {/* GOOGLE LOGIN */}
            <Button variant="success" className="w-full flex items-center gap-3">
              <img src={GoogleIcn} className="w-5 h-5" />
              Sign in with Google
            </Button>
          </form>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="hidden lg:flex flex-1 bg-gray-100 rounded-l-3xl items-center justify-center relative overflow-hidden">

        <img
          src={PayrollVector}
          className="absolute inset-0 w-full h-full object-cover rounded-l-3xl"
          alt="Payroll Illustration"
        />

        <div className="absolute inset-0 bg-black/30 rounded-l-3xl"></div>

        <div className="absolute bottom-16 left-16 max-w-lg text-white p-4 select-none">

          <p className="text-3xl font-semibold leading-snug drop-shadow-xl">
            “{carouselSlides[activeSlide].quote}”
          </p>

          <div className="mt-6 opacity-90">
            <p className="font-bold text-lg">{carouselSlides[activeSlide].name}</p>
            <p className="text-sm">{carouselSlides[activeSlide].role}</p>
            <p className="text-sm">{carouselSlides[activeSlide].title}</p>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              onClick={prevSlide}
              className="h-10 w-10 border border-white/40 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-lg"
            >
              <AppIcon name={"ArrowLeft"}/>
            </button>
            <button
              onClick={nextSlide}
              className="h-10 w-10 border border-white/40 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-lg"
            >
              <AppIcon name={"ArrowRight"}/>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Login;

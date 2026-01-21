import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Button from "@/Library/Button";
import Input from "@/Library/Input";
import Label from "@/Library/Label";
import { AuthenticateUser } from "../Store/Auth/Action";

import PayrollVector from "../Image/LoginAvatar.png";
import PlayStore from "../Image/google-play.png";
import AppStore from "../Image/app-store.png";
import GoogleIcn from "../Image/google-color-svgrepo-com.svg";
import HfactorLogo from "../Image/hfactor-logo.png";

import Loading from "../Component/Loading";

import { Toaster } from "@/Library/Toaster";
import { useToast } from "@/Library/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { toast } = useToast(); // ✅ THIS IS WHAT YOU WANT

  const authLoading = useSelector((s) => s.Auth?.LogResponce?.isLoading);
  const authError = useSelector((s) => s.Auth?.LogResponce?.error);
  const authSuccess = useSelector((s) => s.Auth?.LogResponce?.Success);

  const [formData, setFormData] = useState({
    UserName: "15172",
    password: "test",
  });

  /* -------------------------
     EFFECTS
     ------------------------- */

  // API ERROR
  useEffect(() => {
    if (authError) {
      toast({
        variant: "danger",
        title: "Login failed",
        description: authError,
      });
    }
  }, [authError, toast]);

  // SUCCESS
  useEffect(() => {
    if (authSuccess) {
      toast({
        variant: "success",
        title: "Login successful",
        description: "Welcome back to Hfactor",
      });

      const timer = setTimeout(() => navigate("/"), 600);
      return () => clearTimeout(timer);
    }
  }, [authSuccess, navigate, toast]);

  /* -------------------------
     HANDLER
     ------------------------- */

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.UserName || !formData.password) {
      toast({
        variant: "warning",
        title: "Missing details",
        description: "Please fill all required fields",
      });
      return;
    }

    dispatch(AuthenticateUser(formData));
  };

  /* -------------------------
     RENDER
     ------------------------- */

  return (
    <div className="min-h-screen w-full flex bg-[#F5F6FA] relative">
      {/* TOASTER MOUNT */}
      <Toaster />

      {/* LOADING */}
      {authLoading && <Loading />}

      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-1/2 relative bg-gradient-to-b from-[#0E0B3D] to-[#130F40] text-white">
        <div className="absolute inset-0 flex flex-col pl-20 px-10 py-8">

          {/* Logo */}
          <div className="flex items-center">
            <img src={HfactorLogo} alt="Hfactor" className="h-10" />
          </div>

          {/* Illustration */}
          <div className="flex-1 flex items-center justify-start">
            <img
              src={PayrollVector}
              alt="illustration"
              className="max-w-sm ml-4"
            />
          </div>

          {/* Bottom Content */}
          <div className="pb-4">
            <h2 className="text-3xl font-semibold mb-2">
              Welcome to Hfactor!
            </h2>
            <p className="text-sm opacity-80 leading-relaxed">
              Streamline Your Workday.
              <br />
              Access Employee Services Anytime, Anywhere
            </p>

            <div className="flex gap-3 mt-20">
              <img src={PlayStore} className="h-9 cursor-pointer" />
              <img src={AppStore} className="h-9 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white px-8 py-10 rounded-xl shadow-md">

          <h2 className="text-center text-lg font-semibold mb-1">
            Login ✌️
          </h2>
          <p className="text-center text-sm text-gray-500 mb-8">
            Your personal workspace, just a click away.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <Label>Username</Label>
              <Input
                value={formData.UserName}
                onChange={(e) =>
                  setFormData({ ...formData, UserName: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Password</Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>

            <div className="text-right text-xs text-primary-500 cursor-pointer">
              Forgot Password?
            </div>

            <Button variant="primary" className="w-full text-white">
              {authLoading ? "Logging in..." : "Login"}
            </Button>

            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <Button
              variant="outline"
              className="w-full border-gray-300"
              icon={<img src={GoogleIcn} className="h-5 w-5" alt="Google" />}
            >
              Login with Google
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

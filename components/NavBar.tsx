"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "@/config/firebaseConfig";
import { toast } from "sonner";
import { useGetUserInfo } from "@/hooks/useGetUserInfo";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { isAuth } = useGetUserInfo();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const signInWithGoogle = async () => {
    const results = await signInWithPopup(auth, provider);

    const authInfo = {
      userId: results.user.uid,
      userEmail: results.user.email,
      name: results.user.displayName,
      isAuth: true,
    };

    if (typeof window !== "undefined") {
      localStorage.setItem("auth", JSON.stringify(authInfo));
    }

    window.location.reload();

    toast("Signed in successfully");
  };

  const signUserOut = async () => {
    try {
      await signOut(auth);

      if (typeof window !== "undefined") {
        localStorage.clear();
      }

      window.location.reload();

      toast("Logged out successfully.");
    } catch (error) {
      console.log(error)
    }
  };
  return (
    <nav className="bg-slate-900 shadow-md shadow-purple-900 border-b-2 border-purple-950 text-white">
      <div className="px-4 py-3 md:py-5 md:px-8">
        <div className="flex justify-between items-center">
          <Link href={"/"} className="text-lg font-semibold">
            CoreText
          </Link>

          {/* Desktop Menu */}
          {isAuth ? (
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/summarize" className="hover:bg-gray-600 px-4 py-2 rounded-md">
                Summarize
              </Link>
              <Link href="/history" className="hover:bg-gray-600 px-4 py-2 rounded-md">
                History
              </Link>
              <Button className="bg-purple-900" onClick={signUserOut}>Log Out</Button>
            </div>
          ) : (
            <div className="hidden md:block">
              <Button className="bg-purple-900" onClick={signInWithGoogle}>Sign In</Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 space-y-3">
            {isAuth ? (
              <>
                <Link
                  href="/summarize"
                  className="block hover:bg-gray-600 px-4 py-2 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Summarize
                </Link>
                <Link
                  href="/history"
                  className="block hover:bg-gray-600 px-4 py-2 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  History
                </Link>
                <Button 
                  className="bg-purple-900 w-full" 
                  onClick={() => {
                    signUserOut();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Log Out
                </Button>
              </>
            ) : (
              <Button 
                className="bg-purple-900 w-full" 
                onClick={() => {
                  signInWithGoogle();
                  setIsMobileMenuOpen(false);
                }}
              >
                Sign In
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
"use client";

import { useEffect, useState } from "react";
import AuthPanel from "../../components/auth/AuthPanel";

export default function AuthPage() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-animated">
      <div className="w-full max-w-md">
        <div className={`transition-all duration-500 ease-out transform ${animate ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}>
          <AuthPanel />
        </div>
      </div>
    </div>
  );
}

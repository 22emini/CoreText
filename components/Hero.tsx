import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

const Hero = () => {
  return (
    <div className="px-4  md:px-12 flex flex-col   bg-gradient-to-br from-slate-900 via-slate-950 to-black justify-center  items-center h-[95vh] relative mx-auto text-center">
      <h1 className="text-3xl md:text-[70px]  text-white lg:text-[78px] font-bold max-w-4xl">
        Summarize Smarter, Not Harder ⚡
      </h1>
      <p className="text-sm mt-2 md:text-base text-center text-white mb-8 max-w-4xl">
        Transform lengthy texts into clear, concise summaries instantly. Save
        time, stay informed, and focus on what truly matters with our AI-powered
        summarizer.
      </p>

      <Link href="/summarize">
        <Button >Get Started</Button>
      </Link>
    </div>
  )
}

export default Hero
"use client";

import { Button } from "@/components/ui/button";
import { db } from "@/config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

const SummaryPage = () => {
  const { textId } = useParams();
  const [data, setData] = useState({
    id: "",
    summary: "",
    userEmail: "",
    userText: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getSummary = async () => {
    setLoading(true);
    setError("");
    try {
      if (!textId) {
        throw new Error("Summary ID is missing. Please try generating a new summary.");
      }

      const docRef = doc(db, "Summaries", textId as string);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Validate required fields exist
        if (!data.summary || !data.userText) {
          throw new Error("Summary data is incomplete. Please try generating a new summary.");
        }
        setData({
          id: data.id || "",
          summary: data.summary,
          userEmail: data.userEmail || "",
          userText: data.userText
        });
      } else {
        throw new Error("No summary found. The summary may have been deleted or not saved correctly. Please try generating a new summary.");
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Error loading summary. Please try generating a new summary.";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error fetching summary:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (textId) {
      getSummary();
    } else {
      setError("Invalid summary ID. Please try generating a new summary.");
      toast.error("Invalid summary ID. Please try generating a new summary.");
    }
  }, [textId]);

  return (
    <div className="bg-gradient-to-br  from-slate-900 via-slate-950 to-black  flex flex-col justify-center items-center px-4 md:px-12 h-[90vh]">
      {loading ? (
        <div className="text-lg font-semibold py-10">Loading summary...</div>
      ) : error ? (
        <div className="text-red-500 font-semibold py-10">{error}</div>
      ) : (
        <>
          <div className="hidden md:flex pt-5 pb-2 justify-between items-center w-full text-lg font-semibold">
            <p   className="text-white">Your Text</p>
            <p className="text-white">Summary</p>
          </div>
          <div className="bg-slate-800 text-white w-full h-[70vh] shadow-md rounded-2xl hidden md:flex p-2">
            <textarea
              className="w-full rounded-l-2xl p-5 resize-none md:border-r focus:outline-none"
              disabled
              defaultValue={data.userText}
            />
            <textarea
              disabled
              className="w-full rounded-r-2xl p-5  resize-none focus:outline-none hidden md:inline-flex"
              defaultValue={data.summary}
            />
          </div>
          <div className=" w-full h-[70vh] shadow-md rounded-2xl md:hidden">
            <Tabs defaultValue="summary" className="h-full ">
              <TabsList className="rounded-md bg-slate-500">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="your-text">Your text</TabsTrigger>
              </TabsList>
              <TabsContent value="summary" className="p-3 text-white">
                <textarea
                  disabled
                  className="w-full h-full resize-none  bg-slate-800 rounded-2xl p-5 focus:outline-none"
                  defaultValue={data.summary}
                />
              </TabsContent>
              <TabsContent value="your-text" className="p-3 text-white rounded-2xl bg-slate-800">
                <textarea
                  disabled
                  className="w-full h-full resize-none   focus:outline-none"
                  defaultValue={data.userText}
                />
              </TabsContent>
            </Tabs>
          </div>
          <Link href="/summarize">
            <Button className="mt-8">Generate a New Summary</Button>
          </Link>
        </>
      )}
    </div>
  );
};

export default SummaryPage;
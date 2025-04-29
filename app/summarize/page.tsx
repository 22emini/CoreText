"use client"
import { Button } from '@/components/ui/button'
import React from 'react'
import { toast } from "sonner"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
   import { useState } from 'react'
import Image from 'next/image'
 import { signInWithPopup } from "firebase/auth";
import { auth,  db,  provider } from "@/config/firebaseConfig";
import { useGetUserInfo } from '@/hooks/useGetUserInfo'
import { chatSession } from '@/config/AIConfig'
import { Loader } from 'lucide-react'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'

const SummarizePage = () => {
    const [open, setOpen] = useState(false)
    const [userText, setUserText] = useState(""); // <-- Move this here!
    const {isAuth, userEmail} = useGetUserInfo();
    const[ loading, setLoading] = useState(false)
 const router = useRouter();
    const signInWithGoogle =  async () => {
        const results = await signInWithPopup(auth, provider)
        const authInfo = {
            name: results.user.displayName, // changed from userName to name
            userId: results.user.uid,
            userEmail: results.user.email,
            isAuth: true, // add isAuth property
        };
        if(typeof window !== 'undefined'){
            localStorage.setItem('auth', JSON.stringify(authInfo));
        }
    };
  
    const saveSummary = async (summary: string) => {
      if (!summary || !userText || !userEmail) {
        toast.error("Missing required information. Please try again.");
        return;
      }
  
      setLoading(true);
      try {
        const id = Date.now().toString();
        const summaryData = {
          userText,
          summary,
          userEmail,
          id,
          createdAt: new Date().toISOString(),
        };
        
        const docRef = doc(db, "Summaries", id);
        await setDoc(docRef, summaryData); // Fixed: passing summaryData to setDoc
        
        // Verify the document was saved
        const savedDoc = await getDoc(docRef);
        if (!savedDoc.exists()) {
          throw new Error("Failed to save summary. Please try again.");
        }
        
        toast.success("Summary saved successfully");
        router.push(`/summarize/${id}`);
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "Failed to save summary. Please try again.";
        toast.error(errorMessage);
        console.error("Error saving summary:", e);
      } finally {
        setLoading(false);
      }
    }

    const generateSummary = async () => {
      if (!isAuth) {
        setOpen(true);
        return;
      }
  
      if (!userText || userText.trim().length < 10) {
        toast.error("Please enter at least 10 characters to generate a summary.");
        return;
      }
  
      setLoading(true);
      try {
        const prompt = `Summarize the following text in a clear and concise way: ${userText}`;
        const result = await chatSession.sendMessage(prompt);
        const summaryText = await result.response.text();
        
        if (!summaryText || summaryText.trim().length < 1) {
          throw new Error("Failed to generate summary. Please try again.");
        }

        await saveSummary(summaryText);
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "An error occurred while generating the summary. Please try again.";
        toast.error(errorMessage);
        console.error("Error generating summary:", e);
        setLoading(false);
      }
    };
  
    
  return (
    <div className="bg-gradient-to-br pt- from-slate-900 via-slate-950 to-black  flex flex-col justify-center items-center px-4 md:px-12 h-[90vh]">
      <div className="bg-slate-800 text-white w-full h-[70vh] shadow-md rounded-2xl flex p-2">
        <textarea 
        onChange={(e)=> setUserText(e.target.value)}
        className="w-full rounded-l-2xl p-5 resize-none md:border-r focus:outline-none" placeholder='Enter or paste your and press "Genrate summary"' />
        <textarea 
        disabled
        className="w-full rounded-r-2xl p-5 resize-none focus:outline-none hidden md:inline-flex" />
        </div>
        <Button className="mt-8" disabled={loading} onClick={generateSummary}>
        {loading ? <div className='flex items-center justify-center '><Loader className='animate-spin' /></div> : "Generate Summary"}
      </Button>
        <Dialog open={open} onOpenChange={setOpen} >

  <DialogContent>
    <DialogHeader>
      <DialogTitle>Sign In with Google</DialogTitle>
      <DialogDescription>
      Please sign in to access the text summarization feature. Logging
      in ensures a personalized experience and saves your progress.
      </DialogDescription>

      <Button className='mt-8' onClick={signInWithGoogle}> 
        
      <div className="flex items-center space-x-3 ">
            <Image   width={20} height={19} src="/google.svg" alt="Lock Icon" />
           </div> Sign In with Google</Button>
    </DialogHeader>
  </DialogContent>
</Dialog>

    </div>
  )
}

export default SummarizePage
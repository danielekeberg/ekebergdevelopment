'use client';
import { useState, useEffect } from "react";
import Notes from "@/app/components/Notes";
import Login from "@/app/components/Login";
import Header from "@/app/components/Header";

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);

  const success = process.env.NEXT_PUBLIC_TEST;
  if(!success) {
      return;
  }

  useEffect(() => {
    if(localStorage.getItem("token") === success) {
      setLoggedIn(true);
    }
  }, [])
  return (
    <>
      {loggedIn ?
      <>
        <Header />
        <Notes />
      </>
      :
      <>
        <Login />
      </>}
    </>
  );
}

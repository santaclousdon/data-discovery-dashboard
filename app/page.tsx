"use client";

import { useEffect } from "react";

export default function Home() {
  const fetchCompanies = async () => {
    const res = await fetch("/api/companies");
    const data = await res.json();
    console.log(data);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return <div>Hello Dashboard</div>;
}

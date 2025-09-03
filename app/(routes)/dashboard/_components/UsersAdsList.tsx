"use client";

import Image from "next/image";
import React, { useState } from "react";
import signboard from "@/public/signboard.png";
import { Button } from "@/components/ui/button";
function UsersAdsList() {
  const [adsList, setAdsList] = useState([]);

  return (
    <div className="mt-5">
      <h2 className="font-bold text-2xl mb-2">Your Ads</h2>

      {adsList?.length === 0 && (
        <div className="p-5 border-dashed border-2 rounded-2xl flex flex-col items-center justify-center mt-6 gap-3">
          <Image
            src={signboard}
            alt="signboard"
            width={200}
            height={200}
            className="w-20"
          />
          <h2 className="text-xl">You haven't created any ads yet</h2>
          <Button>Create New Ads</Button>
        </div>
      )}
    </div>
  );
}

export default UsersAdsList;

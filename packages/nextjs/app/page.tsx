"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { VerifyYourself } from "~~/components/VerifyYourself";
import ProfessionalCredentials from "~~/components/ProfessionalCredentials";
import CVManagement from "~~/components/CVManagement";
import CopyLink from "~~/components/CopyLink";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-2">
        <div className="px-5 w-full">

          <VerifyYourself />

          {connectedAddress && <div className="flex justify-end mt-2 mb-2"><CopyLink link={`${window.location.origin}/experience/${connectedAddress}`} /></div>}
          {connectedAddress && <div className="mt-2"><CVManagement /></div>}
        </div>
      </div>
    </>
  );
};

export default Home;

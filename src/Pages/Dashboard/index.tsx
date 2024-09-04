import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import logo from "../../assets/logo/cryptoVote-logo.svg";
import { Input } from "@/components/ui/input";
import search from "../../assets/images/search-normal.svg";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import vote from "../../assets/images/votes.svg";
import chartBar from "../../assets/images/ChartBar.svg";
import upload from "../../assets/images/Upload.svg";
import support from "../../assets/images/support.svg";
import settings from "../../assets/images/settings.svg";
import mark from "../../assets/images/mark.svg";
import emptyState from "../../assets/images/empty-state.svg";
import { SunMedium, Bell, RotateCw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { TabsTrigger } from "@radix-ui/react-tabs";

type ElectionStatus = "active" | "ended" | "not_started";
interface Candidate {
  id: number;
  name: string;
  votes: number;
  platform: string;
}
interface Election {
  id: number;
  name: string;
  status: ElectionStatus;
  startDate: string;
  endDate: string;
  description: string;
  candidates: Candidate[];
}

const Dashboard: React.FC = () => {
  const [filter, setFilter] = useState<ElectionStatus | "all">("all");
  const [elections, setElections] = useState<Election[]>([]);

  const filteredElections = elections.filter((election: Election) => {
    if (filter === "all") return true;
    return election.status === filter;
  });

  return (
    <div className="flex min-h-screen bg-[#161617]">
      <Toaster />
      <aside className="hidden md:flex flex-col w-64 bg-customGray2 p-4 text-white">
        <div className="flex items-center gap-2">
          <img src={logo} alt="" />
          <span className="text-2xl font-bold ">Elektor</span>
        </div>
        <div className="mt-6">
          <div className="relative">
            <img
              src={search}
              alt="search"
              className="absolute top-1/2 -translate-y-1/2 left-3"
            />
            <Input
              type="text"
              placeholder="Search"
              className="text-customTextGray3 border-customBorder pl-8"
            />
          </div>
        </div>
        <nav className="space-y-2 mt-6">
          <Button variant="dark" className="w-full justify-start">
            <Home className="mr-2 h-4 w-4" /> Elections
          </Button>
          <Button variant="dark" className="w-full justify-start">
            <img src={vote} alt="" className="h-4 w-4 mr-2" />
            Votes
          </Button>
          <Button variant="dark" className="w-full justify-start">
            <img src={chartBar} alt="" className="h-4 w-4 mr-2" />
            Statistics
          </Button>
          <Button variant="dark" className="w-full justify-start">
            <img src={upload} alt="" className="h-4 w-4 mr-2" />
            Upload credentials
          </Button>
          <Button variant="dark" className="w-full justify-start">
            <img src={support} alt="" className="h-4 w-4 mr-2" />
            Support
          </Button>
          <Button variant="dark" className="w-full justify-start">
            <img src={settings} alt="" className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </nav>
        <div className="mt-auto">
          <div className="space-y-2 text-xs">
            <div className="flex justify-center">
              Privacy Policy | Terms of Service
            </div>
            <div className="italic flex justify-center text-customTextGray4 items-center">
              <span>
                <img src={mark} alt="mark" />
              </span>
              <span> Secured and verified by Blockchain</span>
            </div>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto px-4">
        <div className="container mx-auto text-white flex flex-col">
          <div className="md:hidden flex justify-between items-center mb-6 text-white">
            <h1 className="text-2xl font-bold">CryptoVote</h1>
          </div>
          <div className="border-b border-customGray py-5 px-4">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">Elections</h2>
              <div className="flex items-center gap-4 ">
                <div>
                  <SunMedium className="mr-2 h-5 w-5" />
                </div>
                <div>
                  <Bell className="mr-2 h-5 w-5" />
                </div>
                <div>
                  <Button variant="darkBtn" className="w-40 h-12">
                    Connect Wallet
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-customBorder mt-5 rounded-tr-[12px] rounded-tl-[12px]">
            <div className="py-5 px-6 flex justify-between items-center">
              <div>All Elections(X)</div>
              <div>
                <Select
                  value={filter}
                  onValueChange={(value) =>
                    setFilter(value as ElectionStatus | "all")
                  }
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter elections" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Elections</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="ended">Ended</SelectItem>
                    <SelectItem value="not_started">Upcoming</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="p-6 flex items-center justify-between border-b border-customGray bg-customeGray3 ">
            <div>
              <Tabs>
                <TabsList className="bg-customGray">
                  <TabsTrigger
                    value="elections"
                    className="border-r border-customGray px-4"
                  >
                    Ongoing
                  </TabsTrigger>
                  <TabsTrigger
                    value="candidates"
                    className=" border-r px-4 border-customGray"
                  >
                    Upcoming
                  </TabsTrigger>
                  <TabsTrigger
                    value="candidates"
                    className="px-4 border-customGray"
                  >
                    Participated
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <img
                  src={search}
                  alt="search"
                  className="absolute top-1/2 -translate-y-1/2 left-3"
                />
                <Input
                  type="text"
                  placeholder="Search by name or keyword"
                  className="text-customTextGray3 border-customBorder pl-8 h-10 w-64 bg-customGray"
                />
              </div>
              <div>
                <Button className="bg-customGray h-10">
                  <RotateCw className="w-3 h-3 mr-2" /> Refresh
                </Button>
              </div>
            </div>
          </div>
          <div className="flex-1 flex justify-center items-center bg-customeGray3">
            <div>
              <img src={emptyState} alt="" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

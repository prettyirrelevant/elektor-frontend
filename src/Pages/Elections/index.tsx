import {
  differenceInSeconds,
  format,
  formatDistanceToNow,
  parseISO,
} from "date-fns";
import {
  AlertCircle,
  Calendar,
  Check,
  ExternalLink,
  FileText,
  Github,
  Home,
  Info,
  Loader2,
  Share2,
  Twitter,
  Upload,
  User,
} from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAccount, useConnect, useDisconnect } from "wagmi";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tooltip as UITooltip,
} from "@/components/ui/tooltip";

type ElectionStatus = "active" | "ended" | "not_started";
type ActiveView =
  | "allElections"
  | "electionDetails"
  | "userElections"
  | "uploadCredentials";
type CredentialStatus = "not_uploaded" | "uploading" | "uploaded";

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

const MOCK_ELECTIONS: Election[] = [
  {
    id: 1,
    name: "City Council Election",
    status: "active",
    startDate: "2024-10-01",
    endDate: "2024-10-07",
    description:
      "Shape the future of our city. Vote for leaders who will address urban development, public services, and community welfare.",
    candidates: [
      {
        id: 1,
        name: "Alice Johnson",
        votes: 120,
        platform:
          "Focus on sustainable urban development and improving public transportation.",
      },
      {
        id: 2,
        name: "Bob Smith",
        votes: 80,
        platform: "Prioritize public safety and support for small businesses.",
      },
    ],
  },
  {
    id: 2,
    name: "School Board Election",
    status: "ended",
    startDate: "2024-09-01",
    endDate: "2024-09-07",
    description:
      "Influence education policies. Choose representatives who will improve curriculum, teacher support, and student resources.",
    candidates: [
      {
        id: 3,
        name: "Carol Williams",
        votes: 100,
        platform:
          "Emphasize education reform and environmental protection measures.",
      },
      {
        id: 4,
        name: "David Brown",
        votes: 90,
        platform:
          "Focus on improving school infrastructure and teacher training.",
      },
    ],
  },
  {
    id: 3,
    name: "Mayoral Election",
    status: "not_started",
    startDate: "2024-11-01",
    endDate: "2024-11-07",
    description:
      "Select the next leader of our city. Vote for a candidate with a vision for economic growth, public safety, and quality of life improvements.",
    candidates: [
      {
        id: 5,
        name: "Eva Martinez",
        votes: 0,
        platform: "Promote economic growth and create more job opportunities.",
      },
      {
        id: 6,
        name: "Frank Lee",
        votes: 0,
        platform: "Focus on improving city infrastructure and public services.",
      },
    ],
  },
];

const APP_VERSION = "1.0.0";

const Election: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>("allElections");
  const [elections, setElections] = useState<Election[]>([]);
  const [selectedElection, setSelectedElection] = useState<Election | null>(
    null
  );
  const [userElections, setUserElections] = useState<number[]>([]);
  const [filter, setFilter] = useState<ElectionStatus | "all">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingUserVotes, setIsLoadingUserVotes] = useState(false);
  const [credentialStatus, setCredentialStatus] =
    useState<CredentialStatus>("not_uploaded");
  const [credentialFile, setCredentialFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();

  useEffect(() => {
    fetchElections();
  }, []);

  useEffect(() => {
    if (activeView === "uploadCredentials") {
      checkExistingCredential();
    }
  }, [activeView]);

  const fetchElections = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setElections(MOCK_ELECTIONS);
    } catch (error) {
      toast.error("Failed to fetch elections. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserVotes = async () => {
    setIsLoadingUserVotes(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // Simulating fetching user votes
      const mockUserVotes = [1, 2]; // Assume the user has voted in elections with IDs 1 and 2
      setUserElections(mockUserVotes);
    } catch (error) {
      toast.error("Failed to fetch your voting history. Please try again.");
    } finally {
      setIsLoadingUserVotes(false);
    }
  };

  const handleConnect = async () => {
    try {
      await connect({ connector: connectors[0] });
    } catch (error) {
      toast.error("Failed to connect wallet. Please try again.");
    }
  };

  const handleDisconnect = () => {
    disconnect();
    toast.success("Wallet disconnected successfully.");
  };

  const handleVote = async (electionId: number, candidateId: number) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setElections((prevElections) =>
        prevElections.map((election) =>
          election.id === electionId
            ? {
                ...election,
                candidates: election.candidates.map((candidate) =>
                  candidate.id === candidateId
                    ? { ...candidate, votes: candidate.votes + 1 }
                    : candidate
                ),
              }
            : election
        )
      );
      toast.success("Your vote has been cast successfully!");
      setUserElections([...userElections, electionId]);
    } catch (error) {
      toast.error("Failed to submit your vote. Please try again.");
    }
  };

  const handleCredentialUpload = async () => {
    if (!credentialFile) {
      toast.error("Please select a file before uploading.");
      return;
    }
    setCredentialStatus("uploading");
    try {
      // Simulate file upload
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setCredentialStatus("uploaded");
      toast.success("Credential file uploaded successfully!");
    } catch (error) {
      setCredentialStatus("not_uploaded");
      toast.error("Failed to upload credential file. Please try again.");
    }
  };

  const checkExistingCredential = async () => {
    try {
      // Simulate API call to check for existing credential
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // For demonstration, let's assume a 50% chance of having an existing credential
      const hasExistingCredential = Math.random() < 0.5;

      if (hasExistingCredential) {
        setCredentialStatus("uploaded");
        toast.success("Existing credential found!");
      }
    } catch (error) {
      toast.error("Failed to check for existing credential. Please try again.");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCredentialFile(file);
    }
  };

  const handleShareVote = (electionId: number) => {
    const election = elections.find((e) => e.id === electionId);
    if (!election) return;

    const shareText = `I just voted in the "${election.name}"! #CryptoVote`;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(shareUrl, "_blank");
  };

  const filteredElections = elections.filter((election: Election) => {
    if (filter === "all") return true;
    return election.status === filter;
  });

  const getStatusColor = (status: ElectionStatus): string => {
    const colors = {
      active: "text-green-600",
      ended: "text-red-600",
      not_started: "text-blue-600",
    };
    return colors[status] || "text-gray-600";
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Toaster />
      <aside className="hidden md:flex flex-col w-64 bg-white p-4">
        <h1 className="text-2xl font-bold mb-6">CryptoVote</h1>
        <nav className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => setActiveView("allElections")}
          >
            <Home className="mr-2 h-4 w-4" /> Elections
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => {
              setActiveView("userElections");
              fetchUserVotes();
            }}
          >
            <User className="mr-2 h-4 w-4" /> My Votes
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => setActiveView("uploadCredentials")}
          >
            <Upload className="mr-2 h-4 w-4" /> Upload Credentials
          </Button>
        </nav>
        <div className="mt-auto">
          <div className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() =>
                window.open("https://github.com/your-repo", "_blank")
              }
            >
              <Github className="mr-2 h-4 w-4" /> GitHub{" "}
              <ExternalLink className="ml-auto h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() =>
                window.open("https://twitter.com/your-account", "_blank")
              }
            >
              <Twitter className="mr-2 h-4 w-4" /> Twitter{" "}
              <ExternalLink className="ml-auto h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() =>
                window.open("https://github.com/your-repo/issues", "_blank")
              }
            >
              <Info className="mr-2 h-4 w-4" /> Report an Issue{" "}
              <ExternalLink className="ml-auto h-4 w-4" />
            </Button>
          </div>
          <div className="mt-4 text-sm text-center text-gray-500">
            v{APP_VERSION}
          </div>
          {isConnected ? (
            <div className="mt-4">
              <span className="block mb-2 px-2 py-1 bg-gray-200 rounded-full text-center">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
              <Button
                onClick={handleDisconnect}
                variant="destructive"
                className="w-full"
              >
                Disconnect
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleConnect}
              variant="default"
              className="w-full mt-4"
            >
              Connect Wallet
            </Button>
          )}
        </div>
      </aside>

      <main className="flex-1 p-4 overflow-y-auto">
        <div className="container mx-auto">
          <div className="md:hidden flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">CryptoVote</h1>
          </div>
          <h2 className="text-3xl font-bold mb-6">
            {activeView === "allElections" && "Upcoming Elections"}
            {activeView === "electionDetails" && "Election Details"}
            {activeView === "userElections" && "My Voting History"}
            {activeView === "uploadCredentials" && "Upload Credentials"}
          </h2>

          {activeView === "allElections" && (
            <div>
              <Select
                value={filter}
                onValueChange={(value) =>
                  setFilter(value as ElectionStatus | "all")
                }
              >
                <SelectTrigger className="w-full sm:w-[180px] mb-4">
                  <SelectValue placeholder="Filter elections" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Elections</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="ended">Ended</SelectItem>
                  <SelectItem value="not_started">Upcoming</SelectItem>
                </SelectContent>
              </Select>
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, index) => (
                    <Card key={index} className="animate-pulse">
                      <CardHeader>
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                      </CardHeader>
                      <CardContent>
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                      </CardContent>
                      <CardFooter>
                        <div className="h-10 bg-gray-200 rounded w-1/3" />
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredElections.map((election) => (
                    <Card
                      key={election.id}
                      className="cursor-pointer hover:shadow-lg transition-shadow"
                    >
                      <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                          {election.name}
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${getStatusColor(election.status)}`}
                          >
                            {election.status === "active"
                              ? "Live"
                              : election.status === "ended"
                                ? "Closed"
                                : "Upcoming"}
                          </span>
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                          {election.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <TooltipProvider>
                          <UITooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center text-gray-600">
                                <Calendar className="mr-2 h-4 w-4" />
                                {formatDistanceToNow(
                                  parseISO(election.startDate),
                                  {
                                    addSuffix: true,
                                  }
                                )}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Starts:{" "}
                                {format(parseISO(election.startDate), "PPP")}
                              </p>
                              <p>
                                Ends:{" "}
                                {format(parseISO(election.endDate), "PPP")}
                              </p>
                            </TooltipContent>
                          </UITooltip>
                        </TooltipProvider>
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setSelectedElection(election);
                            setActiveView("electionDetails");
                          }}
                        >
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeView === "electionDetails" && selectedElection && (
            <ElectionDetails
              election={selectedElection}
              onVote={handleVote}
              hasVoted={userElections.includes(selectedElection.id)}
            />
          )}

          {activeView === "userElections" && (
            <Card className="border-none shadow-none bg-transparent">
              <CardHeader>
                <CardDescription className="text-gray-600 text-lg">
                  Review and share your participation in past elections
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingUserVotes ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, index) => (
                      <Card
                        key={index}
                        className="bg-white border border-gray-200 overflow-hidden"
                      >
                        <div className="p-4 flex items-center space-x-4">
                          <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                            <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
                          </div>
                          <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : userElections.length > 0 ? (
                  <div className="space-y-4">
                    {elections
                      .filter((e) => userElections.includes(e.id))
                      .map((election) => (
                        <Card
                          key={election.id}
                          className="bg-white border border-gray-200 hover:border-primary/50 transition-all cursor-pointer"
                          onClick={() => {
                            setSelectedElection(election);
                            setActiveView("electionDetails");
                          }}
                        >
                          <div className="p-4 flex items-center space-x-4">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                              <Check className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold text-gray-900 truncate">
                                {election.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                Voted{" "}
                                {formatDistanceToNow(
                                  parseISO(election.endDate),
                                  { addSuffix: true }
                                )}
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-shrink-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShareVote(election.id);
                              }}
                            >
                              <Share2 className="h-4 w-4 mr-2" />
                              Share
                            </Button>
                          </div>
                        </Card>
                      ))}
                  </div>
                ) : (
                  <Card className="bg-yellow-50 border-yellow-100">
                    <CardHeader>
                      <CardTitle className="text-yellow-800 flex items-center">
                        <AlertCircle className="h-5 w-5 mr-2" />
                        No voting history
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-yellow-700">
                        You haven't participated in any elections yet. Explore
                        active elections to make your voice heard!
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        onClick={() => setActiveView("allElections")}
                        className="text-yellow-800 border-yellow-300 hover:bg-yellow-100"
                      >
                        View Active Elections
                      </Button>
                    </CardFooter>
                  </Card>
                )}
              </CardContent>
            </Card>
          )}

          {activeView === "uploadCredentials" && (
            <Card>
              <CardHeader>
                <CardTitle>Upload Credentials</CardTitle>
                <CardDescription>
                  Upload your credential file to participate in elections
                </CardDescription>
              </CardHeader>
              <CardContent>
                {credentialStatus === "uploaded" ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-green-500" />
                      <span className="text-sm text-gray-700">
                        Credential file already uploaded.
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="credential-file">Credential File</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="credential-file"
                          type="file"
                          onChange={handleFileChange}
                          disabled={credentialStatus === "uploading"}
                          className="hidden"
                          ref={fileInputRef}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={credentialStatus === "uploading"}
                        >
                          {credentialFile ? "Change File" : "Select File"}
                        </Button>
                        {credentialFile && (
                          <span className="text-sm text-gray-500">
                            {credentialFile.name}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={handleCredentialUpload}
                      disabled={
                        credentialStatus === "uploading" || !credentialFile
                      }
                      className="w-full"
                    >
                      {credentialStatus === "uploading" ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Credential File
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

interface ElectionDetailsProps {
  election: Election;
  onVote: (electionId: number, candidateId: number) => Promise<void>;
  hasVoted: boolean;
}

const ElectionDetails: React.FC<ElectionDetailsProps> = ({
  election,
  onVote,
  hasVoted,
}) => {
  const [isVoteModalOpen, setIsVoteModalOpen] = useState<boolean>(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(
    null
  );
  const [countdown, setCountdown] = useState<string>("");
  const [isVoting, setIsVoting] = useState<boolean>(false);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const end = parseISO(election.endDate);
      const difference = differenceInSeconds(end, now);

      if (difference <= 0) {
        setCountdown("Election has ended");
      } else {
        const days = Math.floor(difference / (24 * 60 * 60));
        const hours = Math.floor((difference % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((difference % (60 * 60)) / 60);
        const seconds = difference % 60;
        setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s remaining`);
      }
    };

    if (election.status === "active") {
      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);
      return () => clearInterval(interval);
    }
  }, [election]);

  const handleVote = () => {
    if (selectedCandidate !== null) {
      setIsVoteModalOpen(false);
      setIsConfirmModalOpen(true);
    } else {
      toast.error("Please select a candidate before submitting your vote.");
    }
  };

  const confirmVote = async () => {
    if (selectedCandidate !== null) {
      setIsVoting(true);
      try {
        await onVote(election.id, selectedCandidate);
        setIsConfirmModalOpen(false);
      } catch (error) {
        // Error is handled in the parent component
      } finally {
        setIsVoting(false);
      }
    }
  };

  const renderActionButton = () => {
    if (hasVoted) {
      return <Button disabled>Vote Submitted</Button>;
    }
    switch (election.status) {
      case "not_started":
        return <Button disabled>Voting Not Yet Open</Button>;
      case "active":
        return (
          <Button onClick={() => setIsVoteModalOpen(true)}>
            Cast Your Vote
          </Button>
        );
      case "ended":
        return <Button disabled>Voting Closed</Button>;
      default:
        return null;
    }
  };

  const getStatusColor = (status: ElectionStatus): string => {
    const colors = {
      active: "text-green-600",
      ended: "text-red-600",
      not_started: "text-blue-600",
    };
    return colors[status] || "text-gray-600";
  };

  const chartColors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7300",
    "#0088FE",
    "#00C49F",
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {election.name}
          <span
            className={`text-xs px-2 py-1 rounded-full ${getStatusColor(election.status)}`}
          >
            {election.status === "active"
              ? "Live"
              : election.status === "ended"
                ? "Closed"
                : "Upcoming"}
          </span>
        </CardTitle>
        <CardDescription className="text-gray-600">
          {election.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center text-gray-600">
                  <Calendar className="mr-2 h-4 w-4" />
                  {election.status === "active" ? (
                    <span className="font-bold">{countdown}</span>
                  ) : (
                    formatDistanceToNow(parseISO(election.startDate), {
                      addSuffix: true,
                    })
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Starts: {format(parseISO(election.startDate), "PPP")}</p>
                <p>Ends: {format(parseISO(election.endDate), "PPP")}</p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">
            Current Voting Statistics
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={election.candidates} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Legend />
              <Bar dataKey="votes" fill={chartColors[0]}>
                {election.candidates.map((entry) => (
                  <Cell
                    key={`cell-${entry.id}`}
                    fill={chartColors[entry.id % chartColors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        {renderActionButton()}
      </CardFooter>

      <Dialog open={isVoteModalOpen} onOpenChange={setIsVoteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cast Your Vote</DialogTitle>
            <DialogDescription className="text-gray-600">
              Select a candidate to vote for in {election.name}
            </DialogDescription>
          </DialogHeader>
          <RadioGroup
            value={selectedCandidate?.toString()}
            onValueChange={(value) =>
              setSelectedCandidate(Number.parseInt(value))
            }
          >
            {election.candidates.map((candidate) => (
              <div key={candidate.id} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={candidate.id.toString()}
                  id={`candidate-${candidate.id}`}
                />
                <Label htmlFor={`candidate-${candidate.id}`}>
                  {candidate.name}
                </Label>
              </div>
            ))}
          </RadioGroup>
          <DialogFooter>
            <Button onClick={handleVote} variant="default">
              Submit Vote
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">Confirm Your Vote</DialogTitle>
          </DialogHeader>
          <div className="my-6 text-center">
            <p className="text-lg mb-2">You are voting for:</p>
            <p className="text-2xl font-bold">
              {
                election.candidates.find((c) => c.id === selectedCandidate)
                  ?.name
              }
            </p>
            <p className="text-sm text-gray-600 mt-1">in {election.name}</p>
          </div>
          <Alert variant="destructive" className="mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              <AlertDescription>
                Once confirmed, your vote is set in stone.
              </AlertDescription>
            </div>
          </Alert>
          <DialogFooter>
            <Button
              onClick={() => setIsConfirmModalOpen(false)}
              variant="outline"
              className="w-full sm:w-auto"
              disabled={isVoting}
            >
              Go Back
            </Button>
            <Button
              onClick={confirmVote}
              variant="default"
              className="w-full sm:w-auto"
              disabled={isVoting}
            >
              {isVoting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Confirming...
                </>
              ) : (
                "Confirm Vote"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default Election;

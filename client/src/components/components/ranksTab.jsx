import { useState, useEffect } from "react";
import { DownloadIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/redux/axiosInstance";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RankingsTable from "./rankTable";
import { useToast } from "@chakra-ui/react";

export default function RankingsTab() {
  const [numStartups, setNumStartups] = useState(3);
  const [selectedRound, setSelectedRound] = useState("");
  const [rounds, setRounds] = useState([]);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [roundsLoading, setRoundsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const toast = useToast();

  // Fetch rounds
  useEffect(() => {
    async function fetchRounds() {
      setRoundsLoading(true);
      try {
        const { data } = await axiosInstance.get("/rounds");
        data.map((round) => {
          round.id= round._id
          return round
        })
        setRounds(data);
      } catch (error) {
        console.error("Error fetching rounds:", error);
        toast({
          title: "Error",
          description: "Failed to fetch rounds",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setRoundsLoading(false)
      }
    }
    fetchRounds();
  }, [toast]);

  // Fetch results
  async function fetchResults() {
    if (!selectedRound) return;
    
    setIsLoading(true);
    try {
      const { data } = await axiosInstance.get("/results", {
        params: {
          round: selectedRound,
          limit: numStartups
        }
      });
      console.log("results", data)
      if (data) {
        toast({
          title: "Success",
          description: "Results loaded successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setResults(data);
      }  
    } catch (error) {
      console.error("Error fetching results:", error);
      toast({
        title: "Error",
        description: "Failed to fetch results",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Handle export
  async function handleExport() {
    setIsExporting(true);
    try {
      const { data } = await axiosInstance.get("/results/export", {
        params: {
          round: selectedRound,
          limit: numStartups
        },
        responseType: 'blob'
      });
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `rankings-${selectedRound}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error exporting results:", error);
      toast({
        title: "Error",
        description: "Failed to export rankings",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span>Get the top</span>
          <Input
            type="number"
            value={numStartups}
            onChange={(e) => setNumStartups(Number(e.target.value))}
            className="w-20"
            min={1}
          />
          <span>startups from round</span>
          <Select
            value={selectedRound}
            onValueChange={setSelectedRound}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder={!selectedRound && 'Select a round'} />
            </SelectTrigger>
            <SelectContent>
              {roundsLoading ? 
              <SelectItem className="flex justify-center items-center"><Loader2 className="mr-2 h-4 w-4 animate-spin" /></SelectItem>
              :rounds.map((round) => (
                <SelectItem key={round.id} value={round.id}>
                  {round.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={fetchResults}
            disabled={!selectedRound || isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit
          </Button>
        </div>

        <Button
          onClick={handleExport}
          disabled={isExporting}
          variant="outline"
        >
          {isExporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <DownloadIcon className="mr-2 h-4 w-4" />
          )}
          Export
        </Button>
      </div>

      <div className="bg-secondary/10 rounded-lg p-6">
        <RankingsTable rankings={results} loading={isLoading} />
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Stack,
  Input,
  Select,
  Text,
  Flex,
} from '@chakra-ui/react';
import { DownloadIcon } from 'lucide-react';
import RankingsTable from './rankTable';
import dummyData from './data';

const RankingsTab = () => {
  const [numStartups, setNumStartups] = useState(3); // Number of startups to display (rank-based)
  const [selectedRound, setSelectedRound] = useState(''); // Selected round
  const [rounds, setRounds] = useState([]); // Store rounds dynamically fetched

 
  // Dummy data for rounds
  const dummyRounds = ['Round 1', 'Round 2', 'Round 3', "Average"];

  // Dummy data for startups (with rankings per round)
    const dummyStartups = dummyData;

  // Fetch rounds dynamically (simulate API call)
  useEffect(() => {
    const fetchRounds = async () => {
      // Replace with API call for rounds
      const data = dummyRounds;
      setRounds(data);
    };
    fetchRounds();
  }, []);

  // Simulate API endpoints for fetching filtered data
// const fetchStartups = async () => {
//   const response = await fetch(`/api/startups?round=${round}&topCount=${topCount}`);
//   const data = await response.json();
//   setStartups(data);
// };


  // Fetch startups based on round selection
  const fetchStartupsByRound = (round) => {
    const filteredStartups = dummyStartups.filter((startup) => startup.round === round);
    return filteredStartups.slice(0, numStartups); // Slice based on the number of startups selected
  };

  const filteredStartups = selectedRound ? fetchStartupsByRound(selectedRound) : dummyStartups.slice(0, numStartups);

  // Handle export functionality (will trigger export action)
  const handleExport = () => {
    alert('Exporting startups data...');
    // Implement export logic (e.g., CSV download)
  };


  return (
    <Box>
      {/* Input for number of startups to display */}
      <Flex spacing="4"  marginY="10px" justifyContent='space-between' width='full'>
        <Stack direction="row" spacing="4"  marginY="10px" width="75%">
            <Text> Input the number of startups to be displayed (by rank):</Text>
            <Input
            placeholder="Top (number)"
            type="number"
            value={numStartups}
            w={"150px"}
            onChange={(e) => setNumStartups(Number(e.target.value))}
            />
            <Select
            placeholder="Select Round"
            value={selectedRound}
            w={"200px"}
            onChange={(e) => setSelectedRound(e.target.value)}
            >
            {rounds.map((round) => (
                <option key={round} value={round}>
                {round}
                </option>
            ))}
            </Select>
            <Button color="white" bg="black" onClick={() => {}}>
            Submit
            </Button>
        </Stack>

        {/* Export Button */}
        <Button leftIcon={<DownloadIcon />} color="white" bg="black" mx="2" onClick={handleExport} marginY="10px">
            Export
        </Button>

      </Flex>


      {/* Table */}
      <Box bg="blackAlpha.100" paddingY="8px" paddingX="10%" borderRadius="10px">
        <RankingsTable
          startups={filteredStartups}
        />
      </Box>

      {/* Modal for Import */}

      
    </Box>
  );
};

export default RankingsTab;

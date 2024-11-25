import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Heading,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  Flex,
} from '@chakra-ui/react';
import { AddIcon, DownloadIcon } from '@chakra-ui/icons';
import { Calendar} from "@/components/ui/calendar" // Ensure you have this library installed or replace with your preferred calendar component
import { ScheduleModal } from './schdeuleform';
import SpreadsheetLinkCard from '../components/importFromSpreadsheet';

const ScheduleTab = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [scheduleData, setScheduleData] = useState([]); // Schedules
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    selectedDate: new Date(),
    time: '',
    teamName: '',
    judge: '',
    room: '',
  });

  // Dummy data for schedules
  useEffect(() => {
    // Simulated API call - Replace this with actual fetch when backend is ready
    /*
    const fetchSchedules = async () => {
      try {
        const response = await fetch('/api/schedules'); // Replace with your API endpoint
        const data = await response.json();
        setScheduleData(data);
      } catch (error) {
        console.error('Error fetching schedule data:', error);
      }
    };
    fetchSchedules();
    */
    // Dummy schedule data
    const dummyData = [
        {
          startup: "Tech Innovators",
          judges: ["Judge Emily", "Judge Steve"],
          startDate: "2024-11-25",
          endDate: "2024-11-25",
          startTime: "10:00 AM",
          endTime: "11:00 AM",
          room: "Room 101",
          remoteLink: "https://example.com/tech-innovators",
          round: "Preliminary",
        },
        {
          startup: "GreenTech Solutions",
          judges: ["Judge Anna", "Judge David"],
          startDate: "2024-11-26",
          endDate: "2024-11-26",
          startTime: "1:00 PM",
          endTime: "2:00 PM",
          room: "Room 202",
          remoteLink: "https://example.com/greentech",
          round: "Semifinal",
        },
        {
          startup: "AI Pioneers",
          judges: ["Judge Sarah", "Judge Michael"],
          startDate: "2024-11-27",
          endDate: "2024-11-27",
          startTime: "9:00 AM",
          endTime: "10:00 AM",
          room: "Room 303",
          remoteLink: "https://example.com/ai-pioneers",
          round: "Final",
        },
        {
          startup: "Blockchain Builders",
          judges: ["Judge Chris", "Judge Pat"],
          startDate: "2024-11-28",
          endDate: "2024-11-28",
          startTime: "3:00 PM",
          endTime: "4:00 PM",
          room: "Room 404",
          remoteLink: "https://example.com/blockchain-builders",
          round: "Final",
        },
      ];
      
    setScheduleData(dummyData);
  }, []);

  const dummyStartups = [
    { id: "startup1", name: "Tech Innovators Inc." },
    { id: "startup2", name: "Green Future Solutions" },
    { id: "startup3", name: "NextGen AI Labs" },
    { id: "startup4", name: "Quantum Leap Ventures" },
  ];
  
  const dummyJudges = [
    { id: "judge1", name: "Alice Johnson" },
    { id: "judge2", name: "Dr. Robert Smith" },
    { id: "judge3", name: "Emily Davis" },
    { id: "judge4", name: "Michael Brown" },
    { id: "judge5", name: "Sophia Lee" },
  ];
  
  const dummyRooms = [
    { id: "room1", name: "Room A" },
    { id: "room2", name: "Room B" },
    { id: "room3", name: "Room C" },
    { id: "room4", name: "Room D" },
  ];
  
  const dummyRounds = [
    { id: "round1", name: "Preliminary Round" },
    { id: "round2", name: "Quarter-Finals" },
    { id: "round3", name: "Semi-Finals" },
    { id: "round4", name: "Final Round" },
  ];
  

  const openStartupModal = () => {
    setIsModalOpen(true);
  };

  const openImportModal = () => {
    setIsImportModalOpen(true);
  };

  // Add new schedule (can replace with a POST request)
  const addSchedule = (newData) => {
    /*
    const submitSchedule = async () => {
      try {
        const response = await fetch('/api/schedules', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newData),
        });
        const savedSchedule = await response.json();
        setScheduleData((prev) => [...prev, savedSchedule]);
      } catch (error) {
        console.error('Error submitting schedule:', error);
      }
    };
    submitSchedule();
    */
    
    setScheduleData((prev) => [...prev, newData]); // Dummy addition
      
  };

  return (
    <Box>
      {/* Search and Buttons */}
      <Stack direction="row" spacing="4" justify="end" my="10px">
        <Button
          leftIcon={<AddIcon />}
          color="white"
          bg="black"
          mx="2"
          onClick={() => openStartupModal()}
        >
          Add Schedule
        </Button>
        <Button
          leftIcon={<DownloadIcon />}
          color="white"
          bg="black"
          mx="2"
          onClick={openImportModal}
        >
          Import
        </Button>
      </Stack>

      <Flex bg="blackAlpha.100" paddingY="25px" paddingX="10%" borderRadius="10px" >
        {/* Calendar View */}
        <VStack bg="white" spacing={4} align="stretch" maxW={"50%"} border="1px" borderColor={"blackAlpha.200"} padding={'10px'} borderRadius={"md"} mr="10px" height='fit-content'>
          <Heading size="lg" fontWeight='black' justify='center' mx="10px">Calendar View</Heading>
          <Box bg="white" p={4} borderRadius="md" shadow="sm" >
            <Calendar
                mode="single"
                selected={newSchedule.selectedDate}
                onSelect={(date) => setNewSchedule((prev) => ({ ...prev, selectedDate: date }))}
                className="rounded-md border w-full bg-[#464646] text-white"
            />
            <Text mt={2} fontSize="sm">
              Selected Date: {newSchedule.selectedDate.toDateString()}
            </Text>
          </Box>
        </VStack>

        {/* Schedule Data */}
        <VStack bg="white"  spacing={4} align="stretch" minW="70%" border="1px" borderColor={"blackAlpha.200"} padding={'10px'} borderRadius={"md"} ml="10px">
          <Heading size="md">Startup Schedule</Heading>
            <Box bg="white" p={4} borderRadius="md" shadow="sm">
                {scheduleData.length === 0 ? (
                    <Text>No schedules added yet.</Text>
                ) : (
                    scheduleData.map((slot, index) => (
                    <Box key={index} p={3} borderWidth="1px" borderRadius="md" mb={2} padding="20px" bg="blackAlpha.100">
                        <Text><strong>Round:</strong> {slot.round}</Text>
                        <Text><strong>Startup:</strong> {slot.startup}</Text>
                        <Text><strong>Judges:</strong> {slot.judges.join(", ")}</Text>
                        <Text><strong>Time:</strong> {slot.startTime} - {slot.endTime}</Text>
                        <Text><strong>Room:</strong> {slot.room}</Text>
                        <Text><strong>Remote Link:</strong> <a href={slot.remoteLink} target="_blank" rel="noopener noreferrer">{slot.remoteLink}</a></Text>
                        
                    </Box>
                    ))
                )}
            </Box>

        </VStack>
      </Flex>

      {/* Add/Edit Modal */}
        <ScheduleModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            startups={dummyStartups}
            judges={dummyJudges}
            rooms={dummyRooms}
            rounds={dummyRounds}
            onSubmit={addSchedule}
        />

      <Modal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <SpreadsheetLinkCard
            onClose={() => setIsImportModalOpen(false)}
            templateUrl="https://docs.google.com/spreadsheets/d/.../edit?gid=0#gid=0"
            descriptionText="To import a list of startups, enter in a link to the spreadsheet with their details."
          />
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ScheduleTab;

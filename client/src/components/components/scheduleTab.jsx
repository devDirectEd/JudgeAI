import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  VStack,
  Text,
  Heading,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  Flex,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { AddIcon, DownloadIcon } from '@chakra-ui/icons';
import { Calendar } from "@/components/ui/calendar";
import { ScheduleModal } from './schdeuleform';
import { ScheduleSpreadsheetLinkCard } from '../components/importFromSpreadsheet';
import axiosInstance from '@/redux/axiosInstance';
import { format } from 'date-fns';

const ScheduleTab = () => {
  const toast = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scheduleData, setScheduleData] = useState([]);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startups, setStartups] = useState([]);
  const [judges, setJudges] = useState([]);
  const [rounds, setRounds] = useState([]);

  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        const [startupsRes, judgesRes, roundsRes] = await Promise.all([
          axiosInstance.get('/startups'),
          axiosInstance.get('/judges'),
          axiosInstance.get('/rounds')
        ]);

        setStartups(startupsRes.data);
        setJudges(judgesRes.data);
        setRounds(roundsRes.data);
      } catch (error) {
        console.log(error)
        toast({
          title: "Error",
          description: "Failed to load reference data. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchReferenceData();
  }, [toast]);

  const fetchSchedules = async (date) => {
    if (!date) return;
    
    setIsLoading(true);
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const response = await axiosInstance.get(`/schedules/range?start=${formattedDate}&end=${formattedDate}`);
      setScheduleData(response.data);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to load schedules. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setScheduleData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateSelect = async (date) => {
    if (date) {
      setSelectedDate(date);
      await fetchSchedules(date);
    }
  };

  // Fetch initial data for current date
  useEffect(() => {
    fetchSchedules(selectedDate);
  }, []); // Only run once on mount

  // Fetch reference data
  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        const [startupsRes, judgesRes, roundsRes] = await Promise.all([
          axiosInstance.get('/startups'),
          axiosInstance.get('/judges'),
          axiosInstance.get('/rounds')
        ]);

        setStartups(startupsRes.data);
        setJudges(judgesRes.data);
        setRounds(roundsRes.data);
      } catch (error) {
        console.log(error);
        toast({
          title: "Error",
          description: "Failed to load reference data. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchReferenceData();
  }, [toast]);

  const addSchedule = async (newData) => {
    setIsSubmitting(true);
    try {
      const scheduleData = {
        roundId: newData.round,
        startupId: newData.startup,
        date: new Date(newData.startDate),
        startTime: newData.startTime,
        endTime: newData.endTime,
        room: newData.room,
        judges: newData.judges,
        ...(newData.remoteRoom && { remoteRoom: newData.remoteRoom })
      };
  
      await axiosInstance.post('/schedules', scheduleData);
      
      toast({
        title: "Success",
        description: "Schedule created successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      fetchSchedules(selectedDate);
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create schedule. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatJudgeNames = (judges) => {
    if (!Array.isArray(judges)) return '';
    return judges
      .filter(({judge}) => judge && judge.firstname && judge.lastname)
      .map(({judge}) => `${judge.firstname} ${judge.lastname}`)
      .join(", ");
  };


  return (
    <Box>
      <Stack direction="row" spacing="4" justify="end" my="10px">
        <Button
          leftIcon={<AddIcon />}
          color="white"
          bg="black"
          mx="2"
          onClick={() => setIsModalOpen(true)}
        >
          Add Schedule
        </Button>
        <Button
          leftIcon={<DownloadIcon />}
          color="white"
          bg="black"
          mx="2"
          onClick={() => setIsImportModalOpen(true)}
        >
          Import
        </Button>
      </Stack>

      <Flex className='flex flex-col md:flex-row justify-center items-center gap-3' bg="blackAlpha.100" paddingY="25px" paddingX="5%" borderRadius="10px">
        <VStack bg="white" spacing={4} align="stretch" border="1px" justifySelf="flex-start" alignSelf="flex-start" borderColor="blackAlpha.200" padding="10px" borderRadius="md" mr="10px" height="fit-content">
          <Heading size="lg" fontWeight="black" justify="center" mx="10px">
            Pick a date to view its schedule
          </Heading>
          <Box bg="white" p={4} borderRadius="md" shadow="sm">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              className="rounded-md border w-full bg-[#464646] text-white"
              initialFocus
            />
            <Text mt={2} fontSize="sm">
              Selected Date: {selectedDate ? selectedDate.toDateString() : 'No date selected'}
            </Text>
          </Box>
        </VStack>

        <VStack bg="white" spacing={4} align="stretch" minW="70%" border="1px" borderColor="blackAlpha.200" padding="10px" borderRadius="md" ml="10px">
          <Heading size="md">Startup Schedule</Heading>
          <Box bg="white" p={4} borderRadius="md" shadow="sm">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Spinner size="xl" color="blue.500" />
              </div>
            ) : scheduleData.length === 0 ? (
              <Text>No schedules for selected date.</Text>
            ) : (
              scheduleData.map((slot) => (
                <Box key={slot._id} p={3} borderWidth="1px" borderRadius="md" mb={2} padding="20px" bg="blackAlpha.100">
                  <Text><strong>Round:</strong> {slot.roundId?.name || 'N/A'}</Text>
                  <Text><strong>Startup:</strong> {slot.startupId?.name || 'N/A'}</Text>
                  <Text><strong>Judges:</strong> {formatJudgeNames(slot.judges)}</Text>
                  <Text><strong>Time:</strong> {slot.startTime} - {slot.endTime}</Text>
                  <Text><strong>Room:</strong> {slot.room || 'N/A'}</Text>
                  {slot.remoteRoom && (
                    <Text><strong>Remote Link:</strong> <a href={slot.remoteRoom} target="_blank" rel="noopener noreferrer">{slot.remoteRoom}</a></Text>
                  )}
                </Box>
              ))
            )}
          </Box>
        </VStack>
      </Flex>

      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        startups={startups.map(s => ({
          id: s._id,
          name: `${s.name} (${s.startupID || 'No ID'})`
        }))}
        judges={judges.map(j => ({
          id: j._id,
          name: `${j.firstname} ${j.lastname}`
        }))}
        rounds={rounds.map(r => ({
          id: r._id,
          name: r.name
        }))}
        onSubmit={addSchedule}
        isSubmitting={isSubmitting}
      />

      <Modal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ScheduleSpreadsheetLinkCard
            onClose={() => setIsImportModalOpen(false)}
            onSuccess={() => fetchSchedules(selectedDate)}
            templateUrl="https://docs.google.com/spreadsheets/d/19AFl2jPgCHy3y32V9He9lj5Li5rm0vj49pcu3huhdZE/edit?usp=sharing"
            descriptionText="To import a list of startups, enter in a link to the spreadsheet with their details."
          />
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ScheduleTab;
import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  InputRightElement,
  InputGroup,
  Toast,
} from '@chakra-ui/react';
import { AddIcon, SearchIcon } from '@chakra-ui/icons';
import JudgesTable from './judgesTable';
import { DownloadIcon, UploadIcon } from 'lucide-react';
import SpreadsheetLinkCard from '../components/importFromSpreadsheet';
import axios from 'axios';

const JudgesTab = () => {
  const [judges, setJudges] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    judgeId: '',
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    expertise: '',
    schedules: [],
    feedback: [],
  });
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const apiEndpoint = '{{url}}/api/v1/judges'; // Replace with your actual endpoint

  const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const fetchJudges = async () => {
    try {
      const response = await axios.get(apiEndpoint);
      setJudges(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching judges:', error);
      setJudges([]);
    } finally {
      setIsLoading(false);
    }
  };
  fetchJudges();
}, []);

if (isLoading) {
  return <Box textAlign="center">Loading judges...</Box>;
}


  // Handle Save Judge
  const handleSaveJudge = async () => {
    try {
      if (modalData.judgeId) {
        // Update existing judge
        await axios.put(`${apiEndpoint}/${modalData.judgeId}`, modalData);
        setJudges((prev) =>
          prev.map((judge) =>
            judge.judgeId === modalData.judgeId ? { ...judge, ...modalData } : judge
          )
        );
      } else {
        // Add new judge
        const response = await axios.post(apiEndpoint, {
          ...modalData,
          schedules: [],
          feedback: [],
        });
        setJudges((prev) => [...prev, response.data]);
      }
      setIsModalOpen(false);
      setModalData({
        judgeId: '',
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        expertise: '',
        schedules: [],
        feedback: [],
      });
    } catch (error) {
      console.error('Error saving judge:', error);
      Toast({
        title: 'An error occurred.',
        description: 'Unable to save judge. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Handle Delete Judge
  const handleDeleteJudge = async (judgeId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this judge?');
    if (confirmDelete) {
      try {
        await axios.delete(`${apiEndpoint}/${judgeId}`);
        setJudges((prev) => prev.filter((judge) => judge.judgeId !== judgeId));
      } catch (error) {
        console.error('Error deleting judge:', error);
      }
    }
  };

  // Open modal for add/edit
  const openJudgesModal = (judge = {
    judgeId: '',
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    expertise: '',
    schedules: [],
    feedback: [],
  }) => {
    setModalData(judge);
    setIsModalOpen(true);
  };


  const filteredJudges = Array.isArray(judges)
  ? judges.filter(
      (judge) =>
        judge.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        judge.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        judge.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        judge.expertise.toLowerCase().includes(searchQuery.toLowerCase())
    )
  : [];

  

  return (
    <Box>
      {/* Search and Buttons */}
      <Stack direction="row" spacing="4" justifyContent="space-between" marginY="10px">
        <InputGroup w="400px">
          <InputRightElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputRightElement>
          <Input
            variant="outline"
            placeholder="Search judges..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>
        <Box>
          <Button
            leftIcon={<AddIcon />}
            color="white"
            bg="black"
            mx="2"
            onClick={() => openJudgesModal()}
          >
            Add Judge
          </Button>
          <Button leftIcon={<DownloadIcon />} color="white" bg="black" mx="2" onClick={() => setIsImportModalOpen(true)}>
            Import
          </Button>
          <Button leftIcon={<UploadIcon />} color="white" bg="black" mx="2">
            Export
          </Button>
        </Box>
      </Stack>

      {/* Judges Table or Empty State */}
      <Box bg="blackAlpha.100" paddingY="8px" paddingX="10%" borderRadius="10px">
        {judges.length > 0 ? (
          <JudgesTable judges={filteredJudges} onEdit={openJudgesModal} onDelete={handleDeleteJudge} />
        ) : (
          <Box textAlign="center" color="gray.500" py="20px">
            No judges have been added yet.
          </Box>
        )}
      </Box>


      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{modalData.judgeId ? 'Edit Judge' : 'Add Judge'}</ModalHeader>
          <ModalBody>
            <Stack spacing="4">
              <Input
                placeholder="First Name"
                value={modalData.firstname}
                onChange={(e) => setModalData({ ...modalData, firstname: e.target.value })}
              />
              <Input
                placeholder="Last Name"
                value={modalData.lastname}
                onChange={(e) => setModalData({ ...modalData, lastname: e.target.value })}
              />
              <Input
                placeholder="Email"
                value={modalData.email}
                onChange={(e) => setModalData({ ...modalData, email: e.target.value })}
              />
              <Input
                placeholder="Password"
                type="password"
                value={modalData.password}
                onChange={(e) => setModalData({ ...modalData, password: e.target.value })}
              />
              <Input
                placeholder="Expertise"
                value={modalData.expertise}
                onChange={(e) => setModalData({ ...modalData, expertise: e.target.value })}
              />
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSaveJudge}>
              Save
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Import Modal */}
      <Modal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <SpreadsheetLinkCard
            onClose={() => setIsImportModalOpen(false)}
            templateUrl="https://docs.google.com/spreadsheets/d/.../edit?gid=0#gid=0"
            descriptionText="To import a list of judges, enter in a link to the spreadsheet with their details."
          />
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default JudgesTab;

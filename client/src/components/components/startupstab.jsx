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
} from '@chakra-ui/react';
import { AddIcon, SearchIcon } from '@chakra-ui/icons';
import StartupTable from './startupsTable';
import { DownloadIcon, UploadIcon } from 'lucide-react';
import SpreadsheetLinkCard from '../components/importFromSpreadsheet';

const StartupsTab = () => {
  const [startups, setStartups] = useState([]); // Stores the startup list
  const [searchQuery, setSearchQuery] = useState(''); // Stores the search input
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [modalData, setModalData] = useState({ id: '', name: '', category: '', teamLead: '', email: '' }); // Modal form data
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const dummyStartups = [
    { id: '1', name: 'TechNova', category: 'Technology', teamLead: 'Alice Johnson', email: 'alice@technova.com' },
    { id: '2', name: 'HealthSphere', category: 'Healthcare', teamLead: 'Michael Brown', email: 'michael@healthsphere.com' },
    { id: '3', name: 'EcoBloom', category: 'Sustainability', teamLead: 'Sophia Green', email: 'sophia@ecobloom.com' },
    { id: '4', name: 'EduElevate', category: 'Education', teamLead: 'Ethan Miller', email: 'ethan@eduelevate.com' },
    { id: '5', name: 'FinEdge', category: 'Finance', teamLead: 'Charlotte Lee', email: 'charlotte@finedge.com' },
    { id: '6', name: 'AgriFuture', category: 'Agriculture', teamLead: 'Benjamin Scott', email: 'benjamin@agrifuture.com' },
    { id: '7', name: 'GreenTech', category: 'Technology', teamLead: 'Emily Davis', email: 'emily@greentech.com' },
    { id: '8', name: 'BioCare', category: 'Healthcare', teamLead: 'Liam Wilson', email: 'liam@biocare.com' },
    { id: '9', name: 'StudyStream', category: 'Education', teamLead: 'Olivia Martinez', email: 'olivia@studystream.com' },
    { id: '10', name: 'CityPlanner', category: 'Urban Planning', teamLead: 'William Taylor', email: 'william@cityplanner.com' },
    { id: '11', name: 'SmartBuild', category: 'Construction', teamLead: 'Amelia Thomas', email: 'amelia@smartbuild.com' },
    { id: '12', name: 'FarmToTable', category: 'Agriculture', teamLead: 'James White', email: 'james@farmtotable.com' },
    { id: '13', name: 'EcoCart', category: 'Retail', teamLead: 'Isabella Harris', email: 'isabella@ecocart.com' },
    { id: '14', name: 'NextGenMed', category: 'Healthcare', teamLead: 'Alexander Moore', email: 'alex@nextgenmed.com' },
    { id: '15', name: 'BrightPath', category: 'Education', teamLead: 'Mia Clark', email: 'mia@brightpath.com' },
    { id: '16', name: 'AutoWave', category: 'Automobile', teamLead: 'Daniel Rodriguez', email: 'daniel@autowave.com' }
    ];
  

  // Fetch startups (simulate API call)
  useEffect(() => {
    const fetchStartups = async () => {
      // Replace with API call
      const data = dummyStartups;
      setStartups(data);
    };
    fetchStartups();
  }, []);

  // Add or edit a startup
  const handleSaveStartup = () => {
    if (modalData.id) {
      // Edit logic
      setStartups((prev) =>
        prev.map((startup) =>
          startup.id === modalData.id ? { ...startup, ...modalData } : startup
        )
      );
    } else {
      // Add logic
      setStartups((prev) => [
        ...prev,
        { ...modalData, id: (Math.random() * 10000).toFixed(0) }, // Generate random ID
      ]);
    }
    setIsModalOpen(false);
    setModalData({ id: '', name: '', category: '', teamLead: '', email: '' });
  };

  // Delete a startup
  const handleDeleteStartup = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this startup?');
    if (confirmDelete) {
        setStartups((prev) => prev.filter((startup) => startup.id !== id));
      }
  };

  // Open modal for adding or editing
  const openStartupModal = (startup = { id: '', name: '', category: '', teamLead: '', email: '' }) => {
    setModalData(startup);
    setIsModalOpen(true);
  };

  // Filter startups based on search query
  const filteredStartups = startups.filter(
    (startup) =>
      startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      startup.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      startup.teamLead.toLowerCase().includes(searchQuery.toLowerCase()) ||
      startup.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  
  const openImportModal = () => setIsImportModalOpen(true);

  return (
    <Box>
      {/* Search and Buttons */}
      <Stack direction="row" spacing="4" justifyContent="space-between" marginY='10px'>
        <InputGroup w='400px'>
          <InputRightElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputRightElement>
          <Input
            variant="outline"
            placeholder="Search startups..."
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
            onClick={() => openStartupModal()}
          >
            Add Startup
          </Button>
          <Button leftIcon={<DownloadIcon/>} color="white" bg="black" mx="2" onClick={openImportModal}>
            Import
          </Button>
          <Button leftIcon={<UploadIcon/>} color="white" bg="black" mx="2" >
            Export
          </Button>
        </Box>
      </Stack>

      {/* Table */}
      <Box bg="blackAlpha.100" paddingY="8px" paddingX="10%" borderRadius="10px">
        <StartupTable
          startups={filteredStartups}
          onEdit={openStartupModal}
          onDelete={handleDeleteStartup}
        />
      </Box>

      {/* Modal for Add/Edit */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{modalData.id ? 'Edit Startup' : 'Add Startup'}</ModalHeader>
          <ModalBody>
            <Stack spacing="4">
              <Input
                placeholder="Startup Name"
                value={modalData.name}
                onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
              />
              <Input
                placeholder="Category"
                value={modalData.category}
                onChange={(e) => setModalData({ ...modalData, category: e.target.value })}
              />
              <Input
                placeholder="Team Lead"
                value={modalData.teamLead}
                onChange={(e) => setModalData({ ...modalData, teamLead: e.target.value })}
              />
              <Input
                placeholder="Email"
                value={modalData.email}
                onChange={(e) => setModalData({ ...modalData, email: e.target.value })}
              />
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSaveStartup}>
              Save
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Modal for Import */}
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

export default StartupsTab;

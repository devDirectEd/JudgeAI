import { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  InputRightElement,
  InputGroup,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { AddIcon, SearchIcon } from '@chakra-ui/icons';
import JudgesTable from './judgesTable';
import { DownloadIcon, UploadIcon } from 'lucide-react';
import { JudgesSpreadsheetLinkCard } from '../components/importFromSpreadsheet';
import axiosInstance from '@/redux/axiosInstance';
import { Button } from "@/components/ui/button";

const initialModalData = {
  _id: '',
  entityId: '',
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  expertise: '',
  schedules: [],
};

const JudgesTab = () => {
  const toast = useToast();
  
  // State
  const [judges, setJudges] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalData, setModalData] = useState(initialModalData);
  
  // UI State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch judges on component mount
  useEffect(() => {
    fetchJudges();
  }, []);

  const fetchJudges = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/judges");
      // Filter out password field from each judge object
      const judgesWithoutPasswords = Array.isArray(response.data) 
        ? response.data.map(judge => {
            // eslint-disable-next-line no-unused-vars
            const { password, ...judgeWithoutPassword } = judge;
            return judgeWithoutPassword;
          })
        : [];
      setJudges(judgesWithoutPasswords);
      toast({
        title: "Success",
        description: "Judges loaded successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error fetching judges:', error);
      toast({
        title: "Error",
        description: "Failed to load judges",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModalData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExportJudges = async () => {
    try {
      setIsExporting(true);
      const response = await axiosInstance.get("/judges/export", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `judges-${new Date().toISOString()}.csv`);
      document.body.appendChild(link);
      link.click();
      setIsExporting(false);
    } catch (error) {
      console.error("Error exporting judges:", error);
      setIsExporting(false);
      toast({
        title: "Error",
        description: "Failed to export judges",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };


  const validateForm = () => {
    const requiredFields = ['firstname', 'lastname', 'email', 'expertise', 'entityId'];
    const missingFields = requiredFields.filter(field => !modalData[field]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    return true;
  };

  const handleSaveJudge = async () => {
    if (!validateForm()) return;
    
    setIsSaving(true);
    try {
      if (modalData._id) {
        // Update existing judge
        console.log("update modal data" ,modalData)
        const response = await axiosInstance.put(`/judges/${modalData._id}`, modalData);
        setJudges(prev =>
          prev.map(judge =>
            judge._id === modalData._id ? response.data : judge
          )
        );
        toast({
          title: "Success",
          description: "Judge updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Create new judge
        console.log("passed create judge data",modalData)
        const response = await axiosInstance.post("/judges", modalData);
        console.log("add judge response", response.data)
        setJudges(prev => [...prev, response.data]);
        toast({
          title: "Success",
          description: "New judge added successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      handleCloseModal();
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save judge",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteJudge = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this judge?');
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/judges/${id}`);
      setJudges(prev => prev.filter(judge => judge._id !== id));
      toast({
        title: "Success",
        description: "Judge deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting judge:', error);
      toast({
        title: "Error",
        description: "Failed to delete judge",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCloseModal = () => {
    setModalData(initialModalData);
    setIsModalOpen(false);
  };

  const handleOpenModal = (judge = null) => {
    setModalData(judge || initialModalData);
    setIsModalOpen(true);
  };

  const filteredJudges = Array.isArray(judges)
    ? judges.filter(judge =>
        [judge.firstname, judge.lastname, judge.email, judge.expertise]
          .some(field => field?.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Search Bar */}
        <div className="w-full max-w-xl">
          <InputGroup>
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
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 justify-start lg:justify-end">
          <Button
            variant="default"
            className="bg-[#18181B] hover:bg-[#27272A]"
            onClick={() => handleOpenModal()}
            disabled={isLoading}
          >
            <AddIcon className="mr-2 h-4 w-4" />
            Add Judge
          </Button>
          <Button
            variant="outline"
            className="bg-[#E4E4E7] text-[#18181B] border-[#18181B] hover:bg-[#F4F4F5]"
            onClick={() => setIsImportModalOpen(true)}
            disabled={isLoading}
          >
            <DownloadIcon className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button
            variant="outline"
            className="bg-[#E4E4E7] text-[rgb(24,24,27)] border-[#18181B] hover:bg-[#F4F4F5]"
            disabled={isExporting || isLoading}
            isLoading={isExporting}
            onClick={handleExportJudges}            
          >
            <UploadIcon className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-gray-50 rounded-lg p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="xl" color="blue.500" />
          </div>
        ) : judges.length > 0 ? (
          <JudgesTable 
            judges={filteredJudges} 
            onEdit={handleOpenModal} 
            onDelete={handleDeleteJudge}
          />
        ) : (
          <div className="text-center text-gray-500 py-8">
            No judges have been added yet.
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{modalData._id ? 'Edit Judge' : 'Add Judge'}</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                name="firstname"
                placeholder="First Name"
                value={modalData.firstname}
                onChange={handleInputChange}
                isDisabled={isSaving}
              />
              <Input
                name="lastname"
                placeholder="Last Name"
                value={modalData.lastname}
                onChange={handleInputChange}
                isDisabled={isSaving}
              />
              <Input
                name="email"
                placeholder="Email"
                value={modalData.email}
                onChange={handleInputChange}
                isDisabled={isSaving}
              />
              <Input
                name="entityId"
                placeholder="Entity ID"
                value={modalData.entityId}
                onChange={handleInputChange}
                isDisabled={isSaving}
              />
              <Input
                name="expertise"
                placeholder="Expertise"
                value={modalData.expertise}
                onChange={handleInputChange}
                isDisabled={isSaving}
              />
              {modalData._id && (
                <Input
                  name="password"
                  placeholder="Password"
                  type="password"
                  value={modalData.password}
                  onChange={handleInputChange}
                  isDisabled={isSaving}
                />
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="default"
              className="bg-blue-600 hover:bg-blue-700 mr-3"
              onClick={handleSaveJudge}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
            <Button
              variant="outline"
              onClick={handleCloseModal}
              disabled={isSaving}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Import Modal */}
      <Modal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <JudgesSpreadsheetLinkCard
            onClose={() => setIsImportModalOpen(false)}
            onSuccess={fetchJudges}
            templateUrl="https://docs.google.com/spreadsheets/d/1gG6z-Tz0gbdkGQngVWU3L8gPJRwPb2NN_HawGKTFyhs/edit?usp=sharing"
            descriptionText="To import a list of judges, enter in a link to the spreadsheet with their details."
          />
        </ModalContent>
      </Modal>
    </div>
  );
};

export default JudgesTab;
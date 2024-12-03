import { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  InputRightElement,
  InputGroup,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { AddIcon, SearchIcon } from "@chakra-ui/icons";
import StartupTable from "./startupsTable";
import { DownloadIcon, UploadIcon } from "lucide-react";
import { StartupSpreadsheetLinkCard } from "../components/importFromSpreadsheet";
import axiosInstance from "@/redux/axiosInstance";

const StartupsTab = () => {
  const toast = useToast();
  const [startups, setStartups] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [modalData, setModalData] = useState({
    name: "",
    category: "",
    teamLeader: "",
    email: "",
    _id: "",
    startupID: "",
  });
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  useEffect(() => {
    fetchStartups();
  }, []);

  const fetchStartups = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/startups");
      console.log("startups", response.data)
      setStartups(response.data);
      toast({
        title: "Success",
        description: "Startups loaded successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error fetching startups:", error);
      toast({
        title: "Error",
        description: "Failed to load startups",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveStartup = async () => {
    if (
      !modalData.name ||
      !modalData.category ||
      !modalData.teamLeader ||
      !modalData.email
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSaving(true);
    try {
      if (modalData._id) {
        await axiosInstance.put(`/startups/${modalData._id}`, modalData);
        setStartups((prev) =>
          prev.map((startup) =>
            startup._id === modalData._id
              ? { ...startup, ...modalData }
              : startup
          )
        );
        toast({
          title: "Success",
          description: "Startup updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        const response = await axiosInstance.post("/startups", modalData);
        setStartups((prev) => [...prev, response.data]);
        toast({
          title: "Success",
          description: "New startup added successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      setIsModalOpen(false);
      setModalData({
        name: "",
        category: "",
        teamLeader: "",
        email: "",
        judgeIds: [],
        feedback: [],
        results: [],
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save startup",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportStartups = async () => {
    try {
      setIsExporting(true);
      const response = await axiosInstance.get("/startups/export", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `startups-${new Date().toISOString()}.csv`);
      document.body.appendChild(link);
      link.click();
      setIsExporting(false);
    } catch (error) {
      console.error("Error exporting startups:", error);
      setIsExporting(false);
      toast({
        title: "Error",
        description: "Failed to export startups",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteStartup = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this startup?"
    );
    if (confirmDelete) {
      setIsDeleting(true);
      try {
        await axiosInstance.delete(`/startups/${id}`);
        setStartups((prev) => prev.filter((startup) => startup._id !== id));
        toast({
          title: "Success",
          description: "Startup deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.log(error);
        toast({
          title: "Error",
          description: "Failed to delete startup",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Rest of the component remains the same
  const openStartupModal = (startup = null) => {
    if (startup) {
      setModalData(startup);
    } else {
      setModalData({
        name: "",
        category: "",
        teamLeader: "",
        email: "",
        judgeIds: [],
        feedback: [],
        results: [],
      });
    }
    setIsModalOpen(true);
  };

  const filteredStartups = startups.filter(
    (startup) =>
      startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      startup.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      startup.teamLeader.toLowerCase().includes(searchQuery.toLowerCase()) ||
      startup.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full space-y-6 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center p-2">
        <div className="w-full max-w-xl">
          <InputGroup>
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
        </div>

        <div className="flex flex-wrap gap-2 justify-start lg:justify-end">
          <Button
            leftIcon={<AddIcon />}
            bg="#18181B"
            color="white"
            _hover={{ bg: "#27272A" }}
            onClick={() => openStartupModal()}
            isDisabled={isLoading}
          >
            Add Startup
          </Button>
          <Button
            leftIcon={<DownloadIcon className="h-4 w-4" />}
            bg="#E4E4E7"
            color="#18181B"
            variant="outline"
            borderColor="#18181B"
            _hover={{ bg: "#F4F4F5" }}
            onClick={() => setIsImportModalOpen(true)}
            isDisabled={isLoading}
          >
            Import
          </Button>
          <Button
            leftIcon={<UploadIcon className="h-4 w-4" />}
            bg="#E4E4E7"
            color="#18181B"
            variant="outline"
            borderColor="#18181B"
            _hover={{ bg: "#F4F4F5" }}
            isDisabled={isExporting || isLoading}
            isLoading={isExporting}
            onClick={handleExportStartups}
          >
            Export
          </Button>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="xl" color="blue.500" />
          </div>
        ) : (
          <StartupTable
            startups={filteredStartups}
            onEdit={openStartupModal}
            onDelete={handleDeleteStartup}
            isDeleting={isDeleting}
          />
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {modalData._id ? "Edit Startup" : "Add Startup"}
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                placeholder="Startup Name"
                value={modalData.name}
                onChange={(e) =>
                  setModalData({ ...modalData, name: e.target.value })
                }
                isDisabled={isSaving}
              />
              <Input
                placeholder="Category"
                value={modalData.category}
                onChange={(e) =>
                  setModalData({ ...modalData, category: e.target.value })
                }
                isDisabled={isSaving}
              />
              <Input
                placeholder="Team Leader"
                value={modalData.teamLeader}
                onChange={(e) =>
                  setModalData({ ...modalData, teamLeader: e.target.value })
                }
                isDisabled={isSaving}
              />
              <Input
                placeholder="Email"
                value={modalData.email}
                onChange={(e) =>
                  setModalData({ ...modalData, email: e.target.value })
                }
                isDisabled={isSaving}
              />
              <Input
                placeholder="custon startup ID"
                value={modalData.startupID}
                onChange={(e) =>
                  setModalData({ ...modalData, startupID: e.target.value })
                }
                isDisabled={isSaving}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleSaveStartup}
              isLoading={isSaving}
              loadingText="Saving..."
            >
              Save
            </Button>
            <Button onClick={() => setIsModalOpen(false)} isDisabled={isSaving}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <StartupSpreadsheetLinkCard
            onClose={() => setIsImportModalOpen(false)}
            onSuccess={fetchStartups}
            templateUrl="https://docs.google.com/spreadsheets/d/1lD4YvAWGunflLfN4iGxtJWtt5NB-G6YqsvUmz_OnR6k/edit?usp=sharing"
            descriptionText="To import a list of startups, enter in a link to the spreadsheet with their details."
          />
        </ModalContent>
      </Modal>
    </div>
  );
};

export default StartupsTab;

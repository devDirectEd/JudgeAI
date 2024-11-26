import { useState, useEffect } from 'react';
import { 
  Button,
  Text,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
} from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
import AddEditCriteriaModal from './add-deleteCriteriaModal';
import RoundsTable from './roundsTable';
import { CriteriaTable } from './criteriaTable';
import { RoundsSpreadsheetLinkCard } from '../components/importFromSpreadsheet';
import axiosInstance from '@/redux/axiosInstance';

const RoundsTab = () => {
  const [selectedRound, setSelectedRound] = useState(null);
  const [rounds, setRounds] = useState([]);
  const [isCriteriaModalOpen, setIsCriteriaModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingCriteriaIndex, setEditingCriteriaIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeletingCriteria, setIsDeletingCriteria] = useState(false);
  const [isDeletingRound, setIsDeletingRound] = useState(null); 

  const fetchRounds = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/rounds");
      console.log("round", response.data)
      // Assuming response.data is already the array of rounds
      setRounds(Array.isArray(response.data) ? response.data : []);
      toast({
        title: "Success",
        description: "Rounds loaded successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error fetching rounds:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to load rounds",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setRounds([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRounds();
  }, []);

  const handleRoundSelect = (round) => {
    setSelectedRound(round);
  };

  const getTotalWeight = (criteria) => {
    return criteria.reduce((sum, criterion) => sum + criterion.weight, 0);
  };

  const handleCriteriaSubmit = async (newCriteria) => {
    if (!selectedRound) {
      toast({
        title: "Error",
        description: "Please select a round first",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);
  
    try {
      const updatedRoundData = {
        name: selectedRound.name,
        criteria: selectedRound.criteria.map(c => {
          const weightUpdate = newCriteria.otherWeights.find(w => w.id === c._id);
          if (weightUpdate) {
            return {
              id: c._id,
              question: c.question,
              weight: weightUpdate.weight,
              active: c.active,
              sub_questions: c.sub_questions
            };
          }
          return {
            id: c._id,
            question: c.question,
            weight: c.weight,
            active: c.active,
            sub_questions: c.sub_questions
          };
        })
      };
  
      if (editingCriteriaIndex !== null) {
        updatedRoundData.criteria[editingCriteriaIndex] = {
          id: selectedRound.criteria[editingCriteriaIndex]._id,
          question: newCriteria.name,
          weight: newCriteria.weight,
          active: newCriteria.active,
          sub_questions: newCriteria.subquestions.map(sq => ({
            question: sq
          }))
        };
      } else {
        // Adding new criteria
        updatedRoundData.criteria.push({
          question: newCriteria.name,
          weight: newCriteria.weight,
          active: newCriteria.active,
          sub_questions: newCriteria.subquestions.map(sq => ({
            question: sq
          }))
        });
      }
  
      const response = await axiosInstance.put(
        `/rounds/${selectedRound._id}`,
        updatedRoundData
      );
  
      const updatedRound = response.data.round;
      const updatedRounds = rounds.map(round => 
        round._id === selectedRound._id ? updatedRound : round
      );
  
      setRounds(updatedRounds);
      setSelectedRound(updatedRound);
      setIsCriteriaModalOpen(false);
      setEditingCriteriaIndex(null);
  
      toast({
        title: "Success",
        description: response.data.message || "Round updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update round",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  } 
  
  // Update handleDeleteCriteria
  const handleDeleteCriteria = async (index) => {
    setIsDeletingCriteria(true);
    try {
      const updatedRoundData = {
        name: selectedRound.name,
        criteria: selectedRound.criteria.filter((_, i) => i !== index)
          .map(c => ({
            id: c._id,
            question: c.question,
            weight: c.weight,
            sub_questions: c.sub_questions
          }))
      };
  
      const response = await axiosInstance.put(
        `/rounds/${selectedRound._id}`,
        updatedRoundData
      );
  
      // Extract round data from response
      const updatedRound = response.data.round;
  
      // Update local state
      const updatedRounds = rounds.map(round => 
        round._id === selectedRound._id ? updatedRound : round
      );
  
      setRounds(updatedRounds);
      setSelectedRound(updatedRound);
  
      toast({
        title: "Success",
        description: response.data.message || "Criteria deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete criteria",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsDeletingCriteria(false);
    }
  };
  

  const handleDeleteRound = async (roundId) => {
    setIsDeletingRound(roundId);
    try {
      await axiosInstance.delete(`/rounds/${roundId}`);
      
      const updatedRounds = rounds.filter(round => round._id !== roundId);
      setRounds(updatedRounds);
      
      if (selectedRound?._id === roundId) {
        setSelectedRound(null);
      }

      toast({
        title: "Success",
        description: "Round deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to delete round",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsDeletingRound(null);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-end">
        <Button
          leftIcon={<DownloadIcon />}
          className="bg-[#18181B] text-white hover:bg-[#27272A]"
          onClick={() => setIsImportModalOpen(true)}
          isDisabled={isLoading}
        >
          Import
        </Button>
      </div>

      <div className="bg-gray-100 rounded-lg p-6">
        <RoundsTable 
          rounds={rounds}
          selectedRound={selectedRound}
          onSelect={handleRoundSelect}
          onDelete={handleDeleteRound}
          isLoading={isLoading}
          isDeletingRound={isDeletingRound}
        />

        {selectedRound && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <Text fontSize="xl" fontWeight="bold">
                Criteria for {selectedRound.name}
              </Text>
              <Button
                onClick={() => {
                  setEditingCriteriaIndex(null);
                  setIsCriteriaModalOpen(true);
                }}
                className="bg-[#18181B] text-white hover:bg-[#27272A]"
                isDisabled={isLoading || isSubmitting || isDeletingCriteria}  // Add all relevant loading states
              >
                Add Criteria
              </Button>
            </div>

            <CriteriaTable
              criteria={selectedRound.criteria.map(c => ({
                id: c._id,
                name: c.question,
                weight: c.weight,
                active: c.active,
                subquestions: c.sub_questions.map(sq => sq.question)
              }))}
              onEdit={(criteria) => {
                setEditingCriteriaIndex(selectedRound.criteria.findIndex(c => c._id === criteria.id));
                setIsCriteriaModalOpen(true);
              }}
              onDelete={handleDeleteCriteria}
              isDeletingCriteria={isDeletingCriteria}
            />

            <div className="flex justify-between items-center mt-4 p-4 bg-white rounded-lg">
              <span className="text-xl font-bold">Total Weight</span>
              <span className={`text-xl font-bold ${
                getTotalWeight(selectedRound.criteria) === 100 
                  ? 'text-green-600' 
                  : 'text-yellow-600'
              }`}>
                {getTotalWeight(selectedRound.criteria)}%
              </span>
            </div>
          </div>
        )}

        <AddEditCriteriaModal
              isOpen={isCriteriaModalOpen}
              onClose={() => {
                setIsCriteriaModalOpen(false);
                setEditingCriteriaIndex(null);
              }}
              onSubmit={handleCriteriaSubmit}
              existingCriteria={editingCriteriaIndex !== null ? {
                id: selectedRound?.criteria[editingCriteriaIndex]._id,
                name: selectedRound?.criteria[editingCriteriaIndex].question,
                weight: selectedRound?.criteria[editingCriteriaIndex].weight,
                hasSubquestions: selectedRound?.criteria[editingCriteriaIndex].active,
                subquestions: selectedRound?.criteria[editingCriteriaIndex].sub_questions.map(sq => sq.question)
              } : null}
              totalWeight={selectedRound ? getTotalWeight(selectedRound.criteria) : 0}
              otherCriteria={selectedRound?.criteria.map(c => ({
                id: c._id,
                name: c.question,
                weight: c.weight
              })) || []}
              isSubmitting={isSubmitting}
            />

        <Modal 
          isOpen={isImportModalOpen} 
          onClose={() => setIsImportModalOpen(false)}
        >
          <ModalOverlay />
          <ModalContent>
            <RoundsSpreadsheetLinkCard
              onClose={() => setIsImportModalOpen(false)}
              onSuccess={fetchRounds}
              templateUrl="https://docs.google.com/spreadsheets/d/1yEyk_e46b5ivJM8mVtBHaOVeK3e49V5o2T1ICb0x4oY/edit?usp=sharing"
              descriptionText="To import rounds and criteria, enter in a link to the spreadsheet with their details."
            />
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

export default RoundsTab;
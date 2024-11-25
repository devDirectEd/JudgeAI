import { useState, useEffect } from 'react'
import { Box, Button, Flex, Stack, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Input } from '@chakra-ui/react'
import { DownloadIcon } from '@chakra-ui/icons'
import AddEditCriteriaModal from './add-deleteCriteriaModal'
import RoundsTable from './roundsTable'
import { CriteriaTable } from './criteriaTable'


const RoundsTab = () => {
  const [criteria, setCriteria] = useState([])
  const [rounds, setRounds] = useState([])  // State to manage rounds
  const [isCriteriaModalOpen, setIsCriteriaModalOpen] = useState(false)
  const [isRoundModalOpen, setIsRoundModalOpen] = useState(false)  // State to manage rounds modal
  const [totalWeight, setTotalWeight] = useState(0)
  const [editingCriteriaIndex, setEditingCriteriaIndex] = useState(null)
  const [editingRoundIndex, setEditingRoundIndex] = useState(null)  // Track round being edited
  const [newRoundName, setNewRoundName] = useState("")  // For storing round name


  //Dummy Data
  const roundsDummy = [
    { "id": 1, "name": "Pre-Assessment Round" },
    { "id": 2, "name": "Technical Evaluation Round" },
    { "id": 3, "name": "Final Assessment Round" }
  ]
  const criteriaDummy = [
    {
      "id": 1,
      "name": "Problem Solving",
      "weight": 25,
      "description": "Ability to solve problems with efficiency and creativity."
    },
    {
      "id": 2,
      "name": "Technical Knowledge",
      "weight": 30,
      "description": "Depth of technical expertise in relevant technologies."
    },
    {
      "id": 3,
      "name": "Communication Skills",
      "weight": 20,
      "description": "Ability to communicate effectively with team members and stakeholders."
    },
    {
      "id": 4,
      "name": "Team Collaboration",
      "weight": 15,
      "description": "Ability to work in a team and contribute to group goals."
    },
    {
      "id": 5,
      "name": "Leadership Potential",
      "weight": 10,
      "description": "Capacity to lead and inspire a team in future roles."
    }
  ]
    


  // Open modal to add/edit criteria
  const openCriteriaModal = (index = null) => {
    setEditingCriteriaIndex(index)
    setIsCriteriaModalOpen(true)
  }

  // Close criteria modal
  const closeCriteriaModal = () => {
    setIsCriteriaModalOpen(false)
    setEditingCriteriaIndex(null)
  }


  // Close round modal
  const closeRoundModal = () => {
    setIsRoundModalOpen(false)
    setEditingRoundIndex(null)
  }

  // Handle criteria form submit (add/edit)
  const handleCriteriaSubmit = async (newCriteria) => {
    try {
      if (editingCriteriaIndex === null) {
        const response = await fetch('/api/criteria', {
          method: 'POST',
          body: JSON.stringify(newCriteria),
          headers: { 'Content-Type': 'application/json' },
        })
        const addedCriteria = await response.json()
        setCriteria([...criteria, addedCriteria])
        setTotalWeight(totalWeight + newCriteria.weight)
      } else {
        const updatedCriteria = { ...criteria[editingCriteriaIndex], ...newCriteria }
        const response = await fetch(`/api/criteria/${updatedCriteria.id}`, {
          method: 'PUT',
          body: JSON.stringify(updatedCriteria),
          headers: { 'Content-Type': 'application/json' },
        })
        const updatedData = await response.json()
        const updatedCriteriaList = criteria.map((item, index) => index === editingCriteriaIndex ? updatedData : item)
        setCriteria(updatedCriteriaList)
        const updatedTotalWeight = updatedCriteriaList.reduce((acc, item) => acc + item.weight, 0)
        setTotalWeight(updatedTotalWeight)
      }
      closeCriteriaModal()
    } catch (error) {
      console.error("Error saving criteria:", error)
    }
  }

  // Handle delete criteria
  const handleDeleteCriteria = async (index) => {
    const criteriaToDelete = criteria[index]
    try {
      await fetch(`/api/criteria/${criteriaToDelete.id}`, {
        method: 'DELETE',
      })
      const updatedCriteria = criteria.filter((_, i) => i !== index)
      setCriteria(updatedCriteria)
      setTotalWeight(updatedCriteria.reduce((acc, item) => acc + item.weight, 0))
    } catch (error) {
      console.error("Error deleting criteria:", error)
    }
  }

  // Handle round submit (add/edit)
  // Handle round submit (add/edit)
const handleRoundSubmit = async () => {
  try {
    const newRound = { name: newRoundName };
    if (editingRoundIndex === null) {
      const response = await fetch("/api/rounds", {
        method: "POST",
        body: JSON.stringify(newRound),
        headers: { "Content-Type": "application/json" },
      });
      const addedRound = await response.json();
      setRounds([...rounds, addedRound]);
    } else {
      const updatedRound = { ...rounds[editingRoundIndex], name: newRoundName };
      const response = await fetch(`/api/rounds/${updatedRound.id}`, {
        method: "PUT",
        body: JSON.stringify(updatedRound),
        headers: { "Content-Type": "application/json" },
      });
      const updatedData = await response.json();
      const updatedRounds = rounds.map((round, index) =>
        index === editingRoundIndex ? updatedData : round
      );
      setRounds(updatedRounds);
    }
    closeRoundModal();
  } catch (error) {
    console.error("Error saving round:", error);
  }
};

// Open modal to add/edit round
const openRoundModal = (index = null) => {
  if (index !== null) {
    setNewRoundName(rounds[index].name); // Set round name for editing
  } else {
    setNewRoundName(""); // Reset for adding a new round
  }
  setEditingRoundIndex(index); // Set the round index
  setIsRoundModalOpen(true); // Open the modal
};



  // Handle delete round
  const handleDeleteRound = async (index) => {
    const roundToDelete = rounds[index]
    try {
      await fetch(`/api/rounds/${roundToDelete.id}`, {
        method: 'DELETE',
      })
      const updatedRounds = rounds.filter((_, i) => i !== index)
      setRounds(updatedRounds)
    } catch (error) {
      console.error("Error deleting round:", error)
    }
  }

  

  // Fetch initial data on mount
  useEffect(() => {
    const fetchRounds = async () => {
      try {
        setRounds(roundsDummy)
        //const response = await fetch('/api/rounds')
        //const data = await response.json()
        //setRounds(data)
      } catch (error) {
        console.error("Error fetching rounds:", error)
      }
    }


    const fetchCriteria = async () => {
      try {
        setCriteria(criteriaDummy)
        //const response = await fetch('/api/criteria')
        //const data = await response.json()
        //setCriteria(criteriaDummy)
        const totalWeight = criteriaDummy.reduce((acc, item) => acc + item.weight, 0)
        setTotalWeight(totalWeight)
      } catch (error) {
        console.error("Error fetching criteria:", error)
      }
    }

    
    fetchCriteria()
    fetchRounds()
}, []);

  return (
    <Box>
      {/* Buttons for Add Round and Import */}
      <Stack direction='row' spacing='4' justify={'flex-end'} my='5px'>
        <Button leftIcon={<DownloadIcon />} color='white' bg='black' >Import</Button>
      </Stack>

      <Box bg='blackAlpha.400' paddingY='8px' paddingX='10%' borderRadius='10px'>
        {/* Rounds Table */}
        <RoundsTable rounds={rounds} onEdit={openRoundModal} onDelete={handleDeleteRound} />

        {/* Evaluation Criteria Table */}
        <Box mt='15px'>
          <CriteriaTable
            criteria={criteria}
            onEdit={openCriteriaModal}
            onDelete={handleDeleteCriteria}
          />
          <AddEditCriteriaModal
            isOpen={isCriteriaModalOpen}
            onClose={closeCriteriaModal}
            onSubmit={handleCriteriaSubmit}
            existingCriteria={editingCriteriaIndex !== null ? criteria[editingCriteriaIndex] : null}
            index={editingCriteriaIndex}
            totalWeight={totalWeight}
          />
        </Box>
        
        {/* Display Total Weight */}
        <Flex justifyContent={'space-between'} marginTop={"10px"} padding={"5px"}>
          <Text fontSize="xl" fontWeight="bold" mb={4}>Total Weight</Text>
          <Text fontSize="xl" fontWeight="bold" mb={4} color={"green"}>{totalWeight}%</Text>
          
        </Flex>
      </Box>

      {/* Add/Edit Round Modal */}
      <Modal isOpen={isRoundModalOpen} onClose={closeRoundModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editingRoundIndex === null ? 'Add Round' : 'Edit Round'}</ModalHeader>
          <ModalBody>
            <Input
              value={newRoundName}
              onChange={(e) => setNewRoundName(e.target.value)}
              placeholder="Round Name"
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={closeRoundModal}>Cancel</Button>
            <Button colorScheme="blue" onClick={handleRoundSubmit}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default RoundsTab;

/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  Button, 
  FormControl, 
  FormLabel, 
  Input, 
  Slider, 
  SliderTrack, 
  SliderFilledTrack, 
  SliderThumb, 
  Tag, 
  Switch,
  IconButton,
  useToast,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';

const AddEditCriteriaModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  existingCriteria, 
  totalWeight,
  otherCriteria = [],
  isSubmitting = false,
}) => {
  const toast = useToast();
  const [name, setName] = useState('');
  const [weight, setWeight] = useState(0);
  const [hasSubquestions, setHasSubquestions] = useState(true);
  const [subquestions, setSubquestions] = useState(['']);
  const [otherWeights, setOtherWeights] = useState([]);

  useEffect(() => {
    if (existingCriteria) {
      setName(existingCriteria.name);
      setWeight(existingCriteria.weight);
      setHasSubquestions(existingCriteria.hasSubquestions ?? true);
      setSubquestions(existingCriteria.subquestions || ['']);
      
      const others = otherCriteria
        .filter(c => c.id !== existingCriteria.id)
        .map(c => ({
          id: c.id,
          name: c.name,
          weight: c.weight
        }));
      setOtherWeights(others);
    } else {
      const remainingWeight = 100 - totalWeight;
      setName('');
      setWeight(remainingWeight);
      setHasSubquestions(true);
      setSubquestions(['']);
      setOtherWeights(otherCriteria.map(c => ({
        id: c.id,
        name: c.name,
        weight: c.weight
      })));
    }
  }, [existingCriteria, totalWeight, otherCriteria]);

  const redistributeWeight = (newWeight) => {
    const oldWeight = weight;
    const weightDiff = newWeight - oldWeight;
    
    if (otherWeights.length === 0) {
      setWeight(100);
      return;
    }

    const totalOtherWeight = otherWeights.reduce((sum, c) => sum + c.weight, 0);
    
    const updatedOtherWeights = otherWeights.map(criteria => {
      const proportion = criteria.weight / totalOtherWeight;
      const adjustment = weightDiff * proportion;
      return {
        ...criteria,
        weight: Math.max(1, Math.round(criteria.weight - adjustment))
      };
    });

    const newTotal = newWeight + updatedOtherWeights.reduce((sum, c) => sum + c.weight, 0);
    if (newTotal !== 100) {
      const diff = 100 - newTotal;
      const largestWeight = updatedOtherWeights.reduce((max, current) => 
        current.weight > max.weight ? current : max
      );
      const indexOfLargest = updatedOtherWeights.findIndex(c => c.id === largestWeight.id);
      updatedOtherWeights[indexOfLargest].weight += diff;
    }

    setWeight(newWeight);
    setOtherWeights(updatedOtherWeights);
  };

  const handleAddSubquestion = () => {
    setSubquestions([...subquestions, '']);
  };

  const handleRemoveSubquestion = (index) => {
    if (subquestions.length === 1 && hasSubquestions) {
      toast({
        title: "Error",
        description: "At least one subquestion is required when subquestions are enabled",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const newSubquestions = subquestions.filter((_, i) => i !== index);
    setSubquestions(newSubquestions);
  };
  

  const handleSubquestionChange = (index, value) => {
    const newSubquestions = [...subquestions];
    newSubquestions[index] = value;
    setSubquestions(newSubquestions);
  };

  const validateForm = () => {
    if (!name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a criteria name",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
  
    if (weight <= 0) {
      toast({
        title: "Validation Error",
        description: "Weight must be greater than 0",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
  
    // Only validate subquestions if they're enabled
    if (hasSubquestions && !subquestions.every(sq => sq.trim())) {
      toast({
        title: "Validation Error",
        description: "All subquestions must be filled when enabled",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
  
    return true;
  };

  const handleFormSubmit = () => {
    if (!validateForm()) return;
  
    onSubmit({
      id: existingCriteria?.id || Date.now(),
      name,
      weight,
      active: hasSubquestions,  // Set active based on hasSubquestions toggle
      subquestions: subquestions.filter(sq => sq.trim()), // Always send subquestions
      otherWeights
    });
    onClose();
  };

  const toggleSubquestions = () => {
    setHasSubquestions(!hasSubquestions);
    // Don't modify subquestions array when toggling, keep the data intact
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {existingCriteria ? 'Edit Criteria' : 'Add Criteria'}
        </ModalHeader>
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>Name</FormLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter criteria name"
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Weight ({weight}%)</FormLabel>
            <Slider 
              value={weight} 
              onChange={redistributeWeight} 
              min={1} 
              max={99} 
              step={1}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </FormControl>

          {otherWeights.length > 0 && (
            <div className="mb-4">
              <FormLabel>Other Criteria Weights</FormLabel>
              {otherWeights.map((criteria) => (
                <div key={criteria.id} className="flex justify-between items-center mb-2">
                  <span className="text-sm">{criteria.name}</span>
                  <Tag size="sm" variant="outline">
                    {criteria.weight}%
                  </Tag>
                </div>
              ))}
            </div>
          )}

          <FormControl display="flex" alignItems="center" mb={4}>
            <FormLabel mb="0">
              Enable Subquestions
            </FormLabel>
            <Switch 
              isChecked={hasSubquestions}
              onChange={toggleSubquestions}
            />
          </FormControl>

          {hasSubquestions && (
            <FormControl mb={4}>
              <FormLabel>Subquestions</FormLabel>
              {subquestions.map((subquestion, index) => (
                <div key={index} className="mb-2 flex items-center">
                  <Input
                    value={subquestion}
                    onChange={(e) => handleSubquestionChange(index, e.target.value)}
                    placeholder="Enter subquestion"
                    mr={2}
                  />
                  <IconButton
                    icon={<DeleteIcon />}
                    aria-label="Remove subquestion"
                    onClick={() => handleRemoveSubquestion(index)}
                    isDisabled={subquestions.length === 1}
                  />
                </div>
              ))}
              <Button leftIcon={<AddIcon />} onClick={handleAddSubquestion}>
                Add Subquestion
              </Button>
            </FormControl>
          )}
        </ModalBody>

        <ModalFooter>
        <Button variant="ghost" onClick={onClose} mr={3} isDisabled={isSubmitting}>
          Cancel
        </Button>
        <Button 
          colorScheme="blue" 
          onClick={handleFormSubmit}
          isLoading={isSubmitting}
          loadingText="Saving..."
        >
          {existingCriteria ? 'Update' : 'Add'}
        </Button>
      </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddEditCriteriaModal;
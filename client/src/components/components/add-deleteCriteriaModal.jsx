/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, FormControl, FormLabel, Input, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Tag, TagLabel, TagLeftIcon, IconButton } from '@chakra-ui/react'
import { AddIcon, DeleteIcon } from '@chakra-ui/icons'


const AddEditCriteriaModal = ({ isOpen, onClose, onSubmit, existingCriteria, totalWeight }) => {
  const [name, setName] = useState(existingCriteria ? existingCriteria.name : '')
  const [weight, setWeight] = useState(existingCriteria ? existingCriteria.weight : 0)
  const [subquestions, setSubquestions] = useState(existingCriteria ? existingCriteria.subquestions : [''])

  useEffect(() => {
    if (existingCriteria) {
      setName(existingCriteria.name)
      setWeight(existingCriteria.weight)
      setSubquestions(existingCriteria.subquestions)
    }
  }, [existingCriteria])

  const handleAddSubquestion = () => {
    setSubquestions([...subquestions, ''])
  }

  const handleRemoveSubquestion = (index) => {
    const newSubquestions = [...subquestions]
    newSubquestions.splice(index, 1)
    setSubquestions(newSubquestions)
  }

  const handleSubquestionChange = (index, value) => {
    const newSubquestions = [...subquestions]
    newSubquestions[index] = value
    setSubquestions(newSubquestions)
  }

  const handleFormSubmit = () => {
    if (weight + totalWeight > 100) {
      alert('Total weight exceeds 100%. Please adjust.')
      return
    }
    onSubmit({ name, weight, subquestions })
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{existingCriteria ? 'Edit Criteria' : 'Add Criteria'}</ModalHeader>
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
            <FormLabel>Weight</FormLabel>
            <Slider value={weight} onChange={(value) => setWeight(value)} min={0} max={100} step={1}>
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
            <Tag size="lg" mt={2} borderRadius="full" variant="outline">
              <TagLeftIcon as={AddIcon} />
              <TagLabel>{weight}%</TagLabel>
            </Tag>
          </FormControl>

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
                />
              </div>
            ))}
            <Button leftIcon={<AddIcon />} onClick={handleAddSubquestion}>
              Add Subquestion
            </Button>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handleFormSubmit}>
            {existingCriteria ? 'Update' : 'Add'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}


export default AddEditCriteriaModal;

import{ useState } from "react";
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
  Select,
  Input,
  Checkbox,
  Text,
} from "@chakra-ui/react";
import PropTypes from "prop-types";

ScheduleModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  startups: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  judges: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  rooms: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  rounds: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export function ScheduleModal({
  isOpen,
  onClose,
  startups,
  judges,
  rooms,
  rounds,
  onSubmit,
}) {
  const [formData, setFormData] = useState({
    startup: "",
    judges: [],
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    room: "",
    remoteLink: "",
    round: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prevData) => {
        const updatedJudges = checked
          ? [...prevData.judges, value]
          : prevData.judges.filter((judge) => judge !== value);
        return { ...prevData, [name]: updatedJudges };
      });
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose(); // Close modal after submission
  };

  

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Schedule Event</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit}>
            {/* Startup Name */}
            <FormControl mb={4}>
              <FormLabel>Select Startup Name</FormLabel>
              <Select
                name="startup"
                value={formData.startup}
                onChange={handleChange}
              >
                <option value="">Select a startup</option>
                {startups.map((startup) => (
                  <option key={startup.id} value={startup.id}>
                    {startup.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            {/* Judges */}
            <FormControl mb={4}>
              <FormLabel>Select Judges</FormLabel>
              {judges.map((judge) => (
                <Checkbox
                  key={judge.id}
                  name="judges"
                  value={judge.id}
                  isChecked={formData.judges.includes(judge.id)}
                  onChange={handleChange}
                >
                  {judge.name}
                </Checkbox>
              ))}
              <Text fontSize="sm" color="gray.500">
                * Minimum of 3 judges
              </Text>
            </FormControl>

            {/* Room */}
            <FormControl mb={4}>
              <FormLabel>Select Room</FormLabel>
              <Select
                name="room"
                value={formData.room}
                onChange={handleChange}
              >
                <option value="">Select a room</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
                ))}
                <option value="Remote">Remote Room</option>
              </Select>
              {formData.room === "Remote" && (
                <Input
                  mt={2}
                  name="remoteLink"
                  value={formData.remoteLink}
                  onChange={handleChange}
                  placeholder="Enter remote link"
                />
              )}
            </FormControl>

            {/* Round */}
            <FormControl mb={4}>
              <FormLabel>Select Round</FormLabel>
              <Select
                name="round"
                value={formData.round}
                onChange={handleChange}
              >
                <option value="">Select a round</option>
                {rounds.map((round) => (
                  <option key={round.id} value={round.id}>
                    {round.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Submit
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

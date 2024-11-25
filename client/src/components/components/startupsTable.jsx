import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Box,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import PropTypes from 'prop-types';

const StartupTable = ({ startups, onEdit, onDelete }) => {
  return (
    <Box overflowX="auto" bg='white' padding='5px' borderRadius="md"> 
      <Table variant="simple">
        <Thead >
          <Tr>
            <Th>Startup Name</Th>
            <Th>Category</Th>
            <Th>Team Lead</Th>
            <Th>Email</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {startups.map((startup, index) => (
            <Tr key={index}>
              <Td>{startup.name}</Td>
              <Td>{startup.category}</Td>
              <Td>{startup.teamLead}</Td>
              <Td>{startup.email}</Td>
              <Td>
                <IconButton
                  aria-label="Edit"
                  icon={<EditIcon/>}
                  size="sm"
                  color="black"
                  onClick={() => onEdit(startup)}
                  mr={2}
                />
                <IconButton
                  aria-label="Delete"
                  icon={<DeleteIcon/>}
                  size="sm"
                  color="black"
                  onClick={() => onDelete(startup.id)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};


StartupTable.propTypes = {
  startups: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      teamLead: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default StartupTable;

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Box,
  Spinner,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import PropTypes from 'prop-types';
import { useState } from 'react';

const StartupTable = ({ startups, onEdit, onDelete }) => {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (startupId) => {
    setDeletingId(startupId);
    try {
      await onDelete(startupId);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Box overflowX="auto" bg='white' padding='5px' borderRadius="md"> 
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Startup Name</Th>
            <Th>Category</Th>
            <Th>Team Lead</Th>
            <Th>Email</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {startups.map((startup) => (
            <Tr key={startup._id}>
              <Td>{startup.name}</Td>
              <Td>{startup.category}</Td>
              <Td>{startup.teamLeader}</Td>
              <Td>{startup.email}</Td>
              <Td>
                <IconButton
                  aria-label="Edit"
                  icon={<EditIcon />}
                  size="sm"
                  color="black"
                  onClick={() => onEdit(startup)}
                  mr={2}
                  isDisabled={deletingId === startup._id}
                />
                <IconButton
                  aria-label="Delete"
                  icon={deletingId === startup._id ? <Spinner size="sm" /> : <DeleteIcon />}
                  size="sm"
                  color="black"
                  onClick={() => handleDelete(startup._id)}
                  isDisabled={deletingId === startup._id}
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
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      teamLeader: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default StartupTable;
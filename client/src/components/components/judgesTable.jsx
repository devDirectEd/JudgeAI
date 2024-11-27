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

const JudgesTable = ({ judges, onEdit, onDelete }) => {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (judgeId) => {
    setDeletingId(judgeId);
    try {
      await onDelete(judgeId);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Box overflowX="auto" bg='white' padding='5px' borderRadius="md">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Entity ID</Th>
            <Th>Name</Th>
            <Th>Expertise</Th>
            <Th>Email</Th>
            <Th>Current Load</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {judges.map((judge) => (
            <Tr key={judge._id}>
              <Td>{judge.entityId}</Td>
              <Td>{`${judge.firstname} ${judge.lastname}`}</Td>
              <Td>{judge.expertise}</Td>
              <Td>{judge.email}</Td>
              <Td className="text-center">{judge.schedules?.length || 0}</Td>
              <Td>
                <IconButton
                  aria-label="Edit Judge"
                  icon={<EditIcon />}
                  size="sm"
                  color="black"
                  onClick={() => onEdit(judge)}
                  mr={2}
                  isDisabled={deletingId === judge._id}
                />
                <IconButton
                  aria-label="Delete Judge"
                  icon={deletingId === judge._id ? <Spinner size="sm" /> : <DeleteIcon />}
                  size="sm"
                  color="black"
                  onClick={() => handleDelete(judge._id)}
                  isDisabled={deletingId === judge._id}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

JudgesTable.propTypes = {
  judges: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      entityId: PropTypes.string.isRequired,
      firstname: PropTypes.string.isRequired,
      lastname: PropTypes.string.isRequired,
      expertise: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      password: PropTypes.string,
      schedules: PropTypes.array,
      createdAt: PropTypes.string,
      updatedAt: PropTypes.string,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default JudgesTable;
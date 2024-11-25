/* eslint-disable react/prop-types */
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Box,
  Text,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";

// In RoundsTable, update the onEdit function to pass the index instead of the round object
const RoundsTable = ({ rounds, onEdit, onDelete }) => {
  return (
    <Box overflowX="auto">
      {rounds.length === 0 ? (
        <Box textAlign="center" p={5}  borderRadius="md">
          <Text fontSize="lg" fontWeight="bold" mb={3}>
            Oops! Seems no round has been added.
          </Text>
        </Box>
      ) : (
        <Table variant="simple" w='full' bg='white' padding='5px' borderRadius='md' my='10px'>
          <Thead>
            <Tr>
              <Th w={"85%"}>Round Name</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {rounds.map((round, index) => (
              <Tr key={index}>
                <Td>{round.name}</Td>
                <Td>
                <IconButton
                  aria-label="Edit"
                  icon={<EditIcon/>}
                  size="sm"
                  color="black"
                  onClick={() => onEdit(round)}
                  mr={2}
                />
                <IconButton
                  aria-label="Delete"
                  icon={<DeleteIcon/>}
                  size="sm"
                  color="black"
                  onClick={() => onDelete(index)}
                />
              </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default RoundsTable;
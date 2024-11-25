/* eslint-disable react/prop-types */
import { Table, Tbody, Td, Th, Thead, Tr, Slider, Box, Text } from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import {
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  IconButton,
  Stack,
  Switch
} from '@chakra-ui/react'


export const CriteriaTable = ({ criteria, onEdit, onDelete }) => {
  console.log('Rendering CriteriaTable'); // Log when CriteriaTable renders
  return (
    <Box bg='white' padding='5px' borderRadius='md'>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "7px" }}>
        {/* Title on the Left */}
        <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Evaluation Criteria</h2>
      </div>

      {/* No Criteria Message */}
      {criteria.length === 0 ? (
        <Box textAlign="center" p={5} borderRadius="md">
          <Text fontSize="lg" fontWeight="bold" mb={3}>Oops! Seems no criteria has been added.</Text>
        </Box>
      ) : (
        <Table variant="simple" bg='white' overflowX="auto" borderRadius="md" >
          <Thead>
            <Tr>
              <Th></Th>
              <Th w="50%"></Th>
              <Th></Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {criteria.map((item, index) => (
              <Tr key={index}>
                <Td>
                <Text color='black' fontWeight={'semibold'} fontSize={"lg"}>{item.name} </Text>
                  <div>
                    <Stack direction='row'>
                      <Text color='black' fontWeight={"light"} fontSize={"sm"}>Subquestions </Text>
                      <Switch disabled="true"  value={true}/>
                    </Stack>
                  </div>
                </Td>
                <Td>
                  <Slider value={item.weight} isReadOnly>
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                  </Slider>
                </Td>
                <Td>{item.weight}%</Td>
                <Td>
                <IconButton
                  aria-label="Edit"
                  icon={<EditIcon/>}
                  size="sm"
                  color="black"
                  onClick={() => onEdit(item)}
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
  )
}




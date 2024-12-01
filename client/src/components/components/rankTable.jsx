import { Table, Tbody, Td, Th, Thead, Tr, Tag, TagLabel, TagLeftIcon, Button, useToast } from "@chakra-ui/react";
import { StarIcon, ViewIcon } from "@chakra-ui/icons";
import PropTypes from "prop-types";
import { Loader2 } from "lucide-react";

const RankingsTable = ({ rankings = {}, loading }) => {
  const rankingsArray = Array.isArray(rankings.rankings) ? rankings.rankings : [];
  const toast = useToast();

  // eslint-disable-next-line no-unused-vars
  const handleViewDetails = (startupId) => {
    try {
      // Your logic here
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to view details",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Table variant="simple" bg="white" padding="5px" borderRadius="md">
      <Thead>
        <Tr>
          <Th>Rank</Th>
          <Th>Startup Name</Th>
          <Th>Score</Th>
          <Th></Th>
        </Tr>
      </Thead>
      <Tbody>
        {loading ? (
          <Tr>
            <Td colSpan={4} textAlign="center" py={4}>
              <div className="flex justify-center items-center">
                <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
              </div>
            </Td>
          </Tr>
        ) : rankingsArray.length === 0 ? (
          <Tr>
            <Td colSpan={4} textAlign="center">No rankings available</Td>
          </Tr>
        ) : (
          rankingsArray.map((startup, index) => (
            <Tr key={startup.startupId}>
              <Td>{index + 1}</Td>
              <Td>{startup.startupName}</Td>
              <Td>
                <Tag size="lg" border="1px solid blackAlpha500" bg="blackAlpha.200" borderRadius="full">
                  <TagLeftIcon color="yellow" as={StarIcon} />
                  <TagLabel color="black">{startup.overallScore.toFixed(2)}</TagLabel>
                </Tag>
              </Td>
              <Td>
                <Button
                  leftIcon={<ViewIcon />}
                  variant="outline"
                  color="black"
                  bg="blackAlpha.100"
                  size="sm"
                  onClick={() => handleViewDetails(startup.startupId)}
                >
                  View Detailed Analysis
                </Button>
              </Td>
            </Tr>
          ))
        )}
      </Tbody>
    </Table>
  );
};

RankingsTable.propTypes = {
  rankings: PropTypes.shape({
    rankings: PropTypes.arrayOf(
      PropTypes.shape({
        startupId: PropTypes.string.isRequired,
        startupName: PropTypes.string.isRequired,
        overallScore: PropTypes.number.isRequired,
      })
    ),
    summary: PropTypes.shape({
      averageScore: PropTypes.number,
      totalEvaluations: PropTypes.number,
      totalStartups: PropTypes.number,
    }),
  }),
  loading: PropTypes.bool,
};

export default RankingsTable;
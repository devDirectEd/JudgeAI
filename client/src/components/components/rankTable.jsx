import { useState } from "react";
import { Table, Tbody, Td, Th, Thead, Tr, Tag, TagLabel, TagLeftIcon, Button, Box, VStack } from "@chakra-ui/react";
import { StarIcon, ViewIcon } from "@chakra-ui/icons";
import PropTypes from "prop-types";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// Predefined color palette of light, bright, and not-too-saturated colors
const colorPalette = [
  "#F5A623", "#50E3C2", "#B8E986", "#4A90E2", "#D0021B", 
  "#F8E71C", "#7ED321", "#8B572A", "#9B9B9B", "#E94E77", 
  "#5B9BD5", "#8C6E4B", "#7F8C8D", "#D35400", "#00BFFF", 
  "#FF6347", "#D5B2D2", "#8E44AD", "#F1C40F", "#2ECC71"
];

// Function to generate a random color from the palette
const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * colorPalette.length);
  return colorPalette[randomIndex];
};

const RankingsTable = ({ startups }) => {
  const [selectedStartup, setSelectedStartup] = useState(null);

  // Assign random colors to criteria when a startup is selected
  const assignColorsToCriteria = (criteria) =>
    criteria.map((c) => ({
      ...c,
      color: c.color || getRandomColor(), // Assign a color only if not already assigned
    }));

  // Function to generate the chart data
  const generateChartData = (startup) => {
    const criteria = assignColorsToCriteria(startup.criteria); // Ensure criteria have colors
    const labels = criteria.map((c) => c.name); // X-axis labels (criteria names)
    const data = criteria.map((c) => c.rating); // Y-axis values (ratings)

    return {
      labels,
      datasets: [
        {
          label: "Ratings",
          data,
          backgroundColor: criteria.map((c) => c.color), // Use color for each bar
          borderWidth: 1,
        },
      ],
    };
  };

  // Dummy options for the chart
  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        min: 1,
        max: 5,
        ticks: {
          callback: (value) => {
            const ratings = ["😶", "🙁", "🙂", "😁", "🤩"];
            return ratings[value - 1];
          },
        },
      },
      x: {
        ticks: {
          autoSkip: false,
        },
      },
    },
  };

  return (
    <Box>
      {selectedStartup && (
        <VStack spacing={4} align="start" mb={4} bg='white' padding='10px' borderRadius='md'>
          <Box>
            <h3 style={{ fontWeight: "bold", fontSize: "20px" }}>{selectedStartup.name}</h3>
          </Box>
          <Box display="flex" alignItems="center">
            <Box flex={1}>
              <Bar data={generateChartData(selectedStartup)} options={chartOptions} />
            </Box>
          </Box>
        </VStack>
      )}

      <Table variant="simple" bg='white' padding='5px' borderRadius='md'>
        <Thead>
          <Tr>
            <Th>Rank</Th>
            <Th>Startup Name</Th>
            <Th>Rating</Th>
            <Th></Th> {/* No title for the last column */}
          </Tr>
        </Thead>
        <Tbody>
          {startups.map((startup, index) => (
            <Tr key={startup.id}>
              <Td>{index + 1}</Td>
              <Td>{startup.name}</Td>
              <Td>
                <Tag size="lg" border="1px solid blackAlpha500" bg='blackAlpha.200' borderRadius="full">
                  <TagLeftIcon color="yellow" as={StarIcon} />
                  <TagLabel color='black'>{startup.rating}</TagLabel>
                </Tag>
              </Td>
              <Td>
                <Button
                  leftIcon={<ViewIcon />}
                  variant="outline"
                  color="black"
                  bg="blackAlpha.100"
                  size="sm"
                  onClick={() => setSelectedStartup(startup)}
                >
                  View Detailed Analysis
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

RankingsTable.propTypes = {
  startups: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      startupName: PropTypes.string.isRequired,
      rating: PropTypes.number.isRequired,
      criteria: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          rating: PropTypes.number.isRequired,
          color: PropTypes.string, 
        })
      ).isRequired,
    })
  ).isRequired,
};

export default RankingsTable;

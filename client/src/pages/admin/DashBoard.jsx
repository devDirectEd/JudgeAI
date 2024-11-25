import { useEffect, useState } from "react";
import { Box, HStack, VStack, Spinner, useToast } from "@chakra-ui/react";
import { FaChartBar, FaUsers, FaCalendarAlt, FaStar } from "react-icons/fa";
import DynamicStat from "../../components/components/DynamicStat";
import Header from "../../components/components/Header";
import CustomTabs from "@/components/components/tabs";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const toast = useToast();

  useEffect(() => {
    // Fetch stats data from the backend
    const fetchStats = async () => {
      try {
        /*const response = await fetch("/api/stats"); // Replace with API endpoint
        if (!response.ok) throw new Error("Failed to fetch stats");
        // eslint-disable-next-line no-unused-vars
        const data = await response.json();*/
        // Simulate delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Dummy data
        const dummyData = {
          totalStartups: "150",
          newStartups: "20",
          activeJudges: "10",
          allAssigned: false,
          assignedJudges: "7",
          upcomingPitches: "5",
          averageScore: "8.7",
        };
        setStats(dummyData);
      } catch (error) {
        console.error(error);
        toast({
          title: "Error fetching stats",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchStats();
  }, [toast]);

  if (!stats) {
    return (
      <VStack minHeight="100vh" justifyContent="center">
        <Spinner size="xl" />
      </VStack>
    );
  }

  return (
    <div className="bg-background">
    <Header />
    <Box padding={8}>
      {/* Dynamic Stats Section */}
      <HStack spacing={8} mb={8}>
        <DynamicStat
          label="Total Startups"
          mainText={stats.totalStartups}
          helpText={`${stats.newStartups} startups from last round`}
          IconComponent={FaChartBar}
        />
        <DynamicStat
          label="Active Judges"
          mainText={stats.activeJudges}
          helpText={
            stats.allAssigned
              ? "All assigned"
              : `${stats.assignedJudges} assigned`
          }
          IconComponent={FaUsers}
        />
        <DynamicStat
          label="Upcoming Pitches"
          mainText={stats.upcomingPitches}
          helpText="Next 24 hours"
          IconComponent={FaCalendarAlt}
        />
        <DynamicStat
          label="Average Score"
          mainText={stats.averageScore}
          helpText="out of 10"
          IconComponent={FaStar}
        />
      </HStack>

      {/* Additional Content */}
      <Box>
        <CustomTabs />
      </Box>
    </Box>
    </div>
  );
};

export default Dashboard;

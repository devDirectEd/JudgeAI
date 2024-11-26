import { useEffect, useState } from "react";
import { Spinner, useToast } from "@chakra-ui/react";
import { FaChartBar, FaUsers, FaCalendarAlt, FaStar } from "react-icons/fa";
import DynamicStat from "../../components/components/DynamicStat";
import Header from "../../components/components/Header";
import CustomTabs from "@/components/components/tabs";
import axiosInstance from "@/redux/axiosInstance";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get("/admin/metrics")
        console.log(response)
        const dummyData = {
          totalStartups: response.data.totalStartups,
          newStartups: "20",
          activeJudges: response.data.totalJudges,
          allAssigned: false,
          assignedJudges: "7",
          upcomingPitches: response.data.upcomingPitches,
          averageScore: response.data.averageScore,
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
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="p-4 md:p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="w-full">
            <DynamicStat
              label="Total Startups"
              mainText={stats.totalStartups}
              helpText={`${stats.newStartups} startups from last round`}
              IconComponent={FaChartBar}
            />
          </div>
          <div className="w-full">
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
          </div>
          <div className="w-full">
            <DynamicStat
              label="Upcoming Pitches"
              mainText={stats.upcomingPitches}
              helpText="Next 24 hours"
              IconComponent={FaCalendarAlt}
            />
          </div>
          <div className="w-full">
            <DynamicStat
              label="Average Score"
              mainText={stats.averageScore}
              helpText="out of 10"
              IconComponent={FaStar}
            />
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-lg shadow">
          <CustomTabs />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
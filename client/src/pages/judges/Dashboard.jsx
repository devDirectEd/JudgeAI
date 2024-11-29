import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import JudgesHeader from "../../components/components/JudgesHeader"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"
import PropTypes from 'prop-types'
import { useNavigate } from "react-router-dom"
import CalendarSchedule from "@/components/components/CalenderSchedule"
import axiosInstance from "@/redux/axiosInstance"
import { useSelector } from "react-redux"
import { format } from "date-fns"
import { Spinner } from "@chakra-ui/react"

const PastEvaluations = ({ evaluations, navigate, isLoadingEvaluations }) => (
  <Card className="p-4 bg-[#242424] text-[#F8FAF7] border-0">
    <h2 className="text-lg font-semibold mb-4">Past Evaluations</h2>
    <Table className="bg-white rounded-lg">
      <TableHeader>
        <TableRow>
          <TableHead>Company</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Score</TableHead>
          <TableHead>Nominated</TableHead>
          <TableHead>To be Mentored</TableHead>
          <TableHead>Meet Startup</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="bg-[#404040]">
        {isLoadingEvaluations ? (
          <TableRow>
            <TableCell colSpan={7} className="bg-[#404040]">
              <div className="flex justify-center items-center p-8">
                <Spinner size="lg" color="blue.500" />
              </div>
            </TableCell>
          </TableRow>
        ) : (
          evaluations.map((evaluation) => (
            <TableRow key={evaluation._id} className="hover:bg-[#444444]">
              <TableCell>{evaluation.startupId.name || "N/A"}</TableCell>
              <TableCell>{new Date(evaluation.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <span className="rounded-full px-4 py-2 w-20 h-[30px] border-black border flex justify-center items-center gap-2">
                  <img src="/star-01.svg" alt="star" width={16} height={16} /> 
                  <p>{evaluation.totalScore}</p>
                </span>
              </TableCell>
              <TableCell>
                <span className={`rounded-full px-4 py-2 ${
                  evaluation.nominateNextRound ? 'bg-[#DCFCE7] text-[#65AF4F]' : 'bg-[#F4F4F5] text-black'
                }`}>
                  {evaluation.nominateNextRound ? 'Yes' : 'No'}
                </span>
              </TableCell>
              <TableCell>
                <span className={`rounded-full px-4 py-2 ${
                  evaluation.mentorStartup ? 'bg-[#DCFCE7] text-[#65AF4F]' : 'bg-[#F4F4F5] text-black'
                }`}>
                  {evaluation.mentorStartup ? 'Yes' : 'No'}
                </span>
              </TableCell>
              <TableCell>
                <span className={`rounded-full px-4 py-2 ${
                  evaluation.meetStartup ? 'bg-[#DCFCE7] text-[#65AF4F]' : 'bg-[#F4F4F5] text-black'
                }`}>
                  {evaluation.meetStartup ? 'Yes' : 'No'}
                </span>
              </TableCell>
              <TableCell>
                <Button 
                  onClick={() => navigate(`/judge/dashboard/edit/${evaluation._id}`)}
                  variant="secondary" 
                  size="sm" 
                  className="bg-[#387C80] text-white hover:bg-teal-700"
                >
                  Review and Edit
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
    <div className="mt-4 text-sm text-muted-foreground">
      Showing {evaluations.length} evaluation{evaluations.length > 1 ? "s": ""}
    </div>
  </Card>
);

PastEvaluations.propTypes = {
  evaluations: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    startupId: PropTypes.shape({
      name: PropTypes.string,
    }),
    createdAt: PropTypes.string.isRequired,
    totalScore: PropTypes.number.isRequired,
    nominateNextRound: PropTypes.bool.isRequired,
    mentorStartup: PropTypes.bool.isRequired,
    meetStartup: PropTypes.bool.isRequired,
  })).isRequired,
  navigate: PropTypes.func.isRequired,
  isLoadingEvaluations: PropTypes.bool.isRequired
};


export default function Dashboard() {
  const navigate = useNavigate();
  const { userId } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [scheduleData, setScheduleData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);
  const [evaluations, setEvaluations] = useState([]);
  const [isLoadingEvaluations, setIsLoadingEvaluations] = useState(false);

  const fetchEvaluations = async () => {
    setIsLoadingEvaluations(true);
    try {
      const response = await axiosInstance.get("/evaluations?self=true");
      setEvaluations(response.data);
    } catch (error) {
      console.error("Error fetching evaluations:", error);
    } finally {
      setIsLoadingEvaluations(false);
    }
  };


  const fetchSchedules = async (date) => {
    if (!date) return;
    
    setIsLoadingSchedule(true);
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const response = await axiosInstance.get(`/judges/schedules?self=true&start=${formattedDate}&end=${formattedDate}`);
      
      if (response.data) {
        const sortedData = [...response.data].sort((a, b) => {
          const timeA = a.startTime.replace(':', '');
          const timeB = b.startTime.replace(':', '');
          return timeA.localeCompare(timeB);
        });
        setScheduleData(sortedData);
      }
    } catch (error) {
      console.error("Error fetching schedules:", error);
      setScheduleData([]);
    } finally {
      setIsLoadingSchedule(false);
    }
  };

  const handleDateSelect = async (date) => {
    setSelectedDate(date);
    await fetchSchedules(date);
  };

  // Initial load of schedules
  useEffect(() => {
    fetchSchedules(selectedDate);
    fetchEvaluations()
  }, [selectedDate, userId]);

  const handleScoreNextStartup = () => {
    if (scheduleData.length > 0) {
      const firstSchedule = scheduleData[0];
      setActiveTab("scoring");
      navigate(`/judge/dashboard/score/${firstSchedule._id}`);
    }
  };  

  return (
    <div className="min-h-screen bg-[#171717]">
      <JudgesHeader 
        activeTab={activeTab} 
        selectedDate={selectedDate}
        scheduleData={scheduleData}
        evaluationsCount={evaluations.length}
      />
      
      <main className="container mx-auto p-6">
        <Tabs 
          defaultValue="dashboard" 
          className="w-full"
          onValueChange={setActiveTab}
        >
          <div className="flex justify-between items-center mb-4">
            <TabsList className="bg-[#404040]">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            
            {activeTab === "dashboard" && (
            <Button 
              onClick={handleScoreNextStartup} 
              disabled={isLoadingSchedule || scheduleData.length === 0}
              variant="sm" 
              className="bg-[#387C80] text-white hover:bg-[#387C80] hover:opacity-85 disabled:opacity-50"
            >
              {isLoadingSchedule ? "Loading..." : "Score next Startup"}
            </Button>
          )}
          </div>

          <TabsContent value="dashboard">
            <CalendarSchedule 
              scheduleData={scheduleData} 
              onScoreStartup={(id) => {
                setActiveTab("scoring");
                navigate(`/judge/dashboard/score/${id}`);
              }}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              isLoadingSchedule={isLoadingSchedule}
            />
          </TabsContent>
          <TabsContent value="history">
              <PastEvaluations evaluations={evaluations} navigate={navigate} isLoadingEvaluations={isLoadingEvaluations} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
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

// Also update evaluation dates
const initialEvaluationsData = [
  { id: "e1", company: "AI Vision Corp", date: "2024-11-19", score: 4.5, nominated: true, toBeMentored: false, meetStartup: false },
  { id: "e2", company: "NLP Innovations", date: "2024-11-19", score: 4.5, nominated: false, toBeMentored: false, meetStartup: true },
  { id: "e3", company: "Tech Innovators", date: "2024-11-19", score: 4.5, nominated: true, toBeMentored: false, meetStartup: false },
  { id: "e4", company: "DataViz AI", date: "2024-11-20", score: 4.5, nominated: false, toBeMentored: true, meetStartup: false },
  { id: "e5", company: "AI Analytics", date: "2024-11-20", score: 4.5, nominated: false, toBeMentored: false, meetStartup: true },
  { id: "e6", company: "Neural Systems", date: "2024-11-20", score: 4.5, nominated: true, toBeMentored: false, meetStartup: false }
];

// Helper function to convert 12-hour format to 24-hour format for sorting
const convertTo24Hour = (time12h) => {
  // Handle the case where time is already in 24-hour format
  if (!time12h.includes('AM') && !time12h.includes('PM')) {
    return time12h;
  }

  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':');
  
  // Convert hours to number for calculation
  hours = parseInt(hours, 10);
  
  if (modifier === 'PM' && hours < 12) {
    hours = hours + 12;
  }
  if (modifier === 'AM' && hours === 12) {
    hours = 0;
  }
  
  // Convert back to string and pad
  return `${String(hours).padStart(2, '0')}:${minutes}`;
};


const transformScheduleData = (apiData) => {
  return apiData.map(item => {
    // Convert API date format to match the expected format
    const dateObj = new Date(item.date);
    const formattedDate = dateObj.toISOString().split('T')[0];

    return {
      id: item._id,
      startupId: item.startupId, 
      startup: item.startupId,
      startTime: item.startTime,
      endTime: item.endTime,
      room: item.room,
      date: formattedDate
    };
  }).sort((a, b) => {
    // First sort by date
    if (a.date !== b.date) {
      return new Date(a.date) - new Date(b.date);
    }
    // Then sort by time
    try {
      const timeA = convertTo24Hour(a.startTime);
      const timeB = convertTo24Hour(b.startTime);
      return timeA.localeCompare(timeB);
    } catch (error) {
      console.error('Error sorting times:', error);
      return 0; // Keep original order if there's an error
    }
  });
};

// Define prop types for evaluation data
const evaluationItemPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  company: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  nominated: PropTypes.bool.isRequired,
  toBeMentored: PropTypes.bool.isRequired,
  meetStartup: PropTypes.bool.isRequired,
});

const useLocalStorageData = (key, initialData) => {
  const [data, setData] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialData;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialData;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, data]);

  return [data, setData];
};

const PastEvaluations = ({ evaluationsData }) => (
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
        {evaluationsData.map((evaluation) => (
          <TableRow key={evaluation.id}>
            <TableCell>{evaluation.company}</TableCell>
            <TableCell>{evaluation.date}</TableCell>
            <TableCell>
              <span className="rounded-full px-4 py-2 w-16 h-[30px] border-black border flex justify-center items-center gap-2">
                <img src="/star-01.svg" alt="star" width={16} height={16} /> 
                <p>{evaluation.score}</p>
              </span>
            </TableCell>
            <TableCell>
              <span className={`rounded-full px-4 py-2 ${
                evaluation.nominated ? 'bg-[#DCFCE7] text-[#65AF4F]' : 'bg-[#F4F4F5] text-black'
              }`}>
                {evaluation.nominated ? 'Yes' : 'No'}
              </span>
            </TableCell>
            <TableCell>
              <span className={`rounded-full px-4 py-2 ${
                evaluation.toBeMentored ? 'bg-[#DCFCE7] text-[#65AF4F]' : 'bg-[#F4F4F5] text-black'
              }`}>
                {evaluation.toBeMentored ? 'Yes' : 'No'}
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
              <Button variant="secondary" size="sm" className="bg-[#387C80] text-white hover:bg-teal-700">
                Review and Edit
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    <div className="mt-4 text-sm text-muted-foreground">
      Show {evaluationsData.length} of 20 evaluations
    </div>
  </Card>
);

PastEvaluations.propTypes = {
  evaluationsData: PropTypes.arrayOf(evaluationItemPropType).isRequired,
};

// Rest of the Dashboard component remains the same...
export default function Dashboard() {
  const navigate = useNavigate();
  const { userId } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [scheduleData, setScheduleData] = useState([]);
  const [evaluationsData, setEvaluationsData] = useLocalStorageData("evaluationsData", initialEvaluationsData);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await axiosInstance.get(`/api/v1/judges/${userId}/schedules`);

        if (response.data) {
          const transformedData = transformScheduleData(response.data);
          setScheduleData(transformedData);
        }
      } catch (error) {
        console.error(error);
        setScheduleData([]);
      }
    };

    loadData();
  }, [setEvaluationsData, userId]);

  const handleScoreNextStartup = () => {
    if (scheduleData.length > 0) {
      setActiveTab("scoring");
      navigate(`/judge/dashboard/score/${scheduleData[0].startupId}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#171717]">
      <JudgesHeader 
        activeTab={activeTab} 
        selectedDate={selectedDate}
        scheduleData={scheduleData}
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
              <Button onClick={handleScoreNextStartup} variant="sm" className="bg-[#387C80] text-white hover:bg-[#387C80] hover:opacity-85">
                Score next Startup
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
              onDateSelect={setSelectedDate}
            />
          </TabsContent>

          <TabsContent value="history">
            <PastEvaluations evaluationsData={evaluationsData} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
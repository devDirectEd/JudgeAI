import { Card, CardTitle } from "@/components/ui/card";
import PropTypes from 'prop-types';
import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import { format, isToday, isYesterday, isTomorrow } from "date-fns";

const StatCard = ({ title, value, subtitle }) => {
  return (
    <Card className="p-4 bg-[#242424] text-[#F8FAF7] border border-black">
      <CardTitle className="mb-4">{title}</CardTitle>
      <div className="flex items-center gap-2">
        <h3 className="text-4xl font-bold text-[#FFFFFF]">{value}</h3>
      </div>
      <p className="text-sm text-muted-foreground text-white">{subtitle}</p>
    </Card>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  subtitle: PropTypes.string.isRequired,
};

export default function JudgesHeader({ activeTab, selectedDate = new Date(), scheduleData = [] }) {    
    const [totalScheduleCount, setTotalScheduleCount] = useState(0);
    const [evaluationsCount, setEvaluationsCount] = useState(0);
    const [todayScheduleCount, setTodayScheduleCount] = useState(0);

    const getScheduleTitle = (date) => {
        if (isToday(date)) return "Today's Schedule";
        if (isTomorrow(date)) return "Tomorrow's Schedule";
        if (isYesterday(date)) return "Yesterday's Schedule";
        return `Schedule for ${format(date, 'MMMM d, yyyy')}`;
    };

    useEffect(() => {
        // Get evaluations count from localStorage
        const storedEvaluations = localStorage.getItem("evaluationsData");
        if (storedEvaluations) {
            const evaluations = JSON.parse(storedEvaluations);
            setEvaluationsCount(evaluations.length);
        }

        // Calculate schedule counts
        setTotalScheduleCount(scheduleData.length);

        // Count today's schedules
        const today = new Date();
        const todaySchedules = scheduleData.filter(schedule => 
            new Date(schedule.date).toDateString() === today.toDateString()
        );
        setTodayScheduleCount(todaySchedules.length);

    }, [scheduleData]);

    // Get selected date schedule count
    const selectedDateSchedules = scheduleData.filter(schedule => 
        new Date(schedule.date).toDateString() === selectedDate.toDateString()
    );

    return (
        <div className="text-white">
            <article>
                <Navbar />
            </article>
            <div className="container mx-auto p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-white">
                        {activeTab === "dashboard" ? "Hero Dashboard" : activeTab === "scoring" ? "Scoring" : "Evaluation History"}
                    </h1>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <StatCard 
                        title="Assigned Startups"
                        value={totalScheduleCount.toString()}
                        subtitle={`${todayScheduleCount} scheduled today`}
                    />
                    <StatCard 
                        title="Next Pitch"
                        value="--" 
                        subtitle="Check calendar for details"
                    />
                    <StatCard
                        title={getScheduleTitle(selectedDate)}
                        value={selectedDateSchedules.length.toString()}
                        subtitle="View in calendar below"
                    />
                    <StatCard 
                        title="Completed Evaluations"
                        value={evaluationsCount.toString()} 
                        subtitle={`${totalScheduleCount} pending reviews`}
                    />
                </div>
            </div>
        </div>
    );
}

JudgesHeader.propTypes = {
    activeTab: PropTypes.string.isRequired,
    selectedDate: PropTypes.instanceOf(Date),
    scheduleData: PropTypes.arrayOf(PropTypes.shape({
        date: PropTypes.string.isRequired,
    })),
};
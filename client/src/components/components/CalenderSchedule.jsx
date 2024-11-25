import PropTypes from 'prop-types';
import { Calendar } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format, isToday, isYesterday, isTomorrow } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";

const scheduleItemPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  startup: PropTypes.string.isRequired,
  startTime: PropTypes.string.isRequired,
  endTime: PropTypes.string.isRequired,
  room: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
});

const CalendarSchedule = ({ scheduleData, onScoreStartup, selectedDate, onDateSelect }) => {
  const getScheduleTitle = (date) => {
    if (isToday(date)) return "Today's Schedule";
    if (isTomorrow(date)) return "Tomorrow's Schedule";
    if (isYesterday(date)) return "Yesterday's Schedule";
    return `Schedule for ${format(date, 'MMMM d, yyyy')}`;
  };

  const handleDateSelect = (date) => {
    onDateSelect(date || new Date());
  };

  const filteredSchedule = scheduleData.filter(schedule => {
    const scheduleDate = new Date(schedule.date);
    return scheduleDate.toDateString() === selectedDate.toDateString();
  });

  return (
    <Card className="p-4 bg-[#242424] w-full border-0">
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-[#F8FAF7]">
            {getScheduleTitle(selectedDate)}
          </h2>
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="default"
                className="bg-[#404040] border-0 hover:bg-[#333333]"
              >
                <span className='text-white'>Pick A Date</span>
                <ChevronDown className="h-4 w-4 text-white" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                initialFocus
                className="bg-[#282828]"
                classNames={{
                  months: "space-y-2",
                  month: "space-y-2",
                  caption: "flex justify-center pt-1 relative items-center text-white",
                  caption_label: "text-sm font-medium",
                  nav: "space-x-1 flex items-center",
                  nav_button: "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 text-white",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex justify-between",
                  head_cell: "text-white rounded-md w-8 font-normal text-xs",
                  row: "flex w-full mt-1",
                  cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-transparent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                  day: "h-8 w-8 p-0 font-normal text-white aria-selected:opacity-100 hover:bg-[#387C80] rounded-sm",
                  day_selected: "bg-[#387C80] text-white hover:bg-[#387C80] hover:text-white focus:bg-[#387C80] focus:text-white",
                  day_today: "bg-[#404040] text-white",
                  day_outside: "opacity-50",
                  day_disabled: "opacity-50",
                  day_range_middle: "aria-selected:bg-[#387C80] aria-selected:text-white",
                  day_hidden: "invisible",
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <Table className="bg-[#F3F4F6] rounded-lg">
          <TableHeader>
            <TableRow>
              <TableHead>Startup ID</TableHead>
              <TableHead>Start time</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="font-medium bg-[#404040] text-[#F8FAF7]">
            {filteredSchedule.length > 0 ? (
              filteredSchedule.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell>{schedule.startupId}</TableCell>
                  <TableCell>{schedule.startTime}</TableCell>
                  <TableCell>{schedule.endTime}</TableCell>
                  <TableCell>{schedule.room}</TableCell>
                  <TableCell>
                    <Button 
                      className="bg-[#282828] text-white hover:bg-[#282828] hover:opacity-90"
                      onClick={() => onScoreStartup(schedule.startupId)}
                    >
                      Score Startup
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No schedules for this date
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

CalendarSchedule.propTypes = {
  scheduleData: PropTypes.arrayOf(scheduleItemPropType).isRequired,
  onScoreStartup: PropTypes.func.isRequired,
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  onDateSelect: PropTypes.func.isRequired,
};

export default CalendarSchedule;
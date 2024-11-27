/* eslint-disable react/prop-types */
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Box, Text } from '@chakra-ui/react';

export function ScheduleModal({ isOpen, onClose, startups, judges, rounds, onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({
    startup: '',
    judges: [],
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    room: '',
    remoteRoom: '',
    round: ''
  });

  const [selectedJudges, setSelectedJudges] = useState([]);

  const handleJudgeSelect = (value) => {
    const judge = judges.find(j => j.id === value);
    if (judge && !selectedJudges.find(j => j.id === judge.id)) {
      setSelectedJudges([...selectedJudges, judge]);
      // Store only the ID in the formData
      setFormData(prev => ({ ...prev, judges: [...prev.judges, judge.id] }));
    }
  };
  

  const removeJudge = (judgeId) => {
    setSelectedJudges(selectedJudges.filter(j => j.id !== judgeId));
    setFormData(prev => ({
      ...prev,
      judges: prev.judges.filter(id => id !== judgeId)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.judges.length < 3) {
      alert("Please select at least 3 judges");
      return;
    }
  
    // Ensure the form data matches the DTO format
    const submitData = {
      ...formData,
      // Don't need any transformation for IDs as we're already storing raw IDs
      roundId: formData.round,
      startupId: formData.startup,
      // Keep other fields as they are since they match the DTO
    };
  
    onSubmit(submitData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] overflow-scroll max-h-[96%]">
        <DialogHeader>
          <DialogTitle>Schedule Form</DialogTitle>
        </DialogHeader>
        <form className="space-y-6">
          <table className="w-full">
            <tbody>
              {/* Startup Selection */}
              <tr>
                <td className="py-4 w-1/3">
                  <label className="block text-sm font-medium">1. Select startup name.</label>
                </td>
                <td className="py-4">
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, startup: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select startup..." />
                    </SelectTrigger>
                    <SelectContent>
                      {startups.map((startup) => (
                        <SelectItem key={startup.id} value={startup.id}>
                          {startup.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
              </tr>

              {/* Judges Selection */}
              <tr>
                <td className="py-4">
                  <label className="block text-sm font-medium">2. Select Judges</label>
                  <span className="text-sm text-gray-500">(Minimum is 3 judges)</span>
                </td>
                <td className="py-4">
                  <Select onValueChange={handleJudgeSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select judges..." />
                    </SelectTrigger>
                    <SelectContent>
                      {judges.map((judge) => (
                        <SelectItem key={judge.id} value={judge.id}>
                          {judge.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Box mt={2} className="space-y-2">
                    {selectedJudges.map((judge) => (
                      <Text 
                        key={judge.id} 
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        {judge.name}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-red-500 hover:text-red-700"
                          onClick={() => removeJudge(judge.id)}
                        >
                          ×
                        </Button>
                      </Text>
                    ))}
                  </Box>
                </td>
              </tr>

              {/* Date Selection */}
              <tr>
                <td className="py-4">
                  <label className="block text-sm font-medium">3. Date</label>
                </td>
                <td className="py-4">
                  <Input 
                    type="date" 
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </td>
              </tr>

              {/* Time Selection */}
              <tr>
                <td className="py-4">
                  <label className="block text-sm font-medium">4. Time</label>
                </td>
                <td className="py-4">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <span>Start:</span>
                      <Input 
                        type="time" 
                        value={formData.startTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span>End:</span>
                      <Input 
                        type="time" 
                        value={formData.endTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                      />
                    </div>
                  </div>
                </td>
              </tr>

              {/* Room Selection */}
              <tr>
                <td className="py-4">
                  <label className="block text-sm font-medium">5. Add room (required).</label>
                  <span className="text-sm text-gray-500">Paste link if room is remote</span>
                </td>
                <td className="py-4 space-y-2">
                  <Input
                    type="text"
                    placeholder="Enter room..."
                    value={formData.room}
                    onChange={(e) => setFormData(prev => ({ ...prev, room: e.target.value }))}
                  />
                  {formData.room.toLowerCase() === 'remote' && (
                    <Input
                      type="text"
                      placeholder="Enter remote room link..."
                      value={formData.remoteRoom}
                      onChange={(e) => setFormData(prev => ({ ...prev, remoteRoom: e.target.value }))}
                    />
                  )}
                </td>
              </tr>

              {/* Round Selection */}
              <tr>
                <td className="py-4">
                  <label className="block text-sm font-medium">6. Select round.</label>
                  <span className="text-sm text-gray-500">This will determine what the live score form looks like.</span>
                </td>
                <td className="py-4">
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, round: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select round..." />
                    </SelectTrigger>
                    <SelectContent>
                      {rounds.map((round) => (
                        <SelectItem key={round.id} value={round.id}>
                          {round.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            className="bg-[#18181B] text-white hover:bg-[#27272A] disabled:bg-gray-400"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Schedule Session"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
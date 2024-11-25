import { Button } from "@/components/ui/button";
import { Pause, Play, RotateCcw } from "lucide-react";
import PropTypes from 'prop-types';

const ScoringTimer = ({ 
  status, 
  formattedTime, 
  onStart, 
  onPause, 
  onResume, 
  onStop,
  onReset,
  hasStarted 
}) => {
  if (!hasStarted) {
    return (
      <Button 
        className="bg-[#00A3FF] hover:bg-[#00A3FF] hover:opacity-85"
        onClick={onStart}
      >
        Start Timer
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {status === 'running' ? (
        <Pause onClick={onPause} className="h-7 w-7 text-[#f0eeee] hover:cursor-pointer" />
      ) : (
        <Play onClick={onResume} className="h-7 w-7 text-[#f0eeee] hover:cursor-pointer" />
      )}
      <span className="text-4xl text-[#f0eeee] font-bold min-w-[90px] m-auto">{formattedTime}</span>
      <div className="flex gap-2">
        {status !== 'stopped' && (
          <Button 
            className="bg-[#AC090BF0] hover:bg-[#782121f0]"
            onClick={onStop}
          >
            Stop timer
          </Button>
        )}
        <div className="w-full flex justify-center items-center ml-2">
          <RotateCcw onClick={onReset} className="h-7 w-7 text-[#f0eeee] hover:cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

ScoringTimer.propTypes = {
  status: PropTypes.oneOf(['idle', 'running', 'paused', 'stopped']).isRequired,
  formattedTime: PropTypes.string.isRequired,
  onStart: PropTypes.func.isRequired,
  onPause: PropTypes.func.isRequired,
  onResume: PropTypes.func.isRequired,
  onStop: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  hasStarted: PropTypes.bool.isRequired
};

export default ScoringTimer;
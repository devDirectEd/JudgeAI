import { useEffect, useState } from "react";
import ScoringTimer from "@/components/components/ScoringTimer";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import PropTypes from 'prop-types';
import { useToast } from "@chakra-ui/react";
import Navbar from "@/components/components/Navbar";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Checkbox } from "@/components/ui/checkbox";
import { useSelector } from "react-redux";

// Define the initial state structure for a section
const createInitialSectionState = (questions) => {
  const questionScores = {};
  questions.forEach((_, index) => {
    questionScores[index] = null;
  });
  return {
    scores: questionScores,
    feedback: '',
    isSkipped: false
  };
};

// Create initial state for all sections
const createInitialFormState = (sections) => {
  const initialState = {
    overallFeedback: '',
    nominateNextRound: false,
    mentorStartup: false,
    meetStartup: false,
  };
  sections.forEach(section => {
    initialState[section.id] = createInitialSectionState(section.questions);
  });
  return initialState;
};


const SummaryScoreSelector = ({ sectionId, formState, onBulkScore }) => {
  const sectionState = formState[sectionId];
  
  if (sectionState.isSkipped) {
    return (
      <div className="text-gray-400 italic ml-2 md:ml-4 text-sm md:text-base">
        This section is skipped
      </div>
    );
  }

  const scores = Object.values(sectionState.scores).filter(score => score !== null);
  const averageScore = scores.length > 0 
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : null;

  return (
    <div className="flex gap-1 md:gap-2 ml-2 md:ml-4">
      {[1, 2, 3, 4, 5].map((score) => (
        <div
          key={score}
          onClick={(e) => {
            e.stopPropagation();
            onBulkScore(sectionId, score);
          }}
          className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center cursor-pointer transition-all
            ${averageScore === score 
              ? 'border-2 border-[#0A2540] bg-gray-100' 
              : 'hover:bg-gray-50'
            }`}
        >
          <span role="img" aria-label={`rating ${score}`} className="text-base md:text-lg">
            {score <= 1 ? "😶" : score <= 2 ? "🙁" : score <= 3 ? "😊" : score <= 4 ? "😄" : "🤩"}
          </span>
        </div>
      ))}
    </div>
  );
};

SummaryScoreSelector.propTypes = {
  sectionId: PropTypes.string.isRequired,
  formState: PropTypes.object.isRequired,
  onBulkScore: PropTypes.func.isRequired
};

const ScoreSection = ({ questions, sectionId, formState, onScoreChange, onFeedbackChange, onSkip }) => {
  const isSkipped = formState[sectionId].isSkipped;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[#f3f1f1] font-medium text-sm md:text-base">Questions</h3>
      </div>
      
      {!isSkipped ? (
        <>
          {questions.map((question, questionIndex) => (
            <div key={questionIndex} className="space-y-2">
              <p className="text-[#f3f1f1] text-sm md:text-base">{question}</p>
              <div className="flex flex-wrap gap-1 md:gap-2">
                {[1, 2, 3, 4, 5].map((score) => (
                  <div
                    key={score}
                    onClick={() => onScoreChange(sectionId, questionIndex, score)}
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center cursor-pointer transition-all
                      ${formState[sectionId].scores[questionIndex] === score 
                        ? 'border-2 border-[#0A2540] bg-gray-100' 
                        : 'hover:bg-gray-50'
                      }`}
                  >
                    <span role="img" aria-label={`rating ${score}`} className="text-lg md:text-xl">
                      {score <= 1 ? "😶" : score <= 2 ? "🙁" : score <= 3 ? "😊" : score <= 4 ? "😄" : "🤩"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="space-y-2">
            <p className="font-semibold text-white text-sm md:text-base">Feedback</p>
            <Textarea 
              placeholder="Provide detailed feedback here..." 
              className="min-h-[100px] placeholder:text-[#d0cccc] text-[#f2f0f0] text-sm md:text-base"
              value={formState[sectionId].feedback}
              onChange={(e) => onFeedbackChange(sectionId, e.target.value)}
            />
          </div>
        </>
      ) : (
        <div className="text-gray-400 italic text-sm md:text-base">
          This section has been skipped. A default score of 1 will be assigned to all questions.
        </div>
      )}
      <div className="w-full flex justify-end items-center">
        <Button 
          onClick={() => onSkip(sectionId)}
          variant="secondary"
          className={`px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base rounded hover:bg-[#808080] ${
            isSkipped 
              ? 'bg-[#282828] hover:bg-[#282828]/90 text-white' 
              : 'bg-[#282828] bg-[#282828]/90 text-white'
          }`}
        >
          {isSkipped ? 'Skipped' : 'Skip'}
        </Button>
      </div>
    </div>
  );
};

ScoreSection.propTypes = {
  questions: PropTypes.arrayOf(PropTypes.string).isRequired,
  sectionId: PropTypes.string.isRequired,
  formState: PropTypes.object.isRequired,
  onScoreChange: PropTypes.func.isRequired,
  onFeedbackChange: PropTypes.func.isRequired,
  onSkip: PropTypes.func.isRequired,
};

const scoringSections = [
  {
    id: "problem",
    title: "Problem (10/100%)",
    questions: [
      "Is there a clear problem?",
      "Is there evidence to support the importance of the problem?",
      "Is the problem solvable?",
      "How obsessed is the team on the problem?"
    ]
  },
  {
    id: "solution",
    title: "Solution (10/100%)",
    questions: [
      "Does the solution make sense?",
      "Is there a clear vision of what the solution should be?",
      "Is the solution innovative?",
      "Is the solution feasible?"
    ]
  },
  {
    id: "innovation",
    title: "Innovation (10/100%)",
    questions: [
      "Is the innovation significant?",
      "Does it create new opportunities?",
      "Is it differentiated from existing solutions?"
    ]
  },
  {
    id: "team",
    title: "Team (20/100%)",
    questions: [
      "Does the team have relevant experience?",
      "Is the team composition balanced?",
      "Do they show strong leadership potential?"
    ]
  },
  {
    id: "business-model",
    title: "Business Model (10/100%)",
    questions: [
      "Is the business model clear?",
      "Is it scalable?",
      "Are the revenue streams well-defined?"
    ]
  },
  {
    id: "market-opportunity",
    title: "Market Opportunity (30/100%)",
    questions: [
      "Is the market size significant?",
      "Is the growth potential strong?",
      "Is the competitive advantage sustainable?"
    ]
  },
  {
    id: "technical-feasibility",
    title: "Technical Feasibility (10/100%)",
    questions: [
      "Is the technical approach sound?",
      "Are the technical challenges well understood?",
      "Does the team have the technical capability?"
    ]
  }
];

export default function Score() {
    const [status, setStatus] = useState('idle');
    const [time, setTime] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);
    const [formState, setFormState] = useState(createInitialFormState(scoringSections));
    const [activeSection, setActiveSection] = useState(null);
    const toast = useToast();
    const {userId} = useSelector(state => state.auth)


    useEffect(() => {
        let interval;
        
        if (status === 'running') {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [status]);

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleStart = () => {
        setStatus('running');
        setHasStarted(true);
    };
    const handlePause = () => setStatus('paused');
    const handleResume = () => setStatus('running');
    const handleStop = () => setStatus('stopped');
    const handleReset = () => {
        setTime(0);
        setStatus('paused')
    };

    const handleScoreChange = (sectionId, questionIndex, score) => {
      setFormState(prev => ({
          ...prev,
          [sectionId]: {
              ...prev[sectionId],
              scores: {
                  ...prev[sectionId].scores,
                  [questionIndex]: score
              }
          }
      }));
  };

  const handleBulkScore = (sectionId, score) => {
      setFormState(prev => ({
          ...prev,
          [sectionId]: {
              ...prev[sectionId],
              scores: Object.keys(prev[sectionId].scores).reduce((acc, key) => {
                  acc[key] = score;
                  return acc;
              }, {})
          }
      }));
  };

  const handleFeedbackChange = (sectionId, feedback) => {
      setFormState(prev => ({
          ...prev,
          [sectionId]: {
              ...prev[sectionId],
              feedback
          }
      }));
  };

  const handleSkip = (sectionId) => {
    setFormState(prev => {
        const isCurrentlySkipped = prev[sectionId].isSkipped;
        const newScores = Object.keys(prev[sectionId].scores).reduce((acc, key) => {
            // If we're skipping, set all to 1, if we're unskipping, set all to null
            acc[key] = !isCurrentlySkipped ? 1 : null;
            return acc;
        }, {});

        return {
            ...prev,
            [sectionId]: {
                ...prev[sectionId],
                isSkipped: !isCurrentlySkipped,
                scores: newScores,
                feedback: !isCurrentlySkipped ? '' : prev[sectionId].feedback // Clear feedback when skipping
            }
        };
    });
  };

  const handleOverallFeedbackChange = (feedback) => {
      setFormState(prev => ({
        ...prev,
        overallFeedback: feedback
      }));
  };

  const validateForm = () => {
    const invalidSections = [];
    
    for (const section of scoringSections) {
        const sectionState = formState[section.id];
        
        // Skip validation for skipped sections
        if (sectionState.isSkipped) {
            continue;
        }
        
        // Check if all questions have scores
        const scores = Object.values(sectionState.scores);
        const hasAllScores = scores.every(score => score !== null);

        // Only validate scores completeness
        if (!hasAllScores) {
            invalidSections.push({
                title: section.title,
                id: section.id,
                missingScores: true
            });
        }
    }

    // Overall feedback is always required
    if (!formState.overallFeedback.trim()) {
        invalidSections.push({
            title: "Overall Feedback",
            missingFeedback: true
        });
    }

    return invalidSections;
  };

  const handleSubmit = () => {
    const invalidSections = validateForm();
    
    if (invalidSections.length > 0) {
        const missingScoresSections = invalidSections
            .filter(section => section.missingScores)
            .map(section => section.title);

        let description = "";
        if (missingScoresSections.length > 0) {
            description += `Complete all scores in: ${missingScoresSections.join(", ")}. `;
        }
        if (invalidSections.some(section => section.title === "Overall Feedback")) {
            description += "Overall feedback is required.";
        }

        toast({
            title: "Incomplete Evaluation",
            description: description,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top-right",
            onCloseComplete: () => {
                const firstInvalidSection = invalidSections.find(section => section.id);
                if (firstInvalidSection) {
                    setActiveSection(firstInvalidSection.id);
                }
            }
        });
        return;
    }

    // Calculate scores and prepare submission
    const sectionScores = {};
    let totalScore = 0;
    
    scoringSections.forEach(section => {
        const sectionState = formState[section.id];
        const isSkipped = sectionState.isSkipped;
        
        const scores = isSkipped 
            ? Array(Object.keys(sectionState.scores).length).fill(1)
            : Object.values(sectionState.scores).filter(score => score !== null);
            
        const average = scores.length > 0 
            ? scores.reduce((a, b) => a + b, 0) / Object.keys(sectionState.scores).length 
            : 0;
        
        const weight = parseInt(section.title.match(/\((\d+)\/100%\)/)[1]);
        
        const percentageScore = (average / 5) * 100;
        const weightedScore = (percentageScore * weight) / 100;
        
        sectionScores[section.id] = {
            rawAverage: average,
            percentageScore: percentageScore,
            weightedScore: weightedScore,
            maxPoints: weight,
            feedback: sectionState.feedback,
            isSkipped: isSkipped,
            individualScores: sectionState.scores,
            totalPossibleQuestions: Object.keys(sectionState.scores).length,
            answeredQuestions: scores.length
        };
        
        totalScore += weightedScore;
    });

    // Create a cleaned version of the raw form data with only section data
    const cleanedFormData = {};
    Object.keys(formState).forEach(key => {
        if (scoringSections.some(section => section.id === key)) {
            cleanedFormData[key] = formState[key];
        }
    });

    const submissionData = {
        timestamp: new Date().toISOString(),
        scoringTime: formatTime(time),
        totalScore: Math.round(totalScore * 100) / 100,
        meetStartup: formState.meetStartup,
        mentorStartup: formState.mentorStartup,
        nominateNextRound: formState.nominateNextRound,
        overallFeedback: formState.overallFeedback,
        userId: userId,
        sectionScores,
        rawFormData: cleanedFormData
    };

    console.log('Submission Data:', submissionData);
    
    toast({
        title: "Evaluation Submitted",
        description: `Total Score: ${submissionData.totalScore}%`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
    });
  };

  const handleNominationToggle = () => {
    setFormState(prev => ({
        ...prev,
        nominateNextRound: !prev.nominateNextRound
    }));
  };

  const handleMentorToggle = () => {
      setFormState(prev => ({
          ...prev,
          mentorStartup: !prev.mentorStartup
      }));
  };

  const handleMeetToggle = () => {
      setFormState(prev => ({
          ...prev,
          meetStartup: !prev.meetStartup
      }));
  };

  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }

    return (
        <div className="min-h-screen bg-[#171717] w-full">
            <Navbar />
            <div className="w-full mx-auto p-6">
                <Card className="p-6 bg-[#242424] border-0">
                  <article>
                    <Button className="text-[#2b44c4] flex justify-center items-center gap-2" variant="Link" onClick={()=> handleBack()}>
                      <FontAwesomeIcon icon={faArrowLeft} />
                      <div>
                        Back
                      </div>
                    </Button>
                  </article>
                    <article className="w-full bg-[#242424] sticky top-0 flex flex-col lg:flex-row justify-between items-center gap-7 p-7">
                        <div>
                            <h1 className="text-4xl font-bold mb-3 text-[#f6f5f5]">AI Innovators</h1>
                            <p className="text-[#ddd6d6] font-semibold text-base">Pitch Scoring</p>
                        </div>
                        <div className="flex flex-col md:flex-row justify-center items-center gap-3">
                        <div className="flex flex-col md:flex-row items-start gap-6">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="nominate" 
                              checked={formState.nominateNextRound}
                              onCheckedChange={handleNominationToggle}
                              className="border-white data-[state=checked]:bg-[#387C80] data-[state=checked]:border-[#387C80]"
                            />
                            <label
                              htmlFor="nominate"
                              className="text-sm md:text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white"
                            >
                              Nominate for Next Round
                            </label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="mentor" 
                              checked={formState.mentorStartup}
                              onCheckedChange={handleMentorToggle}
                              className="border-white data-[state=checked]:bg-[#387C80] data-[state=checked]:border-[#387C80]"
                            />
                            <label
                              htmlFor="mentor"
                              className="text-sm md:text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white"
                            >
                              Mentor Startup
                            </label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="meet" 
                              checked={formState.meetStartup}
                              onCheckedChange={handleMeetToggle}
                              className="border-white data-[state=checked]:bg-[#387C80] data-[state=checked]:border-[#387C80]"
                            />
                            <label
                              htmlFor="meet"
                              className="text-sm md:text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white"
                            >
                              Meet Startup
                            </label>
                          </div>
                        </div>
                        </div>
                        <div className="bg-[#242424]">
                            <ScoringTimer 
                                status={status}
                                formattedTime={formatTime(time)}
                                onStart={handleStart}
                                onPause={handlePause}
                                onResume={handleResume}
                                onStop={handleStop}
                                onReset={handleReset}
                                hasStarted={hasStarted}
                            />
                        </div>
                    </article>
                    <div className="space-y-4 border-0 bg-[#404040] p-6 rounded-lg">
                        <Accordion 
                            type="single" 
                            collapsible 
                            className="w-full border-0"
                            value={activeSection}
                            onValueChange={setActiveSection}
                        >
                            {scoringSections.map((section) => (
                        <AccordionItem 
                          value={section.id} 
                          key={section.id} 
                          className="bg-[#808080] rounded-lg border-0 mb-4"
                        >
                          <AccordionTrigger className="px-2 md:px-4 py-2 md:py-3">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-2 sm:gap-4">
                              <h2 className="font-semibold text-left text-white text-sm md:text-xl">
                                {section.title}
                              </h2>
                              {activeSection !== section.id && (
                                <SummaryScoreSelector
                                  sectionId={section.id}
                                  formState={formState}
                                  onBulkScore={handleBulkScore}
                                />
                              )}
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-2 md:px-4 pb-4">
                            <ScoreSection 
                              questions={section.questions}
                              sectionId={section.id}
                              formState={formState}
                              onScoreChange={handleScoreChange}
                              onFeedbackChange={handleFeedbackChange}
                              onSkip={handleSkip}
                            />
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                        </Accordion>
                        <div className="bg-[#404040] rounded-lg border-0 p-4 mt-6">
                            <h2 className="font-semibold text-[#F8FAF7] mb-4">Feedback</h2>
                            <Textarea 
                                placeholder="Provide detailed feedback here ..."
                                className="min-h-[150px] placeholder:text-[#71717A] text-[#71717A] bg-white"
                                value={formState.overallFeedback}
                                onChange={(e) => handleOverallFeedbackChange(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end mt-6">
                            <Button 
                                onClick={handleSubmit}
                                className="bg-[#FFBF00] text-white px-6 py-2 rounded-lg hover:bg-[#FFBF00]/90"
                            >
                                Submit Scores
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
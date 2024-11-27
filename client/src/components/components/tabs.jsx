import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useState } from "react";
import RoundsTab from "./roundsTab";
import StartupsTab from "./startupstab";
import JudgesTab from "./judgesTab";
import RankingsTab from "./ranksTab";
import ScheduleTab from "./scheduleTab";

const CustomTabs = () => {
  const [activeTab, setActiveTab] = useState("startups");

  const tabs = [
    { value: "startups", label: "Startups", component: <StartupsTab /> },
    { value: "judges", label: "Judges", component: <JudgesTab /> },
    { value: "rounds", label: "Rounds", component: <RoundsTab /> },
    { value: "schedule", label: "Schedule", component: <ScheduleTab /> },
    { value: "results", label: "Results Dashboard", component: <RankingsTab /> }
  ];

  return (
    <div className="w-full bg-inherit">
      <div className="max-w-[1600px] mx-auto">
        <Tabs 
          defaultValue="startups" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="mb-4">
            <div className="overflow-x-auto">
              <TabsList className="h-auto inline-flex min-w-full sm:min-w-0 p-1">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="px-4 py-2 whitespace-nowrap text-sm sm:text-base"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>

          <div className="mt-4">
            {tabs.map((tab) => (
              <TabsContent
                key={tab.value}
                value={tab.value}
                className="focus-visible:outline-none focus-visible:ring-0"
              >
                {tab.component}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default CustomTabs;
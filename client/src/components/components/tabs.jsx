
import { Tabs, TabsList, TabsTrigger, TabsContent} from "@/components/ui/tabs"
import { useState } from "react";
import RoundsTab from "./roundsTab";
import StartupsTab from "./startupstab";
import JudgesTab from "./judgesTab";
import { Box } from "@chakra-ui/react";
import RankingsTab from "./ranksTab";
import ScheduleTab from "./scheduleTab";

const CustomTabs = () => {
  const [, setActiveTab] = useState("startups");

  return (
    <Box className="min-h-screen bg-background">
      <main className="container mx-auto p-6">
        <Tabs 
          defaultValue="startups" 
          className="w-full"
          onValueChange={setActiveTab}
        >
          <div className="flex justify-between items-center mb-4">
            
            <TabsList>
              <TabsTrigger value="startups">Startups</TabsTrigger>
              <TabsTrigger value="judges">Judges</TabsTrigger>
              <TabsTrigger value="rounds">Rounds</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="results">ResultsDashboard</TabsTrigger>
            </TabsList>
            
          </div>

          <TabsContent value="startups">
            <StartupsTab />
          </TabsContent>

          <TabsContent value="judges">
            <JudgesTab />
          </TabsContent>

          <TabsContent value="rounds">
            <RoundsTab />
          </TabsContent>

          <TabsContent value="schedule">
            <ScheduleTab />
          </TabsContent>

          <TabsContent value="results">
            <RankingsTab/>
          </TabsContent>
        </Tabs>
      </main>
    </Box>
  );
};

export default CustomTabs;

import type { FC } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card } from "../ui/card";
import TaskPlanningTab from "./tabs/TaskPlanningTab";
import FinancingTab from "./tabs/FinancingTab";

enum TabType {
  Financing = "financing",
  TaskPlanning = "task-planning",
}

const ProjectTabs: FC = () => {
  return (
    <Tabs defaultValue={TabType.Financing} className="gap-0">
      <TabsList variant="line">
        <TabsTrigger value={TabType.Financing}>Financing</TabsTrigger>
        <TabsTrigger value={TabType.TaskPlanning}>Task Planning</TabsTrigger>
      </TabsList>
      <Card className="px-4">
        <TabsContent value={TabType.Financing}>
          <FinancingTab />
        </TabsContent>
        <TabsContent value={TabType.TaskPlanning}>
          <TaskPlanningTab />
        </TabsContent>
      </Card>
    </Tabs>
  );
};

export default ProjectTabs;

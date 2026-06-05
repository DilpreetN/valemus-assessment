import LoadingSpinner from "../utils/LoadingSpinner";
import type {FC} from "react";
import useProjects from "./useProjects";
import {Card} from "../ui/card";
import {Label} from "../ui/label";
import {Input} from "../ui/input";
import {Textarea} from "../ui/textarea";
import {Separator} from "../ui/separator";
import ProjectTabs from "./ProjectTabs";
import ProjectSelect from "@/components/projects/ProjectSelect.tsx";

const Projects: FC = () => {
  const {selectedProject, data, error, isLoading, handleSelect} =
      useProjects();

  if (isLoading) {
    return <LoadingSpinner/>;
  }

  if (error) {
    return <> {error}</>;
  }

  const selectedId = selectedProject?.id;
  return (
      <Card className="px-4">
        <div className="flex flex-col gap-4">
          <ProjectSelect selectedId={selectedId} projects={data!} onSelect={handleSelect}/>

          <div className="flex flex-col gap-1">
            <Label>Project Lead</Label>
            <Input readOnly disabled value={selectedProject?.projectLead ?? ""}/>
          </div>

          <div className="flex flex-col gap-1">
            <Label>Description</Label>
            <Textarea
                readOnly
                disabled
                value={selectedProject?.description ?? ""}
                className="resize"
            />
          </div>
          <Separator/>

          {selectedId && <ProjectTabs/>}
        </div>
      </Card>
  );
};

export default Projects;

import LoadingSpinner from "../utils/LoadingSpinner";
import type { FC } from "react";
import useProjects from "./useProjects";
import { Card } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const Projects: FC = () => {
  const { selectedProject, data, error, isLoading, handleSelect } =
    useProjects();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <> {error}</>;
  }

  const selectedId = selectedProject?.id;
  return (
    <Card className="px-4">
      <div className="flex flex-col gap-4">
        <div className="flex w-full flex-col gap-1">
          <Label>Project:</Label>
          <Select value={selectedId ?? ""} onValueChange={handleSelect}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="-" />
            </SelectTrigger>
            <SelectContent>
              {data!.map((d) => {
                return (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <Label>Project Lead</Label>
          <Input readOnly disabled value={selectedProject?.projectLead ?? ""} />
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
      </div>
    </Card>
  );
};

export default Projects;

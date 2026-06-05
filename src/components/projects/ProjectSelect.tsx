import type {Project} from "@/components/projects/project.ts";
import type {FC} from "react";
import {Label} from "@/components/ui/label.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select.tsx";

type ProjectSelectProps = {
  selectedId: string | undefined;
  projects: Project[];
  onSelect: (id: string) => void;
}

const ProjectSelect: FC<ProjectSelectProps> = ({selectedId, projects, onSelect}) => {
  return <div className="flex w-full flex-col gap-1">
    <Label>Project:</Label>
    <Select value={selectedId ?? ""} onValueChange={onSelect}>
      <SelectTrigger className="w-[250px]">
        <SelectValue placeholder="-"/>
      </SelectTrigger>
      <SelectContent>
        {projects!.map((d) => {
          return (
              <SelectItem key={d.id} value={d.id}>
                {d.name}
              </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  </div>
}

export default ProjectSelect;

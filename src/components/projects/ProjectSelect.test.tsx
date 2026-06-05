import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {describe, expect, it, vi} from "vitest";
import ProjectSelect from "./ProjectSelect";
import type {Project} from "@/components/projects/project.ts";

const mockProjects: Project[] = [
  {
    id: "1",
    name: "Alpha",
    projectLead: "Alice",
    description: "First project",
    modifiedAt: new Date("2024-01-01"),
    modifiedBy: "alice",
  },
  {
    id: "2",
    name: "Beta",
    projectLead: "Bob",
    description: "Second project",
    modifiedAt: new Date("2024-02-01"),
    modifiedBy: "bob",
  },
];

describe("ProjectSelect", () => {
  it("renders the label", () => {
    render(
        <ProjectSelect selectedId={mockProjects[0].id} projects={mockProjects}
                       onSelect={vi.fn()}/>
    );
    expect(screen.getByText("Project:")).toBeInTheDocument();
  });

  it("shows placeholder when no project is selected", () => {
    render(<ProjectSelect selectedId={undefined} projects={mockProjects} onSelect={vi.fn()}/>);
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("shows the selected project name in the trigger", () => {
    render(<ProjectSelect selectedId="1" projects={mockProjects} onSelect={vi.fn()}/>);
    expect(screen.getByRole("combobox")).toHaveTextContent("Alpha");
  });

  it("renders all project options when opened", async () => {
    const user = userEvent.setup();
    render(<ProjectSelect selectedId={undefined} projects={mockProjects} onSelect={vi.fn()}/>);

    await user.click(screen.getByRole("combobox"));

    mockProjects.forEach(p => {
      expect(screen.getByText(p.name)).toBeInTheDocument();
    })
  });

  it("calls onSelect with the correct id when an option is chosen", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<ProjectSelect selectedId={undefined} projects={mockProjects} onSelect={onSelect}/>);

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByText(mockProjects[1].name))

    expect(onSelect).toHaveBeenCalledOnce();
    expect(onSelect).toHaveBeenCalledWith(mockProjects[1].id);
  });

  it("does not call onSelect when the already-selected project is picked again", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<ProjectSelect selectedId="1" projects={mockProjects} onSelect={onSelect}/>);

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", {name: "Alpha"}));

    expect(onSelect).not.toHaveBeenCalled();
  });

  it("renders with an empty projects list without crashing", () => {
    render(<ProjectSelect selectedId={undefined} projects={[]} onSelect={vi.fn()}/>);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });
});
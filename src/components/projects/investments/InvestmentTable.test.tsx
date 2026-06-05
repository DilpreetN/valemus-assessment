import InvestmentTable from "@/components/projects/investments/InvestmentTable.tsx";
import {render, screen} from "@testing-library/react";
import {describe, expect, it, vi} from "vitest";
import type {Category} from "@/components/projects/investments/category.ts";
import {TooltipProvider} from "@/components/ui/tooltip.tsx";
import type {Investment} from "@/components/projects/investments/investment.ts";
import userEvent from "@testing-library/user-event";
import {mockCategories} from "@/components/projects/investments/mockData.ts";

const mockInvestments: Investment[] = [
  {
    id: "inv-1",
    projectId: "proj-1",
    description: "Seed funding round",
    categoryId: "cat-1",
    date: "2024-01-15",
    investor: "Alice Müller",
    amount: 50000,
    note: "First tranche of seed capital",
  },
  {
    id: "inv-2",
    projectId: "proj-1",
    description: "Equipment purchase",
    categoryId: "cat-2",
    date: "2024-02-03",
    investor: "Bob Steiner",
    amount: 12500,
    note: null,
  },
  {
    id: "inv-3",
    projectId: "proj-2",
    description: "Marketing campaign Q1",
    categoryId: "cat-3",
    date: "2024-03-20",
    investor: "Clara Hofer",
    amount: 8750,
    note: "Covers digital and print",
  },
  {
    id: "inv-4",
    projectId: "proj-2",
    description: "Software licenses",
    categoryId: "cat-2",
    date: "2024-04-11",
    investor: "David Kern",
    amount: 3200,
    note: null,
  },
  {
    id: "inv-5",
    projectId: "proj-3",
    description: "Consulting services",
    categoryId: "cat-4",
    date: "2024-05-28",
    investor: "Eva Brandl",
    amount: 21000,
    note: "Strategic advisory for Q2 roadmap",
  },
];

const renderTable = (inv: Investment[], cat: Category[], onEdit: (inv: Investment) => void = vi.fn()) => {
  render(
      <TooltipProvider>
        <InvestmentTable
            investments={inv}
            categories={cat}
            onEdit={onEdit}
        />
      </TooltipProvider>
  );
}

describe("InvestmentTable", () => {
  it("shows no result label on empty", () => {
    renderTable([], []);
    expect(screen.getByText("No results.")).toBeInTheDocument();
  });

  it("maps to categories", () => {
    renderTable(mockInvestments, mockCategories)

    mockInvestments.forEach((inv, index) => {
      const category = mockCategories.find(c => c.id == inv.categoryId)!;
      const aria = `category-${index + 1}`
      const categoryElement = screen.getByLabelText(aria);
      expect(categoryElement).toHaveTextContent(category.name);
    })
  })

  it("note shows icon", () => {
    const user = userEvent.setup();
    renderTable(mockInvestments, mockCategories)

    mockInvestments.forEach(async (inv, index) => {
      const hasNote = inv.note != null;
      const aria = `note-${index + 1}`
      const icon = screen.queryByLabelText(aria);
      if (hasNote) {
        expect(icon).toBeInTheDocument();
        await user.hover(icon!);
      } else {
        expect(icon).toBeNull();
      }
    })
  })

  it("open trigger callback with data", async () => {
    const user = userEvent.setup();
    const onEditCallback = vi.fn();
    const orderedMockInvestments = mockInvestments.sort((a, b) => a.description > b.description ? 1 : -1);
    renderTable(orderedMockInvestments, mockCategories, onEditCallback);

    for (const inv of orderedMockInvestments) {
      const index = orderedMockInvestments.indexOf(inv);
      const aria = `open-${index + 1}`
      const button = screen.getByLabelText(aria);

      await user.click(button);

      await vi.waitFor(() => {
        expect(onEditCallback).toHaveBeenCalledWith(inv);
      });
    }
  })

  it("shows index", () => {
    renderTable(mockInvestments, mockCategories);

    mockInvestments.forEach(async (_, index) => {
      const rowIndex = index + 1;
      const rowIndexElement = screen.getByText(rowIndex);
      expect(rowIndexElement).toBeInTheDocument();
    })
  })
});
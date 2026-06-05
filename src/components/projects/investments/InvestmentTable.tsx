import {type FC, useMemo} from "react";
import {type ColumnDef, flexRender, getCoreRowModel, useReactTable} from "@tanstack/react-table";
import type {Investment} from "@/components/projects/investments/investment.ts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table.tsx";
import {formatGermanNumber} from "@/utils/utils.ts";
import type {Category} from "@/components/projects/investments/category.ts";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {NotebookPen, Pen} from "lucide-react";
import {DateTime} from "luxon";

const getColumns = (categories: Category[], onEdit: (investment: Investment) => void) => {
  const columns: ColumnDef<Investment>[] = [
    {
      id: "index",
      header: "Idx",
      cell: ({row}) => {
        const original = row.index + 1;
        return <>{original}</>
      }
    },
    {
      accessorKey: "date", header: "Date",
      cell: ({row}) => {
        const date = DateTime.fromISO(row.original.date);
        return (<>{date.toFormat("dd.MM.yyyy")}</>);
      }
    },
    {accessorKey: "description", header: "Description"},
    {
      accessorKey: "categoryId", header: "Category", cell: ({row}) => {
        const categoryId = row.original.categoryId;
        const index = row.index + 1;
        const category = categories.find(x => x.id == categoryId);
        console.assert(category != null, `Unable to category of id ${categoryId}`);
        return <p aria-label={`category-${index}`}>{category ? category.name : "-"}</p>;
      }
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({row}) => {
        const original = row.original;
        return <>{formatGermanNumber(original.amount)}</>;
      }
    },
    {accessorKey: "investor", header: "Investor"},
    {
      accessorKey: "note", header: "Note", cell: ({row}) => {
        const note = row.original.note;
        const index = row.index + 1;

        if (note == null || note.trim().length == 0) {
          return null;
        }

        return <Tooltip>
          <TooltipTrigger asChild aria-label={`note-${index}`}>
            <NotebookPen className="size-4"/>
          </TooltipTrigger>

          <TooltipContent>
            <p>{note}</p>
          </TooltipContent>
        </Tooltip>
      }
    },
    {
      id: "open", header: "Open",
      cell: ({row}) => {
        const investment = row.original;
        const index = row.index + 1;
        return <Tooltip>
          <TooltipTrigger onClick={() => onEdit(investment)} asChild aria-label={`open-${index}`}>
            <Pen className="size-4"/>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit</p>
          </TooltipContent>
        </Tooltip>
      }
    }
  ]
  return columns;
}

type InvestmentTableProps = {
  investments: Investment[],
  categories: Category[],
  onEdit: (investment: Investment) => void;
}

const InvestmentTable: FC<InvestmentTableProps> = ({investments, categories, onEdit}) => {
  const columns = useMemo(() => {
    return getColumns(categories, onEdit);
  }, [categories, onEdit]);

  const table = useReactTable({
    data: investments,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  return (
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                              )}
                        </TableHead>
                    )
                  })}
                </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                    <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                      ))}
                    </TableRow>
                ))
            ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
  )
}

export default InvestmentTable;
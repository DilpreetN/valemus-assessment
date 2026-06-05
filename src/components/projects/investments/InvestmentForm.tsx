import {z} from "zod";
import {type AnyFieldLikeMeta, useForm} from "@tanstack/react-form";
import {DateTime} from "luxon"
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Label} from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {type FC, useState} from "react";
import type {Category} from "./category";
import {formatGermanNumber, parseGermanNumber} from "@/utils/utils.ts";
import type {InvestmentFormFields} from "@/components/projects/investments/investment.ts";
import FieldError from "@/components/forms/FieldError.tsx";
import {AlertCircle} from "lucide-react";

const getInvestmentSchema = (categoryIds: string[]) => {
  return z.object({
    description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .refine(
        (v) => v.trim().length > 0,
        "Description cannot be empty or whitespace",
    ),

    categoryId: z
    .string("Please select a category")
    .refine((v) => categoryIds.includes(v), "Please select a valid category"),

    date: z
    .string()
    .min(1, "Date is required")
    .refine(
        (value) => {
          const dt = DateTime.fromISO(value);

          return dt.isValid;
        },
        "Please enter a valid date in format dd.MM.yyyy",
    ),

    investor: z
    .string()
    .min(1, "Investor is required")
    .refine(
        (v) => v.trim().length > 0,
        "Investor cannot be empty or whitespace",
    ),

    amount: z
    .number("Amount is required")
    .min(1, "Amount must atleast be 1")
    .refine((val) => {
      return Number.isFinite(val);
    }, "Please enter a valid number"),

    note: z.string().nullable(),
  });
};

const initialValues: InvestmentFormFields = {
  description: "",
  categoryId: "",
  date: "",
  investor: "",
  amount: null as unknown as number,
  note: null,
};

const FIELD_FORM_ERROR: Record<keyof InvestmentFormFields, string> = {
  description: "Description",
  categoryId: "Category",
  date: "Date",
  investor: "Investor",
  amount: "Amount",
  note: "Note",
};

const getInitialValues = (): InvestmentFormFields => {
  return {...initialValues, date: DateTime.now().toISODate()};
};

type InvestmentFormProps = {
  categories: Category[];
  initialValues?: InvestmentFormFields;
  onSubmit: (fields: InvestmentFormFields) => void;
};

export const InvestmentForm: FC<InvestmentFormProps> = ({
                                                          initialValues = getInitialValues(),
                                                          categories,
                                                          onSubmit
                                                        }) => {
  const [displayDate, setDisplayDate] = useState(DateTime.fromISO(initialValues.date).toFormat("dd.MM.yyyy"));
  const [displayAmount, setDisplayAmount] = useState(initialValues.amount != null ? formatGermanNumber(initialValues.amount) : "");

  const form = useForm({
    defaultValues: initialValues,
    validators: {
      onSubmit: getInvestmentSchema(categories.map((d) => d.id)),
      onChange: getInvestmentSchema(categories.map((d) => d.id)),
    },

    onSubmit: async ({value}) => {
      onSubmit(value as InvestmentFormFields);
    },
  });

  return (
      <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          id="investment-form"
          className="space-y-4"
      >
        <form.Field name="description">
          {(field) => (
              <div className="flex flex-col gap-1">
                <Label htmlFor={field.name}>Description</Label>

                <Input
                    id={field.name}
                    aria-label="Description"
                    aria-invalid={field.state.meta.errors.length > 0}
                    aria-errormessage={`${field.name}-error`}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                />
                <FieldError id={`${field.name}-error`} field={field}/>
              </div>
          )}
        </form.Field>

        <form.Field name="categoryId">
          {(field) => (
              <div className="flex flex-col gap-1">
                <Label htmlFor={field.name}>Category</Label>

                <Select
                    value={field.state.value}
                    onValueChange={field.handleChange}
                >
                  <SelectTrigger id={field.name} aria-label="Category"
                                 aria-invalid={field.state.meta.errors.length > 0}
                                 aria-errormessage={`${field.name}-error`}>
                    <SelectValue placeholder="Select category"/>
                  </SelectTrigger>

                  <SelectContent>
                    {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError id={`${field.name}-error`} field={field}/>
              </div>
          )}
        </form.Field>

        <form.Field name="date">
          {(field) => {
            return (
                <div className="flex flex-col gap-1">
                  <Label htmlFor={field.name}>Date</Label>

                  <Input
                      id={field.name}
                      aria-label="Date"
                      aria-invalid={field.state.meta.errors.length > 0}
                      aria-errormessage={`${field.name}-error`}
                      placeholder="dd.MM.yyyy"
                      value={displayDate}
                      onChange={(e) => setDisplayDate(e.target.value)}
                      onBlur={(e) => {
                        const value = e.target.value;
                        field.handleBlur();

                        const dt = DateTime.fromFormat(value, "dd.MM.yyyy");
                        field.handleChange(dt.isValid ? dt.toISODate() : value);
                      }}
                  />
                  <FieldError id={`${field.name}-error`} field={field}/>
                </div>
            );
          }}
        </form.Field>

        <form.Field name="investor">
          {(field) => (
              <div className="flex flex-col gap-1">
                <Label htmlFor={field.name}>Investor</Label>

                <Input
                    id={field.name}
                    aria-label="Investor"
                    aria-invalid={field.state.meta.errors.length > 0}
                    aria-errormessage={`${field.name}-error`}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                />
                <FieldError id={`${field.name}-error`} field={field}/>
              </div>
          )}
        </form.Field>

        <form.Field name="amount">
          {(field) => (
              <div className="flex flex-col gap-1">
                <Label htmlFor={field.name}>Amount</Label>

                <Input
                    id={field.name}
                    aria-label="Amount"
                    aria-invalid={field.state.meta.errors.length > 0}
                    aria-errormessage={`${field.name}-error`}
                    inputMode="decimal"
                    placeholder="1.234,56"
                    value={displayAmount}
                    onFocus={(e) => {
                      const replaced = e.target.value.replace(/\./g, "");
                      setDisplayAmount(replaced);
                    }}
                    onChange={(e) => {
                      setDisplayAmount(e.target.value);
                    }}
                    onBlur={() => {
                      field.handleBlur();

                      const parsed = parseGermanNumber(displayAmount);

                      if (Number.isFinite(parsed)) {
                        field.handleChange(parsed);
                        setDisplayAmount(formatGermanNumber(parsed));
                      } else {
                        field.handleChange(null as unknown as number);
                      }
                    }}
                />
                <FieldError id={`${field.name}-error`} field={field}/>
              </div>
          )}
        </form.Field>

        <form.Field name="note">
          {(field) => (
              <div className="flex flex-col gap-1">
                <Label htmlFor={field.name}>Note (optional)</Label>

                <Textarea
                    id={field.name}
                    aria-label="Note"
                    aria-invalid={field.state.meta.errors.length > 0}
                    aria-errormessage={`${field.name}-error`}
                    value={field.state.value ?? ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    rows={3}
                />
                <FieldError id={`${field.name}-error`} field={field}/>
              </div>
          )}
        </form.Field>

        <form.Subscribe selector={(s) => [s.fieldMeta, s.submissionAttempts]}>
          {([meta, attempts]) => {
            if (attempts == 0) {
              return null
            }

            const entries = Object.entries(meta) as [keyof InvestmentFormFields, AnyFieldLikeMeta][];
            const errorFields = entries.filter(([, meta]) => {
              return meta.errors.length > 0;
            })
            .map(([key,]) => key)
            .map((key) => {
              return FIELD_FORM_ERROR[key];
            });

            if (errorFields.length == 0) {
              return null;
            }

            return (
                <div className="border border-red-900 bg-red-950 p-4 text-red-400" role="alert"
                     aria-label="Form errors">
                  <div className="flex items-center gap-2 font-semibold mb-2">
                    <AlertCircle className="h-4 w-4"/>
                    <span id="form-errors-title">Error in following fields:</span>
                  </div>
                  <ul className="space-y-1 pl-6 list-disc text-sm"
                      aria-labelledby="form-errors-title">
                    {errorFields.map((field) => (
                        <li key={field} aria-label={`form-error-${field}`}>{field}</li>
                    ))}
                  </ul>
                </div>
            );
          }}
        </form.Subscribe>
      </form>
  );
};

export default InvestmentForm;

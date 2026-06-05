import type {AnyFieldApi} from "@tanstack/react-form";
import {FieldError as BaseFieldError} from "@/components/ui/field.tsx";
import type {FC} from "react";

const FieldError: FC<{ field: AnyFieldApi, id?: string }> = ({field, id}) => {
  const hasError =
      field.state.meta.isTouched && !field.state.meta.isValid &&
      field.state.meta.errors != null &&
      field.state.meta.errors.length > 0;

  if (!hasError) {
    return null;
  }

  return <BaseFieldError id={id} errors={[field.state.meta.errors[0]]}/>;
};
export default FieldError;

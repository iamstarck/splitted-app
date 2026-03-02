import { useForm } from "react-hook-form";
import {
  billMetaSchema,
  type BillMetaFormValues,
} from "../lib/billMeta-validation";
import { zodResolver } from "@hookform/resolvers/zod";

export const useBillMetaForm = (
  initialValues?: Partial<BillMetaFormValues>,
) => {
  const form = useForm<BillMetaFormValues>({
    resolver: zodResolver(billMetaSchema),
    defaultValues: {
      title: "",
      date: new Date(),
      currency: "$",
      note: "",
      ...initialValues,
    },

    mode: "onChange",
  });

  return { form };
};

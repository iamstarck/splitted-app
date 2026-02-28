import { useForm } from "react-hook-form";
import {
  billMetaSchema,
  type BillMetaFormValues,
} from "../lib/billMeta-validation";
import { zodResolver } from "@hookform/resolvers/zod";

export const useBillMetaForm = () => {
  const form = useForm<BillMetaFormValues>({
    resolver: zodResolver(billMetaSchema),
    defaultValues: {
      title: "",
      currency: "$",
    },

    mode: "onChange",
  });

  return { form };
};

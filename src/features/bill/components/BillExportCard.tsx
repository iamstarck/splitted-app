import { formatDate } from "@/features/home/utils/formatTime";
import { BillProps, currencyId } from "../types/bill";
import { useMemo } from "react";
import { buildBillSummary } from "../lib/bill.calculation";
import { LinkIcon } from "lucide-react";
import AppLogo from "@/assets/splittedLogo.svg?react";
import { formatter } from "@/shared/utils/utils";
import PersonBillExportItem from "./PersonBillExportItem";

type BillExportCardProps = {
  bill: BillProps;
  currency: currencyId;
};

const BillExportCard = ({ bill, currency }: BillExportCardProps) => {
  const summary = useMemo(() => {
    return buildBillSummary(bill);
  }, [bill]);

  if (!summary) return null;

  const { taxPercent, servicePercent } = bill.charges;

  return (
    <div className="flex flex-col items-center gap-11 w-full">
      <h1 className="lg:text-4xl max-md:text-3xl font-bold">Splitted Bill</h1>

      <div className="self-start space-y-4 w-full pb-6 border-b-2 border-dashed border-foreground">
        <h2 className="text-xl font-bold">{bill.title}</h2>
        <div>
          <h2 className="text-xl font-semibold">Date</h2>
          <p> {formatDate(new Date(bill.date))}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Note</h2>
          <p className="whitespace-pre-line">{bill.note}</p>
        </div>
      </div>

      <div className="self-start space-y-6 w-full">
        <h2 className="text-xl font-semibold tracking-tight">WHO PAYS WHAT</h2>

        <div className="space-y-4 w-full pb-6 border-b-2 border-dashed border-foreground">
          {summary.perPerson.map((person) => (
            <PersonBillExportItem
              key={person.personId}
              person={{
                ...person,
                subtotal: person.subtotal.toNumber(),
                total: person.total.toNumber(),
              }}
              currency={currency}
              items={summary.groupedByPerson[person.personId] ?? []}
            />
          ))}
        </div>
      </div>

      <div className="self-start space-y-6 w-full pb-6 border-b-2 border-dashed border-foreground">
        <h2 className="text-xl font-semibold tracking-tight">BILL SUMMARY</h2>

        <div>
          <div className="flex justify-between ">
            <p className="inline-flex items-center gap-2 font-medium">
              Subtotal
            </p>
            <span className="text-lg font-medium">
              {currency}
              {formatter.format(summary.subtotal.toNumber())}
            </span>
          </div>

          {taxPercent && (
            <div className="flex justify-between">
              <p className="inline-flex items-center gap-2 font-medium">
                Tax ({taxPercent}%)
              </p>
              <span className="text-lg font-medium">
                {" "}
                {currency}
                {formatter.format(
                  summary.subtotal.mul(taxPercent).div(100).toNumber(),
                )}
              </span>
            </div>
          )}

          {servicePercent && (
            <div className="flex justify-between">
              <p className="inline-flex items-center gap-2 font-medium">
                Service ({servicePercent}%)
              </p>
              <span className="text-lg font-medium">
                {currency}
                {formatter.format(
                  summary.subtotal.mul(servicePercent).div(100).toNumber(),
                )}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between w-full">
        <p className="inline-flex items-center gap-2 text-xl font-semibold">
          Total
        </p>
        <span className="text-2xl font-semibold">
          {currency}
          {formatter.format(summary.total.toNumber())}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <p className="inline-flex items-center gap-2">
          Split with
          <AppLogo className="h-8 w-fit fill-foreground" />
        </p>
        <a
          href="https://splitted.vercel.app/"
          target="_blank"
          className="inline-flex items-center gap-1"
        >
          <LinkIcon size={15} />
          splitted.vercel.app
        </a>
      </div>
    </div>
  );
};

export default BillExportCard;

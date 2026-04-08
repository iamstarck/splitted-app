import type { BillProps, currencyId } from "../types/bill";
import { useMemo } from "react";
import { buildBillSummary } from "../lib/bill.calculation";
import { formatter } from "@/shared/utils/utils";

type BillShareCardProps = {
  bill: BillProps;
  currency: currencyId;
};

/**
 * Share card that renders as a clean, minimal receipt-style layout.
 * Intentionally zero-dependency on shadcn UI so it renders cleanly
 * when captured as an image via html-to-image.
 */
const BillShareCard = ({ bill, currency }: BillShareCardProps) => {
  const summary = useMemo(() => buildBillSummary(bill), [bill]);
  if (!summary) return null;

  const { taxPercent, servicePercent } = bill.charges;

  return (
    <div
      style={{
        fontFamily: "'Courier New', Courier, monospace",
        background: "#ffffff",
        color: "#111111",
        width: "360px",
        padding: "24px 20px",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <div style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "2px" }}>
          SPLITTED
        </div>
        <div style={{ fontSize: "13px", marginTop: "2px", color: "#555" }}>
          split bill receipt
        </div>
      </div>

      <div style={{ borderTop: "1px dashed #aaa", marginBottom: "12px" }} />

      {/* Bill title + date */}
      <div style={{ marginBottom: "12px" }}>
        <div style={{ fontWeight: 700, fontSize: "15px" }}>{bill.title}</div>
        <div style={{ fontSize: "12px", color: "#666" }}>
          {new Date(bill.date).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>

      <div style={{ borderTop: "1px dashed #aaa", marginBottom: "12px" }} />

      {/* Items */}
      <div style={{ marginBottom: "12px" }}>
        <div style={{ fontSize: "11px", fontWeight: 700, marginBottom: "6px", letterSpacing: "1px" }}>
          ITEMS
        </div>
        {bill.items.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "13px",
              marginBottom: "3px",
            }}
          >
            <span style={{ maxWidth: "220px", wordBreak: "break-word" }}>{item.name}</span>
            <span style={{ whiteSpace: "nowrap", marginLeft: "8px" }}>
              {currency}{formatter.format(item.price)}
            </span>
          </div>
        ))}
      </div>

      <div style={{ borderTop: "1px dashed #aaa", marginBottom: "12px" }} />

      {/* Totals */}
      <div style={{ marginBottom: "12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "3px" }}>
          <span>Subtotal</span>
          <span>{currency}{formatter.format(summary.subtotal.toNumber())}</span>
        </div>
        {taxPercent > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "3px" }}>
            <span>Tax ({taxPercent}%)</span>
            <span>{currency}{formatter.format(summary.subtotal.mul(taxPercent).div(100).toNumber())}</span>
          </div>
        )}
        {servicePercent > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "3px" }}>
            <span>Service ({servicePercent}%)</span>
            <span>{currency}{formatter.format(summary.subtotal.mul(servicePercent).div(100).toNumber())}</span>
          </div>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "15px",
            fontWeight: 700,
            marginTop: "6px",
            paddingTop: "6px",
            borderTop: "1px solid #111",
          }}
        >
          <span>TOTAL</span>
          <span>{currency}{formatter.format(summary.total.toNumber())}</span>
        </div>
      </div>

      <div style={{ borderTop: "1px dashed #aaa", marginBottom: "12px" }} />

      {/* Per person breakdown */}
      <div style={{ marginBottom: "12px" }}>
        <div style={{ fontSize: "11px", fontWeight: 700, marginBottom: "6px", letterSpacing: "1px" }}>
          WHO PAYS WHAT
        </div>
        {summary.perPerson.map((person) => {
          const personItems = summary.groupedByPerson[person.personId] ?? [];
          return (
            <div key={person.personId} style={{ marginBottom: "10px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: 700,
                  fontSize: "13px",
                }}
              >
                <span>{person.name}</span>
                <span>{currency}{formatter.format(person.total.toNumber())}</span>
              </div>
              {personItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "11px",
                    color: "#555",
                    paddingLeft: "8px",
                    marginTop: "2px",
                  }}
                >
                  <span>{item.name}</span>
                  <span>{currency}{formatter.format(item.price)}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <div style={{ borderTop: "1px dashed #aaa", marginBottom: "12px" }} />

      {/* Footer */}
      <div style={{ textAlign: "center", fontSize: "11px", color: "#888" }}>
        Split with Splitted · splitted.vercel.app
      </div>
    </div>
  );
};

export default BillShareCard;

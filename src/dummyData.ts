import { generateId } from "@/shared/utils/utils";
import { BillProps } from "./features/bill/types/bill";

export const dummyBills: BillProps[] = [
  {
    id: generateId(),
    title: "Dinner at Steakhouse",
    currency: "$",
    people: [
      { id: "p1", name: "Alice" },
      { id: "p2", name: "Bob" },
    ],
    items: [
      { id: "i1", name: "Steak", price: 40, assignedPersonIds: ["p1"] },
      { id: "i2", name: "Wine", price: 25, assignedPersonIds: ["p2"] },
    ],
    charges: { taxPercent: 10, servicePercent: 5, tipPercent: 10 },
    date: new Date("2026-02-01T10:15:30.000Z").toISOString(),
    note: "Transfer to account 123456789 (Bank XYZ) under John Doe",
  },
  {
    id: generateId(),
    title: "Lunch at Warung",
    currency: "Rp",
    people: [
      { id: "p3", name: "Dewi" },
      { id: "p4", name: "Eko" },
    ],
    items: [
      {
        id: "i3",
        name: "Nasi Goreng",
        price: 25000,
        assignedPersonIds: ["p3"],
      },
      { id: "i4", name: "Es Teh", price: 5000, assignedPersonIds: ["p4"] },
    ],
    charges: { taxPercent: 0, servicePercent: 0, tipPercent: 0 },
    date: new Date("2026-02-02T12:45:10.000Z").toISOString(),
    note: "Paid via QRIS",
  },
  {
    id: generateId(),
    title: "Coffee Shop Hangout",
    currency: "$",
    people: [
      { id: "p5", name: "Charlie" },
      { id: "p6", name: "Diana" },
    ],
    items: [
      { id: "i5", name: "Latte", price: 6, assignedPersonIds: ["p5"] },
      { id: "i6", name: "Cappuccino", price: 5, assignedPersonIds: ["p6"] },
    ],
    charges: { taxPercent: 8, servicePercent: 0, tipPercent: 10 },
    date: new Date("2026-02-03T08:20:45.000Z").toISOString(),
  },
  {
    id: generateId(),
    title: "Pizza Night",
    currency: "$",
    people: [
      { id: "p7", name: "Frank" },
      { id: "p8", name: "Grace" },
    ],
    items: [
      {
        id: "i7",
        name: "Pepperoni Pizza",
        price: 20,
        assignedPersonIds: ["p7", "p8"],
      },
      { id: "i8", name: "Soft Drink", price: 3, assignedPersonIds: ["p7"] },
    ],
    charges: { taxPercent: 5, servicePercent: 0, tipPercent: 5 },
    date: new Date("2026-02-04T19:05:00.000Z").toISOString(),
    note: "Split evenly between Frank and Grace",
  },
  {
    id: generateId(),
    title: "Sushi Lunch",
    currency: "$",
    people: [
      { id: "p9", name: "Hiro" },
      { id: "p10", name: "Ken" },
    ],
    items: [
      { id: "i9", name: "Sushi Set", price: 15, assignedPersonIds: ["p9"] },
      { id: "i10", name: "Green Tea", price: 2, assignedPersonIds: ["p10"] },
    ],
    charges: { taxPercent: 7, servicePercent: 3, tipPercent: 10 },
    date: new Date("2026-02-05T14:17:19.849Z").toISOString(),
    note: "Payment via PayPal john.doe@example.com",
  },
  {
    id: generateId(),
    title: "Bakso Malam",
    currency: "Rp",
    people: [
      { id: "p11", name: "Adi" },
      { id: "p12", name: "Budi" },
    ],
    items: [
      {
        id: "i11",
        name: "Bakso Jumbo",
        price: 20000,
        assignedPersonIds: ["p11"],
      },
      { id: "i12", name: "Es Jeruk", price: 8000, assignedPersonIds: ["p12"] },
    ],
    charges: { taxPercent: 0, servicePercent: 0, tipPercent: 0 },
    date: new Date("2026-02-06T21:30:00.000Z").toISOString(),
  },
  {
    id: generateId(),
    title: "Breakfast Pancakes",
    currency: "$",
    people: [
      { id: "p13", name: "Ivy" },
      { id: "p14", name: "Jack" },
    ],
    items: [
      { id: "i13", name: "Pancakes", price: 10, assignedPersonIds: ["p13"] },
      { id: "i14", name: "Orange Juice", price: 4, assignedPersonIds: ["p14"] },
    ],
    charges: { taxPercent: 6, servicePercent: 2, tipPercent: 5 },
    date: new Date("2026-02-07T07:55:00.000Z").toISOString(),
  },
  {
    id: generateId(),
    title: "Seafood Dinner",
    currency: "$",
    people: [
      { id: "p15", name: "Leo" },
      { id: "p16", name: "Mia" },
    ],
    items: [
      {
        id: "i15",
        name: "Grilled Salmon",
        price: 25,
        assignedPersonIds: ["p15"],
      },
      {
        id: "i16",
        name: "Shrimp Cocktail",
        price: 18,
        assignedPersonIds: ["p16"],
      },
    ],
    charges: { taxPercent: 12, servicePercent: 5, tipPercent: 15 },
    date: new Date("2026-02-08T18:40:00.000Z").toISOString(),
  },
  {
    id: generateId(),
    title: "Street Food",
    currency: "Rp",
    people: [
      { id: "p17", name: "Nina" },
      { id: "p18", name: "Omar" },
    ],
    items: [
      {
        id: "i17",
        name: "Sate Ayam",
        price: 15000,
        assignedPersonIds: ["p17"],
      },
      {
        id: "i18",
        name: "Es Campur",
        price: 12000,
        assignedPersonIds: ["p18"],
      },
    ],
    charges: { taxPercent: 0, servicePercent: 0, tipPercent: 0 },
    date: new Date("2026-02-09T11:25:00.000Z").toISOString(),
  },
  {
    id: generateId(),
    title: "Burger Joint",
    currency: "$",
    people: [
      { id: "p19", name: "Paul" },
      { id: "p20", name: "Quinn" },
    ],
    items: [
      {
        id: "i19",
        name: "Cheeseburger",
        price: 12,
        assignedPersonIds: ["p19"],
      },
      { id: "i20", name: "Fries", price: 5, assignedPersonIds: ["p20"] },
    ],
    charges: { taxPercent: 8, servicePercent: 0, tipPercent: 10 },
    date: new Date("2026-02-10T16:10:00.000Z").toISOString(),
  },
];

import Decimal from "decimal.js"
import { BillProps, ItemProps } from "../types/bill"

type BillSummary = {
  subtotal: Decimal
  charges: Decimal
  total: Decimal
  perPerson: {
    personId: string
    name: string
    subtotal: Decimal
    total: Decimal
  }[]
  groupedByPerson: Record<string, ItemProps[]>
  allAssigned: boolean
  isBalanced: boolean
  hasUnassignedPeople: boolean
}

const calculateSubtotal = (bill: BillProps) => {
  return bill.items.reduce((sum, item) => sum.plus(item.price), new Decimal(0))
}

const calculateCharges = (bill: BillProps, subtotal: Decimal) => {
  const { taxPercent, servicePercent } = bill.charges

  const percentTotal = new Decimal(taxPercent).plus(servicePercent).div(100)

  return subtotal.mul(percentTotal)
}

const groupItems = (bill: BillProps) => {
  const map: Record<string, ItemProps[]> = {}

  bill.people.forEach(person => {
    map[person.id] = []
  })

  bill.items.forEach(item => {
    item.assignedPersonIds.forEach(personId => {
      if (map[personId]) map[personId].push(item)
    })
  })

  return map
}

const isAllItemsAssigned = (bill: BillProps) =>
  bill.items.every(item => item.assignedPersonIds.length > 0)

const isSplitBalanced = (total: Decimal, assignedTotal: Decimal) => {
  return total.toDecimalPlaces(2).equals(assignedTotal.toDecimalPlaces(2))
}

export const buildBillSummary = (bill: BillProps): BillSummary => {
  const subtotal = calculateSubtotal(bill)
  const charges = calculateCharges(bill, subtotal)
  const totalRounded = subtotal.plus(charges)

  const groupedByPerson = groupItems(bill)

  const subtotalMap: Record<string, Decimal> = {}
  bill.people.forEach(p => {
    subtotalMap[p.id] = new Decimal(0)
  })

  bill.items.forEach(item => {
    const totalAssignee = item.assignedPersonIds.length
    if (totalAssignee === 0) return

    const splitPrice = new Decimal(item.price).div(totalAssignee)
    item.assignedPersonIds.forEach(personId => {
      if (subtotalMap[personId]) {
        subtotalMap[personId] = subtotalMap[personId].plus(splitPrice)
      }
    })
  })

  const perPerson = bill.people.map(person => {
    const personSubtotal = subtotalMap[person.id]

    if (subtotal.isZero()) {
      return {
        personId: person.id,
        name: person.name,
        subtotal: new Decimal(0),
        total: new Decimal(0)
      }
    }

    const ratio = personSubtotal.div(subtotal)
    const rawChargeShare = charges.mul(ratio)

    const rawTotal = personSubtotal.plus(rawChargeShare)

    return {
      personId: person.id,
      name: person.name,
      subtotal: personSubtotal.toDecimalPlaces(2),
      total: rawTotal.toDecimalPlaces(2)
    }
  })

  const assignedTotal = perPerson.reduce(
    (sum, p) => sum.plus(p.total),
    new Decimal(0)
  )

  const diff = totalRounded.minus(assignedTotal)

  if (!diff.isZero() && perPerson.length > 0) {
    const firstActivePerson = perPerson.find(p => p.total.gt(0)) || perPerson[0]
    firstActivePerson.total = firstActivePerson.total.plus(diff)
  }

  const finalAssignedTotal = perPerson.reduce(
    (sum, p) => sum.plus(p.total),
    new Decimal(0)
  )

  const allAssigned = isAllItemsAssigned(bill)
  const isBalanced = isSplitBalanced(totalRounded, finalAssignedTotal)

  const hasUnassignedPeople = Object.values(groupedByPerson).some(
    items => items.length === 0
  )

  return {
    subtotal: subtotal.toDecimalPlaces(2),
    charges: charges.toDecimalPlaces(2),
    total: totalRounded,
    perPerson,
    groupedByPerson,
    allAssigned,
    isBalanced,
    hasUnassignedPeople
  }
}

export const buildBillListItem = (bill: BillProps) => {
  const summary = buildBillSummary(bill)

  return {
    id: bill.id,
    title: bill.title,
    currency: bill.currency,
    date: new Date(bill.date),
    total: summary.total.toNumber(),
    people: bill.people
  }
}

import {
  useCurrentBill,
  useSelectBillItems,
  useSelectPeople
} from "@/stores/selectors/bill.selectors"
import { useNavigate } from "react-router-dom"
import { useBillMetaForm } from "../hooks/useBillMetaForm"
import { useMemo, useRef, useState } from "react"
import { buildBillSummary } from "../lib/bill.calculation"
import { useDataStore } from "@/stores/useDataStore"
import { useWatch } from "react-hook-form"
import { BillMetaFormValues } from "../lib/billMeta-validation"
import { toast } from "sonner"
import PageTransition from "@/shared/animations/PageTransition"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import BackButton from "@/shared/components/BackButton"
import HelpGuide from "@/shared/components/HelpGuide"
import { ModeToggle } from "@/components/common/ModeToggle"
import { motion } from "framer-motion"
import BillMetaSection from "./sections/BillMetaSection"
import BillPeopleSection from "./sections/BillPeopleSection"
import BillItemsSection from "./sections/BillItemsSection"
import BillChargesSection from "./sections/BillChargesSection"
import EmptyListPlaceholder from "@/shared/components/EmptyListPlaceholder"
import { ReceiptIcon, SaveIcon, Share2Icon } from "lucide-react"
import BillSplittedSummary from "./BillSplittedSummary"
import { Button } from "@/components/ui/button"
import Footer from "@/shared/components/Footer"
import { BillProps } from "../types/bill"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import {
  generateShareImage,
  shareBillAsImage
} from "@/shared/utils/billActions"

type BillFormProps = {
  mode: "create" | "edit"
  title: string
  description: string
}

const BillForm = ({ mode, title, description }: BillFormProps) => {
  const navigate = useNavigate()

  const currentBill = useCurrentBill()!
  const initialValues =
    mode === "edit" && currentBill
      ? {
          title: currentBill.title,
          note: currentBill.note,
          currency: currentBill.currency,
          date: new Date(currentBill.date)
        }
      : undefined

  const { form: billForm } = useBillMetaForm(initialValues)

  const people = useSelectPeople() ?? []
  const items = useSelectBillItems() ?? []

  const summary = useMemo(() => {
    if (!currentBill) return null

    return buildBillSummary(currentBill)
  }, [currentBill])

  const updateBillMeta = useDataStore(state => state.updateBillMeta)
  const saveCurrentBill = useDataStore(state => state.saveCurrentBill)
  const updateExistingBill = useDataStore(state => state.updateExistingBill)
  const resetBill = useDataStore(state => state.resetCurrentBill)

  const { isValid, isDirty } = billForm.formState

  const handleCancel = () => {
    resetBill()
    billForm.reset()
    navigate("/")
  }

  const peopleJustOne = people.length === 1

  const isButtonDisabled =
    !isValid ||
    peopleJustOne ||
    items.length === 0 ||
    !summary ||
    !summary.allAssigned ||
    !summary.isBalanced ||
    summary.hasUnassignedPeople

  const currency = useWatch({
    control: billForm.control,
    name: "currency"
  })

  // ---- Share dialog state ----
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [shareImageUrl, setShareImageUrl] = useState<string | null>(null)
  const [shareLoading, setShareLoading] = useState(false)
  const savedBillRef = useRef<BillProps | null>(null)

  const openShareDialog = async (bill: BillProps) => {
    setShareDialogOpen(true)
    setShareLoading(true)
    setShareImageUrl(null)
    savedBillRef.current = bill
    const url = await generateShareImage(bill)
    setShareImageUrl(url)
    setShareLoading(false)
  }

  const handleShareDownload = async () => {
    if (!savedBillRef.current) return
    await shareBillAsImage(savedBillRef.current)
  }

  const onSaveBill = (data: BillMetaFormValues) => {
    updateBillMeta({
      ...data,
      date: data.date.toISOString()
    })

    switch (mode) {
      case "edit":
        updateExistingBill()
        toast.success("Bill updated successfully!", { position: "top-center" })
        navigate(`/detail/${currentBill.id}`)
        resetBill()
        billForm.reset()
        break

      case "create": {
        // Capture bill snapshot BEFORE reset for share dialog
        const snapshot: BillProps = {
          ...currentBill,
          ...data,
          date: data.date.toISOString()
        }

        saveCurrentBill()
        toast.success("Bill created successfully!", { position: "top-center" })

        billForm.reset()
        openShareDialog(snapshot)
        break
      }
    }
  }

  const showPlaceholder = people.length === 0 || items.length === 0

  return (
    <PageTransition>
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center w-full max-w-2xl justify-between">
          <header className="flex flex-col p-6 max-w-2xl justify-between w-full gap-6">
            <div className="flex items-center justify-between w-full">
              {mode === "edit" ? (
                isDirty ? (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <BackButton />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Discard changes?</AlertDialogTitle>
                        <AlertDialogDescription>
                          You have unsaved changes. This action cannot be
                          undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Stay</AlertDialogCancel>
                        <AlertDialogAction onClick={handleCancel}>
                          Leave
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : (
                  <BackButton onClick={handleCancel} />
                )
              ) : (
                <BackButton onClick={() => navigate("/")} />
              )}
              <div className="flex items-center gap-4 max-md:gap-2">
                <HelpGuide />
                <ModeToggle />
              </div>
            </div>

            <div>
              <h1 className="text-4xl font-bold">{title}</h1>
              <p className="text-base">{description}</p>
            </div>
          </header>

          <motion.main
            className="flex flex-col justify-center items-center p-6 w-full"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
          >
            <form
              className="flex flex-col items-center gap-8 w-full max-w-2xl"
              onSubmit={e => {
                e.preventDefault()
                billForm.handleSubmit(onSaveBill)(e)
              }}
            >
              <div id="tour-meta-section" className="w-full">
                <BillMetaSection form={billForm} />
              </div>
              <div id="tour-people-section" className="w-full relative">
                <BillPeopleSection />
              </div>
              <div id="tour-items-section" className="w-full relative">
                <BillItemsSection form={billForm} currency={currency} />
              </div>
              <div id="tour-charges-section" className="w-full relative">
                <BillChargesSection />
              </div>
              {peopleJustOne && items.length > 0 && (
                <p className="text-destructive text-center">
                  ⚠️ Why using this app if just split for one person?
                </p>
              )}
              {showPlaceholder && (
                <EmptyListPlaceholder
                  icon={<ReceiptIcon size={90} />}
                  message="Add people and add items to start splitting!"
                />
              )}
              {!showPlaceholder && !peopleJustOne && (
                <div id="tour-summary" className="w-full relative">
                  <BillSplittedSummary bill={currentBill} currency={currency} />
                </div>
              )}
              {mode === "create" && (
                <Button className="w-full" disabled={isButtonDisabled}>
                  <ReceiptIcon />
                  Create Split Bill
                </Button>
              )}
              {mode === "edit" && (
                <div className="flex justify-center gap-4 w-full md:max-w-2xs max-w-40">
                  {isDirty ? (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="secondary"
                          type="button"
                          className="w-full"
                        >
                          Cancel
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Discard changes?</AlertDialogTitle>
                          <AlertDialogDescription>
                            You have unsaved changes. This action cannot be
                            undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Stay</AlertDialogCancel>
                          <AlertDialogAction onClick={handleCancel}>
                            Leave
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : (
                    <Button
                      variant="secondary"
                      type="button"
                      className="w-full"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  )}

                  <Button className="w-full" disabled={isButtonDisabled}>
                    <SaveIcon /> Update Bill
                  </Button>
                </div>
              )}
            </form>
          </motion.main>

          <Footer />
        </div>

        {/* Share dialog */}
        <Dialog
          open={shareDialogOpen}
          onOpenChange={open => {
            setShareDialogOpen(open)
            if (!open) navigate("/")
          }}
        >
          <DialogContent className="max-w-sm max-h-[90vh] flex flex-col p-0 overflow-hidden">
            <div className="p-6 overflow-y-auto flex-1 h-full custom-scrollbar">
              <DialogHeader className="mb-4">
                <DialogTitle>Success creating Split Bill! 🎉</DialogTitle>
              </DialogHeader>

              <p className="text-sm text-muted-foreground mb-4">
                Share to your debtors
              </p>

              {/* Preview Container */}
              <div className="flex justify-center rounded-lg overflow-hidden mb-6">
                {shareLoading && (
                  <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
                    Creating preview...
                  </div>
                )}

                {!shareLoading && shareImageUrl && (
                  <img
                    src={shareImageUrl}
                    alt="Share preview"
                    className="w-full h-auto object-contain"
                  />
                )}

                {!shareLoading && !shareImageUrl && (
                  <div className="flex items-center justify-center h-48 text-sm text-destructive">
                    Failed creating preview.
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  className="w-full"
                  onClick={handleShareDownload}
                  disabled={shareLoading || !shareImageUrl}
                >
                  <Share2Icon className="mr-2 h-4 w-4" />
                  Share / Save Image
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setShareDialogOpen(false)
                    navigate("/")
                  }}
                >
                  Done
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  )
}

export default BillForm

import { ModeToggle } from "@/components/common/ModeToggle";
import BackButton from "../shared/components/BackButton";
import Footer from "../shared/components/Footer";
import NewBillForm from "@/features/bill/components/new/NewBillForm";

const NewBillPage = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center w-full max-w-2xl m-4 justify-between">
        <header className="flex flex-col p-6 max-w-2xl justify-between w-full gap-6">
          <div className="flex items-center justify-between w-full">
            <BackButton />
            <ModeToggle />
          </div>

          <div>
            <h1 className="text-4xl font-bold">New Bill</h1>
            <p className="text-base">Create and split new bill</p>
          </div>
        </header>

        <main className="flex flex-col justify-center items-center p-6 w-full">
          <NewBillForm />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default NewBillPage;

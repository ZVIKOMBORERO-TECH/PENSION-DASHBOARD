import { redirect } from "next/navigation";
import HeaderBox from "@/components/HeaderBox";
import RecentTransactions from "@/components/RecentContributions";
import RightSidebar from "@/components/RightSidebar";
import TotalBalanceBox from "@/components/TotalBalanceBox";
import { getAccount, getAccounts } from "@/lib/actions/bank.actions";
import { getLoggedInUser } from "@/lib/actions/user.actions";

const Home = async ({ searchParams: { id, page } }: SearchParamProps) => {
  // 1. Current page for pagination
  const currentPage = Number(page as string) || 1;

  // 2. Get logged-in user
  const loggedIn = await getLoggedInUser();

  if (!loggedIn) {
    // Redirect if not logged in
    redirect("/sign-in");
  }

  // 3. Fetch all bank accounts for this user
  const accountsResponse = await getAccounts({ userId: loggedIn.$id });

  // Handle no accounts
  const accountsData = accountsResponse?.data;
  if (!accountsData?.length) {
    redirect("/sign-in"); // or show a "no accounts" message
  }

  // 4. Determine which account to show (from search param or first account)
  const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId;
  if (!appwriteItemId) {
    redirect("/sign-in"); // fallback
  }

  // 5. Get single account with transactions
  const accountResponse = await getAccount({ appwriteItemId });

  const accountData = accountResponse?.data;
  const transactions = accountResponse?.transactions || [];

  // 6. Render page
  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={loggedIn.firstName || "ZVIKO"}
            subtext="View your pension contributions, accrued benefits, and projected retirement outcomes."
          />

          <TotalBalanceBox
            accounts={accountsData}
            totalBanks={accountsResponse?.totalBanks}
            totalCurrentBalance={accountsResponse?.totalCurrentBalance}
          />
        </header>

        <RecentTransactions
          accounts={accountsData}
          transactions={transactions}
          appwriteItemId={appwriteItemId}
          page={currentPage}
        />
      </div>

      <RightSidebar
        member={loggedIn}
        recentContributions={transactions?.slice(0, 5)} // show top 5
        pensionSchemes={accountsData?.slice(0, 2)} // first 2 accounts
      />
    </section>
  );
};

export default Home;


import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SchemeTabItem } from './SchemeTabItem'
import SchemeInfo from './SchemeInfo'
import ContributionTable from './ContributionTable'
import { Pagination } from './Pagination'

const RecentContributions = ({
  accounts,
  contributions = [],
  appwriteItemId,
  page = 1,
}: RecentContributionProps) => {
  const rowsPerPage = 10;
  const totalPages = Math.ceil(contribution.length / rowsPerPage);

  const indexOfLastContribution = page * rowsPerPage;
  const indexOfFirstContribution = indexOfLastContribution - rowsPerPage;

  const currentContributions = contributions.slice(
    indexOfFirstContribution, indexOfLastContribution
  )

  return (
    <section className="recent-contributions">
      <header className="flex items-center justify-between">
        <h2 className="recent-contributions-label">Recent contributions</h2>
        <Link
          href={`/contribution-history/?id=${appwriteItemId}`}
          className="view-all-btn"
        >
          View all
        </Link>
      </header>

      <Tabs defaultValue={appwriteItemId} className="w-full">
      <TabsList className="recent-transactions-tablist">
          {accounts.map((account: Account) => (
            <TabsTrigger key={account.id} value={account.appwriteItemId}>
              <schemeTabItem
                key={account.id}
                account={account}
                appwriteItemId={appwriteItemId}
              />
            </TabsTrigger>
          ))}
        </TabsList>

        {accounts.map((account: Account) => (
          <TabsContent
            value={account.appwriteItemId}
            key={account.id}
            className="space-y-4"
          >
            <BankInfo 
              account={account}
              appwriteItemId={appwriteItemId}
              type="full"
            />

            <ContributionsTable contributions={currentContributions} />
            

            {totalPages > 1 && (
              <div className="my-4 w-full">
                <Pagination totalPages={totalPages} page={page} />
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  )
}

export default RecentContributions
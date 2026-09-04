import { AccountOverview } from "@/components/store/account/account-overview";
import CompanionStorySection from "@/components/store/layout/companion-story-section";

export default function AccountPage() {
  return <>
   <AccountOverview />;
  <div className="mx-auto max-w-[1440px] px-4 pb-10 sm:px-6 sm:pb-12 lg:px-8 lg:pb-14">
              <CompanionStorySection />
            </div>
  </>
}
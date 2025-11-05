import { PricingTable } from '@clerk/nextjs'

export default function PricingPage() {
  return (
    <div className="h-[90vh] w-full flex justify-center items-center gap-7 flex-col">
        <h1 className="text-4xl font-bold text-shadow-2xl mt-8 text-center">Pricing</h1>
    <div className=" w-full flex  items-center" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }} >
      <PricingTable />
    </div>
    </div>
  )
}
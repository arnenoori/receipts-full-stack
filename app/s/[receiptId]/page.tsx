'use server'

import { api } from '@/trpc/server'
import Image from 'next/image'
import PurchasesForm from './_components/purchases-form'

export default async function ReceiptPage({
  params,
}: {
  params: { receiptId: string }
}) {
  const data = await api.receipts.getReceiptById.query(params)

  return (
    <div className="flex gap-10 justify-start">
      <div className="flex-1 h-[90vh] relative">
        <Image
          alt="receipt image"
          className="object-fit"
          src={data.imageUrl}
          fill={true}
        />
      </div>
      <div className="flex-1 pb-16">
        <PurchasesForm receipt={data} />
      </div>
    </div>
  )
}

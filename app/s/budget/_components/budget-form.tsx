'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import SectionHeader from '@/components/ui/section-header'
import { Separator } from '@/components/ui/separator'
import Spinner from '@/components/ui/spinner'
import { useToast } from '@/components/ui/use-toast'
import { camelCaseToTitleCase } from '@/lib/utils'
import { Budget } from '@/server/db/schema'
import { api } from '@/trpc/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function BudgetForm({ budget }: { budget: Budget }) {
  const excludeKeys = ['userId', 'createdAt', 'updatedAt'] as const

  const filteredBudget = Object.fromEntries(
    Object.entries(budget).filter(([key]) => !excludeKeys.includes(key as any))
  ) as Omit<Budget, (typeof excludeKeys)[number]>

  type Categories = keyof typeof filteredBudget

  const [values, setValues] = useState<Record<Categories, number>>({
    ...filteredBudget,
  })

  const { toast } = useToast()
  const router = useRouter()

  const updateBudget = api.budgets.updateBudget.useMutation()
  const handleUpdate = async () => {
    updateBudget.mutate(values, {
      onSuccess: () => {
        toast({
          title: 'Budget updated!',
          description: 'Your budget has been updated.',
          status: 'success',
        })

        router.refresh()
      },
      onError(error) {
        toast({
          title: 'Error',
          description: error.message,
          status: 'error',
        })
      },
    })
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8 py-8">
      <SectionHeader title="Welcome!" subtitle="Explore your monthly budget">
        <Button disabled={updateBudget.isLoading} onClick={handleUpdate}>
          Update
          {updateBudget.isLoading && <Spinner className="ml-2" />}
        </Button>
      </SectionHeader>
      <Separator />
      <div>
        {Object.entries(filteredBudget).map(([key, value]) => {
          return (
            <div key={key} className="py-6 border-b flex flex-col gap-4">
              <Label htmlFor={key}>{camelCaseToTitleCase(key)}</Label>
              <Input
                defaultValue={value}
                name={key}
                value={values[key as Categories]}
                onChange={(e) => {
                  setValues({
                    ...values,
                    [key]: Number(e.target.value),
                  })
                }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

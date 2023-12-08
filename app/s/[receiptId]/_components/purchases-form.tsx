'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import Spinner from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { snakeCaseToTitleCase } from '@/lib/utils'
import {
  CATEGORIES,
  Purchase,
  Receipt,
  ReceiptExtractionSchema,
} from '@/server/db/schema'
import { api } from '@/trpc/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { SendIcon, SparklesIcon, TrashIcon } from 'lucide-react'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = ReceiptExtractionSchema.extend({
  description: z.string().optional(),
})

export default function PurchasesForm({
  receipt,
}: {
  receipt: Receipt & { purchases: Purchase[] }
}) {
  const extractMutation = api.receipts.extractReceiptData.useMutation()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      merchant: receipt.merchant,
      description: receipt.description ?? undefined,
      purchases: receipt.purchases,
    },
  })

  const { toast } = useToast()

  const handleExtract = async () => {
    extractMutation.mutate(
      {
        receiptId: receipt.id,
      },
      {
        onSuccess: (data) => {
          toast({
            title: 'Extracted',
            description: 'Extracted receipt data',
            status: 'success',
          })

          form.setValue('merchant', data.merchant)
          form.setValue('description', data.description ?? undefined)

          if (data.purchases) {
            form.setValue('purchases', data.purchases)
          }
        },
        onError: (err) => {
          toast({
            title: 'Error',
            description: err.message,
            status: 'error',
          })
        },
      }
    )
  }

  const updateMutation = api.receipts.updateReceipt.useMutation()
  function onSubmit(values: z.infer<typeof formSchema>) {
    updateMutation.mutate(
      {
        data: values,
        receiptId: receipt.id,
      },
      {
        onError: (err) => {
          toast({
            title: 'Error',
            description: err.message,
            status: 'error',
          })
        },
        onSuccess: () => {
          toast({
            title: 'Updated',
            description: 'Receipt updated',
            status: 'success',
          })
        },
      }
    )
  }

  const { fields, append, remove } = useFieldArray({
    name: 'purchases',
    control: form.control,
  })

  return (
    <div className="flex-1 flex flex-col gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <h3 className="text-lg font-bold">Metadata</h3>
          <FormField
            control={form.control}
            name="merchant"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Merchant</FormLabel>
                <FormControl>
                  <Input placeholder="Enter merchant..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter description..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator />
          <h3 className="text-lg font-bold">Purchases</h3>
          <div className="flex flex-col gap-4">
            {fields.map((field, index) => (
              <div className="flex flex-col gap-4 hover:ring-2 ring-gray-200 rounded-md p-4 transition-all">
                <div className="flex flex-row gap-4">
                  <FormField
                    control={form.control}
                    key={field.id}
                    name={`purchases.${index}.price`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter price..."
                            {...field}
                            onChange={(event) =>
                              field.onChange(+event.target.value)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    key={field.id}
                    name={`purchases.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter quantity..."
                            {...field}
                            onChange={(event) =>
                              field.onChange(+event.target.value)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  key={field.id}
                  name={`purchases.${index}.item`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Item</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter item..."
                          {...field}
                          value={field.value ?? undefined}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-4 justify-end items-end">
                  <FormField
                    control={form.control}
                    key={field.id}
                    name={`purchases.${index}.category`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value ?? undefined}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CATEGORIES.map((category) => (
                              <SelectItem key={category} value={category}>
                                {snakeCaseToTitleCase(category)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    variant="destructive"
                    type="button"
                    className="w-min px-3"
                    onClick={() => remove(index)}
                  >
                    <TrashIcon className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() =>
                append({ price: 1.0, category: 'groceries', quantity: 1 })
              }
            >
              Add Purchase Item
            </Button>
          </div>
          <div className="flex gap-2 justify-start">
            <Button
              type="submit"
              variant={'secondary'}
              disabled={updateMutation.isLoading}
            >
              {updateMutation.isLoading ? (
                <Spinner className="w-5 h-5 mr-2" />
              ) : (
                <SendIcon className="w-5 h-5 mr-2" />
              )}
              Submit
            </Button>
            <Button
              disabled={extractMutation.isLoading}
              type="button"
              onClick={handleExtract}
            >
              {extractMutation.isLoading ? (
                <Spinner className="w-5 h-5 mr-2" />
              ) : (
                <SparklesIcon className="w-5 h-5 mr-2" />
              )}
              Extract
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

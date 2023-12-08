import { formatDateToLocal } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../tooltip'

type Props = {
  date: Date | null
}

export default function DateCell({ date }: Props) {
  if (!date) return '---'

  return (
    <TooltipProvider delayDuration={50} skipDelayDuration={0}>
      <Tooltip>
        <TooltipTrigger className="cursor-default">
          <span className="whitespace-nowrap">{formatDateToLocal(date)}</span>
        </TooltipTrigger>
        <TooltipContent>
          <span className="whitespace-nowrap">
            {formatDateToLocal(date, { includeTime: true })}
          </span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

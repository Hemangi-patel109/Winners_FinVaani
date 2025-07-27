import { Progress } from "@/components/ui/progress"

interface GoalProgressProps {
  title: string;
  target: number;
  current: number;
}

export default function GoalProgress({ title, target, current }: GoalProgressProps) {
  const progressPercentage = (current / target) * 100;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between font-medium">
        <span>{title}</span>
        <span>{Math.round(progressPercentage)}%</span>
      </div>
      <Progress value={progressPercentage} aria-label={`${title} progress`} />
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>₹{current.toLocaleString()}</span>
        <span>₹{target.toLocaleString()}</span>
      </div>
    </div>
  )
}

export default function PromptScoreBadge({ score, size = "md" }: { score: number; size?: "sm" | "md" | "lg" | "xl" }) {
  const getColor = (s: number) => {
    if (s >= 80) return { bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200", bar: "bg-emerald-500" };
    if (s >= 60) return { bg: "bg-yellow-50", text: "text-yellow-700", ring: "ring-yellow-200", bar: "bg-yellow-500" };
    if (s >= 40) return { bg: "bg-orange-50", text: "text-orange-700", ring: "ring-orange-200", bar: "bg-orange-500" };
    return { bg: "bg-red-50", text: "text-red-700", ring: "ring-red-200", bar: "bg-red-500" };
  };

  const colors = getColor(score);

  const sizeClasses = {
    sm: "w-10 h-10 text-sm",
    md: "w-14 h-14 text-lg",
    lg: "w-20 h-20 text-2xl",
    xl: "w-32 h-32 text-5xl",
  };

  return (
    <div className={`${sizeClasses[size]} ${colors.bg} ${colors.text} ring-2 ${colors.ring} rounded-full flex items-center justify-center font-bold`}>
      {score}
    </div>
  );
}

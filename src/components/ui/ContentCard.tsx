import React from "react";
import { CheckCircle2Icon, BookOpenIcon, PlayIcon, FileTextIcon as FileCircleIcon, HelpCircleIcon } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { type BaseContentItem } from "@/types/content";
import { cn } from "@/lib/utils/cn";
import { Link } from "@/i18n/navigation";
import { Button, buttonStyles } from "@/components/ui/Button";

interface ContentCardProps {
  item: BaseContentItem;
  completed?: boolean;
  onActionClick?: (item: BaseContentItem) => void;
  actionHref?: string;
  actionText?: string;
  className?: string;
}

// Static icon mapping outside of render to prevent dynamic component creation warnings
const ICON_MAP = {
  books: BookOpenIcon,
  videos: PlayIcon,
  lessons: PlayIcon,
  tests: HelpCircleIcon,
  "parents-tests": HelpCircleIcon,
  etiquette: FileCircleIcon,
  "i-can": FileCircleIcon,
};

export function ContentCard({
  item,
  completed = false,
  onActionClick,
  actionHref,
  actionText,
  className,
}: ContentCardProps) {
  // Format publication date to local string
  const formattedDate = new Date(item.date).toLocaleDateString("uz-UZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Pick type-specific icon class from static map
  const iconComponent = ICON_MAP[item.type] || FileCircleIcon;

  // Compute cover visual style: uses coverUrl or falls back to gradients
  const coverClasses = cn(
    "relative aspect-video w-full rounded-t-xl bg-gradient-to-br flex items-center justify-center select-none overflow-hidden",
    item.coverUrl || "from-brand/10 to-brand/35 text-brand"
  );

  return (
    <Card className={cn("h-full flex flex-col relative", className)}>
      {/* Visual Cover */}
      <div className={coverClasses}>
        {/* Cover Meta Overlay */}
        <div className="absolute top-3 left-3 flex gap-2">
          {/* Language Badge */}
          <Badge variant="neutral" size="sm" className="bg-surface/90 backdrop-blur-xs select-none">
            {item.contentLanguage.toUpperCase()}
          </Badge>
          
          {/* Completion Checkmark */}
          {completed && (
            <Badge variant="success" size="sm" className="flex items-center gap-1 shadow-sm select-none">
              <CheckCircle2Icon className="h-3.5 w-3.5" />
              Bajarildi
            </Badge>
          )}
        </div>

        {/* Action Type Icon inside cover */}
        <div className="p-4 rounded-full bg-surface/80 backdrop-blur-xs shadow-sm text-brand-hover">
          {React.createElement(iconComponent, { className: "h-8 w-8" })}
        </div>
      </div>

      {/* Title & Date Details */}
      <CardHeader className="border-none pb-0 pt-5">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-xs font-semibold text-fg-subtle">
            {formattedDate}
          </span>
          {item.hasTest && (
            <Badge variant="accent" size="sm">
              Test bor
            </Badge>
          )}
        </div>
        <h3 className="text-lg font-bold text-fg font-display line-clamp-1 leading-snug">
          {item.title}
        </h3>
      </CardHeader>

      {/* Description Content */}
      <CardContent className="pt-2 pb-5 text-sm text-fg-muted leading-relaxed flex-1">
        <p className="line-clamp-3">{item.description}</p>
        
        {/* Render type-specific meta details */}
        {(item.pageCount !== undefined || item.duration !== undefined || item.difficulty !== undefined) && (
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-fg-subtle border-t border-border/40 pt-3">
            {item.pageCount !== undefined && <span>{item.pageCount} sahifa</span>}
            {item.duration !== undefined && <span>Davomiyligi: {item.duration}</span>}
            {item.difficulty !== undefined && (
              <span className="capitalize">Qiyinchilik: {item.difficulty}</span>
            )}
          </div>
        )}
      </CardContent>

      {/* Action Footer */}
      <CardFooter className="pt-3 pb-4">
        {actionHref ? (
          <Link
            href={actionHref}
            className={cn(
              buttonStyles({
                variant: completed ? "secondary" : "primary",
                size: "sm",
                fullWidth: true,
              }),
              "flex items-center justify-center gap-2"
            )}
          >
            {React.createElement(iconComponent, { className: "h-4 w-4" })}
            {actionText || (completed ? "Qayta koʼrish" : "Oʼqish / Boshlash")}
          </Link>
        ) : (
          <Button
            onClick={() => onActionClick?.(item)}
            fullWidth
            size="sm"
            variant={completed ? "secondary" : "primary"}
            className="flex items-center justify-center gap-2"
          >
            {React.createElement(iconComponent, { className: "h-4 w-4" })}
            {actionText || (completed ? "Qayta urinish" : "Topshirish / Boshlash")}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

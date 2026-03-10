/**
 * EmptyState - Componente reutilizable para estado vacío
 * Muestra mensaje, ícono y CTA personalizable
 */

import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaIcon?: LucideIcon;
  onCta?: () => void;
  secondaryCtaLabel?: string;
  onSecondaryCta?: () => void;
  benefits?: Array<{
    icon: LucideIcon;
    title: string;
    description: string;
    color: string;
  }>;
  infoItems?: Array<{
    label: string;
    description: string;
  }>;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  ctaLabel,
  ctaIcon: CtaIcon,
  onCta,
  secondaryCtaLabel,
  onSecondaryCta,
  benefits,
  infoItems,
}: EmptyStateProps) {
  return (
    <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
      <CardContent className="p-12">
        <div className="text-center max-w-2xl mx-auto">
          {/* Icon */}
          <div className="inline-flex p-6 bg-blue-100 rounded-full mb-6">
            <Icon className="h-16 w-16 text-blue-600" />
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>

          {/* Description */}
          <p className="text-gray-600 mb-8">{description}</p>

          {/* CTAs */}
          {(ctaLabel || secondaryCtaLabel) && (
            <div className="space-y-3">
              {ctaLabel && onCta && (
                <Button
                  size="lg"
                  className="gap-2 bg-blue-700 hover:bg-blue-800 px-8"
                  onClick={onCta}
                >
                  {CtaIcon && <CtaIcon className="h-5 w-5" />}
                  {ctaLabel}
                </Button>
              )}

              {secondaryCtaLabel && onSecondaryCta && (
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 w-full md:w-auto"
                  onClick={onSecondaryCta}
                >
                  {secondaryCtaLabel}
                </Button>
              )}
            </div>
          )}

          {/* Benefits Grid */}
          {benefits && benefits.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              {benefits.map((benefit, index) => {
                const BenefitIcon = benefit.icon;
                return (
                  <div
                    key={index}
                    className="p-6 bg-white border-2 border-gray-200 rounded-xl shadow-sm text-left"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex-shrink-0 p-3 rounded-lg ${benefit.color}`}
                      >
                        <BenefitIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2 text-lg">
                          {benefit.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Info Items */}
          {infoItems && infoItems.length > 0 && (
            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg text-left">
              <div className="space-y-2">
                {infoItems.map((item, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Badge variant="outline" className="bg-white">
                      {item.label}
                    </Badge>
                    <span className="text-sm text-blue-800">
                      {item.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

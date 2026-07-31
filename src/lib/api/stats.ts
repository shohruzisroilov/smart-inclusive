import { cache } from "react";
import { STATE_ACTIVE } from "./constants";
import { toImpactMetricView, type ImpactMetricView } from "./mappers";
import { fetchPlatformStats } from "./services";
import type { TrustNumberIcon, TrustNumberItem } from "@/lib/constants/trust-numbers";

/**
 * Platforma raqamlari (`PlatformStat` uchi, `[AllowAnonymous]`).
 *
 * Bitta manba ikki joyda ishlatiladi: header ustidagi ishonch paneli
 * (`TrustNumberBar`) va ko'ngillilar sahifasidagi statistika bloki.
 */

export const getPlatformMetrics = cache(async (): Promise<ImpactMetricView[]> => {
  const stats = await fetchPlatformStats();

  return stats.filter((dto) => dto.stateId === STATE_ACTIVE).map(toImpactMetricView);
});

/**
 * `metric_key` -> ishonch panelidagi ikonka va tarjima kaliti.
 *
 * Kalitlar adminkada erkin matn sifatida kiritiladi, shuning uchun moslik
 * shu jadval orqali beriladi. Notanish kalit ham ko'rsatiladi — faqat ikonkasi
 * neytral bo'ladi va sarlavha sifatida adminkadagi `label` ishlatiladi.
 */
const TRUST_ICON_BY_METRIC_KEY: Record<string, TrustNumberIcon> = {
  children: "children",
  lessons: "lessons",
  volunteers: "volunteers",
  regions: "regions",
};

export interface TrustNumberEntry extends TrustNumberItem {
  /**
   * Adminkadan kelgan tayyor sarlavha. Mavjud bo'lsa `labelKey` o'rniga shu
   * ko'rsatiladi (tarjima kaliti faqat tanilgan to'rt ko'rsatkichda bor).
   */
  label?: string;
}

export const getTrustNumbers = cache(async (): Promise<TrustNumberEntry[]> => {
  const stats = await fetchPlatformStats();

  return stats
    .filter((dto) => dto.stateId === STATE_ACTIVE)
    .map((dto) => {
      const key = dto.metricKey.trim().toLowerCase();
      const icon = TRUST_ICON_BY_METRIC_KEY[key];

      return {
        id: String(dto.id),
        icon: icon ?? "children",
        value: dto.value,
        labelKey: icon ?? "children",
        label: icon ? undefined : (dto.label?.trim() || dto.metricKey),
      };
    });
});

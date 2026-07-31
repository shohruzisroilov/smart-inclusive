import { cache } from "react";
import {
  languageIdOf,
  SLIDE_SCENARIO_ABOUT_PROJECT,
  SLIDE_SCENARIO_ONBOARDING,
  SLIDE_SCENARIO_PRESENTATION,
  STATE_ACTIVE,
} from "./constants";
import { toSlideViews, type SlideView } from "./mappers";
import { fetchSlides } from "./services";

/**
 * Vizard/taqdimot slaydlari.
 *
 * Uchta ssenariy `enum_slide_scenario` da qattiq belgilangan, shuning uchun
 * sahifalar id emas, nom bilan murojaat qiladi.
 *
 * MUHIM — `SlideController` da `[AllowAnonymous]` YO'Q. Ya'ni bu uch saytdan
 * 401 qaytaradi va quyidagi funksiyalar BO'SH ro'yxat beradi (xato yutiladi,
 * sahifa qulamaydi). Backendda `GetList` ochilishi kerak.
 */

export const SLIDE_SCENARIOS = {
  onboarding: SLIDE_SCENARIO_ONBOARDING,
  presentation: SLIDE_SCENARIO_PRESENTATION,
  aboutProject: SLIDE_SCENARIO_ABOUT_PROJECT,
} as const;

export type SlideScenario = keyof typeof SLIDE_SCENARIOS;

/**
 * Slaydlar tilga bog'liq (`info_slide.language_id`), shuning uchun interfeys
 * tili bo'yicha so'raladi. Tanlangan tilda slayd bo'lmasa, o'zbekchasiga
 * qaytiladi — bo'sh vizard ko'rsatgandan ko'ra afzal.
 */
export const getSlides = cache(
  async (scenario: SlideScenario, locale: string): Promise<SlideView[]> => {
    const scenarioId = SLIDE_SCENARIOS[scenario];

    const primary = await fetchSlides(scenarioId, languageIdOf(locale));
    const active = primary.filter((slide) => slide.stateId === STATE_ACTIVE);
    if (active.length > 0) return toSlideViews(active);

    if (locale === "uz") return [];

    const fallback = await fetchSlides(scenarioId, languageIdOf("uz"));
    return toSlideViews(fallback.filter((slide) => slide.stateId === STATE_ACTIVE));
  },
);

import { cache } from "react";
import { STATE_ACTIVE } from "./constants";
import { toVolunteerCaseView, type VolunteerCaseView } from "./mappers";
import { fetchVolunteerCase, fetchVolunteerCases } from "./services";

/**
 * Ko'ngillilar bo'limi.
 *
 * DIQQAT — bu sahifadagi HAMMA narsa bekenddan kelmaydi:
 *  - hikoyalar (`cases`) -> `VolunteerCase` uchi;
 *  - raqamlar (`results`) -> `PlatformStat` uchi;
 *  - sarlavha va «yo'nalishlar» ro'yxati -> bekendda mos jadval YO'Q, shuning
 *    uchun ular statik marketing matni bo'lib qoladi (`lib/mocks/volunteers-about.ts`).
 */

export const getVolunteerCases = cache(async (): Promise<VolunteerCaseView[]> => {
  const cases = await fetchVolunteerCases();

  return cases
    .filter((dto) => dto.stateId === STATE_ACTIVE)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(toVolunteerCaseView);
});

export const getVolunteerCase = cache(async (id: string): Promise<VolunteerCaseView | null> => {
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) return null;

  const dto = await fetchVolunteerCase(numericId);
  if (!dto || dto.stateId !== STATE_ACTIVE) return null;

  return toVolunteerCaseView(dto);
});

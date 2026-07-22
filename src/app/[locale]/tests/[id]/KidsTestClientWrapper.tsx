"use client";

import { useRouter } from "@/i18n/navigation";
import { TestWizard } from "@/components/wizards/TestWizard";
import { type TestModel } from "@/types/test";

interface KidsTestClientWrapperProps {
  test: TestModel;
}

export function KidsTestClientWrapper({ test }: KidsTestClientWrapperProps) {
  const router = useRouter();

  return (
    <TestWizard
      test={test}
      onClose={() => router.push("/tests")}
    />
  );
}

"use client";

import { useRouter } from "@/i18n/navigation";
import { TestWizard } from "@/components/wizards/TestWizard";
import { type TestModel } from "@/types/test";

interface ParentTestClientWrapperProps {
  test: TestModel;
}

export function ParentTestClientWrapper({ test }: ParentTestClientWrapperProps) {
  const router = useRouter();

  return (
    <TestWizard
      test={test}
      onClose={() => router.push("/for-parents/tests")}
    />
  );
}

import { getDashboardData } from "@/actions/dashboard";
import {
  DashboardErrorState,
  DashboardShell,
} from "@/components/concierge/DashboardShell";

export const dynamic = "force-dynamic";

type DashboardPageState =
  | { ok: true; data: Awaited<ReturnType<typeof getDashboardData>> }
  | { ok: false; message: string };

async function loadDashboardPage(): Promise<DashboardPageState> {
  try {
    return { ok: true, data: await getDashboardData() };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "The dashboard could not load right now.",
    };
  }
}

export default async function Home() {
  const state = await loadDashboardPage();

  if (!state.ok) {
    return <DashboardErrorState message={state.message} />;
  }

  return (
    <DashboardShell
      proposals={state.data.proposals}
      reservation={state.data.reservation}
    />
  );
}

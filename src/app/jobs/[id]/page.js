import JobDetails from "@/components/Jobs/JobDetails";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return {
    title: "Job Details | KaamSaathi",
    description: "Explore verified job details and apply directly on KaamSaathi.",
  };
}

export default async function JobPage({ params }) {
  const { id } = await params;
  return <JobDetails jobId={id} />;
}

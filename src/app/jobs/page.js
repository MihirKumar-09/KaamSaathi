import PostJob from "@/components/Employer/post-jobs/PostJob";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "All Jobs | KaamSaathi",
  description: "Explore all posted jobs and vacancies across India on KaamSaathi",
};

export default function JobsPage() {
  return <PostJob initialScope="all" />;
}

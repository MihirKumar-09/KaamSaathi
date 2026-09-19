import PostJob from "@/components/Employer/post-jobs/PostJob";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "All Jobs | KaamSaathi Employer Portal",
  description: "Browse all posted jobs and manage vacancies on KaamSaathi",
};

export default function PostJobs() {
  return (
    <div>
      <PostJob />
    </div>
  );
}

import PostJob from "@/components/Employer/post-jobs/PostJob";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Post a Job | KaamSaathi Employer",
  description: "Hire skilled workers and post vacancies on KaamSaathi",
};

export default function PostJobs() {
  return (
    <div>
      <PostJob />
    </div>
  );
}

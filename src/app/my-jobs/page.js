import PostJob from "@/components/Employer/post-jobs/PostJob";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Jobs | KaamSaathi Employer",
  description: "Manage your posted job vacancies and recruitment on KaamSaathi",
};

export default function MyJobsPage() {
  return <PostJob initialScope="my" />;
}

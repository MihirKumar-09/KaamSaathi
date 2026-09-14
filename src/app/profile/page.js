import UserProfile from "@/components/Profile/UserProfile";

export const metadata = {
  title: "My Profile | KaamSaathi",
  description:
    "View and update your KaamSaathi profile — name, photo, contact info, location, and account security.",
};

export default function ProfilePage() {
  return <UserProfile />;
}

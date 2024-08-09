import { getUser } from "@/auth/actions";
import Main from "./_component/Main";

export default async function page() {
  const user = await getUser();
  return <Main user={user} />;
}

import { auth } from "@/app/(auth)/auth";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const session = await auth();
  console.log(session);
  return <></>;
}

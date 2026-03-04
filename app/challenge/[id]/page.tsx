import { notFound } from "next/navigation";

import { challenges, getChallengeById } from "@/challenges";

import ChallengePageClient from "./ChallengePageClient";

export function generateStaticParams() {
  return challenges.map((challenge) => ({
    id: challenge.id,
  }));
}

export default async function ChallengePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const challenge = getChallengeById(id);

  if (!challenge) {
    notFound();
  }

  return <ChallengePageClient challenge={challenge} />;
}

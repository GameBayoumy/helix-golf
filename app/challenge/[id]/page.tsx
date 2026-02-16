import { challenges } from '@/challenges';
import ChallengePageClient from './ChallengePageClient';

// Generate static params for all challenges
export function generateStaticParams() {
  return challenges.map((challenge) => ({
    id: challenge.id,
  }));
}

export default function ChallengePage({ params }: { params: { id: string } }) {
  return <ChallengePageClient challengeId={params.id} />;
}

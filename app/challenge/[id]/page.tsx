import { challenges } from '@/challenges';
import ChallengePageWrapper from './ChallengePageWrapper';

// Generate static params for all challenges
export function generateStaticParams() {
  return challenges.map((challenge) => ({
    id: challenge.id,
  }));
}

export default function ChallengePage() {
  return <ChallengePageWrapper />;
}
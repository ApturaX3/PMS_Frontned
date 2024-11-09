import { formatDistanceToNow, parseISO } from 'date-fns';

const LastUpdated = ({ lastUpdated }: { lastUpdated: string }) => {
  const timeAgo = formatDistanceToNow(parseISO(lastUpdated), {
    addSuffix: true,
  });

  return timeAgo;
};
export default LastUpdated;

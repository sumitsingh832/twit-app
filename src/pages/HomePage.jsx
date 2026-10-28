import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTweet, fetchTweets, updateTweetLike } from '../api/tweetsApi';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  const textareaRef = useRef(null);
  const [tweetText, setTweetText] = useState('');

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const {
    data: tweets = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['tweets'],
    queryFn: fetchTweets,
  });

  const createTweetMutation = useMutation({
    mutationFn: createTweet,
    onSuccess: () => {
      setTweetText('');
      queryClient.invalidateQueries({ queryKey: ['tweets'] });
    },
  });

  const likeTweetMutation = useMutation({
    mutationFn: updateTweetLike,
    onMutate: async (tweet) => {
      await queryClient.cancelQueries({ queryKey: ['tweets'] });
      const previousTweets = queryClient.getQueryData(['tweets']);

      queryClient.setQueryData(['tweets'], (oldTweets = []) =>
        oldTweets.map((item) =>
          item._id === tweet._id
            ? { ...item, likes: Number(item.likes || 0) + 1 }
            : item
        )
      );

      return { previousTweets };
    },
    onError: (_error, _tweet, context) => {
      if (context?.previousTweets) {
        queryClient.setQueryData(['tweets'], context.previousTweets);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tweets'] });
    },
  });

  function handleSubmit(e) {
    e.preventDefault();

    if (!tweetText.trim()) return;

    createTweetMutation.mutate({
      content: tweetText,
      userId: currentUser?.id || 'guest-user',
      username: currentUser?.name || 'Guest User',
      likes: 0,
      createdAt: new Date().toISOString(),
    });
  }

  return (
    <div className="page-box">
      <h1>Home</h1>

      <form className="tweet-form" onSubmit={handleSubmit}>
        <textarea
          ref={textareaRef}
          value={tweetText}
          onChange={(e) => setTweetText(e.target.value)}
          placeholder="What's happening?"
          rows={4}
        />

        <div className="tweet-form-actions">
          <span>{tweetText.length}/280</span>
          <button type="submit" disabled={createTweetMutation.isPending || !tweetText.trim()}>
            {createTweetMutation.isPending ? 'Posting...' : 'Tweet'}
          </button>
        </div>
      </form>

      {isPending && <p>Loading tweets...</p>}
      {isError && <p className="error-box">{error.message}</p>}

      {!isPending && !isError && (
        <div className="tweet-list">
          {tweets.map((tweet) => (
            <article key={tweet._id || tweet.id} className="tweet-card">
              <h3>{tweet.username || 'Unknown user'}</h3>
              <p>{tweet.content}</p>
              <div className="tweet-actions">
                <span>❤️ {tweet.likes || 0}</span>
                <button
                  type="button"
                  onClick={() => likeTweetMutation.mutate(tweet)}
                  disabled={likeTweetMutation.isPending}
                >
                  Like
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function LikeButton({ postId, initialLikeCount }) {
  const queryClient = useQueryClient();
  const queryKey = ['posts', postId];
  const cachedPost = queryClient.getQueryData(queryKey);
  const [likeCount, setLikeCount] = useState(
    cachedPost?.likeCount ?? initialLikeCount
  );

  const likeMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `/posts/${encodeURIComponent(postId)}/like`,
        { method: 'POST' }
      );

      if (!response.ok) {
        throw new Error('Failed to like post.');
      }

      return response;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const previousPost = queryClient.getQueryData(queryKey);
      const optimisticPost = queryClient.setQueryData(queryKey, (post) => ({
        ...post,
        id: post?.id ?? postId,
        likeCount: (post?.likeCount ?? initialLikeCount) + 1,
      }));

      setLikeCount(optimisticPost.likeCount);
      return { previousPost };
    },
    onError: (_error, _variables, context) => {
      if (context) {
        queryClient.setQueryData(queryKey, context.previousPost);
        setLikeCount(context.previousPost?.likeCount ?? initialLikeCount);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  return (
    <div>
      <button
        type="button"
        onClick={() => likeMutation.mutate()}
        disabled={likeMutation.isPending}
        aria-label={`Like post. ${likeCount} likes`}
      >
        {likeMutation.isPending ? 'Liking...' : `Like · ${likeCount}`}
      </button>
      {likeMutation.isError && <p role="alert">{likeMutation.error.message}</p>}
    </div>
  );
}

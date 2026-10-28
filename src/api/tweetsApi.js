export const API_BASE = 'https://crudcrud.com/api/62717900cf1542b38d92e1065388ca2c/tweets';

export async function fetchTweets() {
  const response = await fetch(API_BASE);

  if (!response.ok) {
    throw new Error('Failed to load tweets');
  }

  return response.json();
}

export async function createTweet(newTweet) {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newTweet),
  });

  if (!response.ok) {
    throw new Error('Failed to create tweet');
  }

  return response.json();
}

export async function updateTweetLike(tweet) {
  const updatedTweet = {
    ...tweet,
    likes: Number(tweet.likes || 0) + 1,
  };

  const response = await fetch(`${API_BASE}/${tweet._id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedTweet),
  });

  if (!response.ok) {
    throw new Error('Could not like tweet');
  }

  return response.json();
}

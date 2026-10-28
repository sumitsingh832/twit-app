import { useParams } from 'react-router-dom';

export default function ProfilePage() {
  const { userId } = useParams();

  return (
    <div className="page-box">
      <h1>Profile</h1>
      <p>Viewing user: {userId}</p>
    </div>
  );
}

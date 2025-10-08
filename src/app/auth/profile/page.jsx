import { redirect } from 'next/navigation';

const ProfilePage = () => {
    redirect('/auth/profile/overview');
}

export default ProfilePage;
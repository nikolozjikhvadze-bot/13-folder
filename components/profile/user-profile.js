import { useEffect, useState } from 'react';
import ProfileForm from './profile-form';
import classes from './user-profile.module.css';
import { useSession, getSession } from 'next-auth/react';

function UserProfile() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getSession().then(session => {
  
      if(!session) {
        window.location.href = '/auth'
      } else {
          setIsLoading(false);
      }
    })
  }, [])
  const [session, loading] = useSession();

  if(loading){
    return <p className={classes.profile}>Loading...</p>
  }

  return (
    <section className={classes.profile}>
      <h1>Your User Profile</h1>
      <ProfileForm />
    </section>
  );
}

export default UserProfile;

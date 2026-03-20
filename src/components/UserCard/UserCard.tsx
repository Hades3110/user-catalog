import type { DummyUser } from '../../types/dummyjson';
import styles from './UserCard.module.css';

export function UserCard({ user }: { user: DummyUser }) {
  const fullName = `${user.firstName} ${user.lastName}`.trim();

  return (
    <div className={styles.userCard}>
      <div className={styles.avatarWrap}>
        <img 
        src={user.image} 
        alt={fullName} 
        loading="lazy" 
        className={styles.avatar}
        />
      </div>
      <div className={styles.userMeta}>
        <p className={styles.userName}>{fullName}</p>
        <p className={styles.userEmail}>{user.email}</p>
        <div className={styles.userUsername}>
          @{user.username}
          {typeof user.age === 'number' ? ` • ${user.age}` : ''}
        </div>
      </div>
    </div>
  );
}


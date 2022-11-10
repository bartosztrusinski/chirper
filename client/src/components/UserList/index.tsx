import User from '../User';
import IUser from '../../interfaces/User';

interface Props {
  users: IUser[];
}

const UserList = ({ users }: Props) => {
  return (
    <>
      {users.map((user) => {
        return <User key={user._id} user={user} />;
      })}
    </>
  );
};

export default UserList;

/**
 * Users Page Component
 * Protected page for user management
 */
import Layout from "../components/Layout/Layout";
import UserList from "../components/Users/UserList";

const UsersPage = () => {
  return (
    <Layout>
      <UserList />
    </Layout>
  );
};

export default UsersPage;

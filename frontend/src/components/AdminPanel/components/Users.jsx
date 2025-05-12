const Users = () => {
    return (
        <div className="admin-component">
            <h2>User Management</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>admin</td>
                        <td>admin@example.com</td>
                        <td>Administrator</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>user1</td>
                        <td>user1@example.com</td>
                        <td>Editor</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Users;
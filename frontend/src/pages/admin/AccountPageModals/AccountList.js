import EditAccountModal from "./EditAccountModal";
import DeleteAccountModal from "./DeleteAccountModal";


const AccountList = ({accountList=[],countries, updateAccount, deleteAccount }) => {

    const accountObjects = accountList.map((account, index) => {
        return (
            <tr key={account.id}>
                  <td>{account.id}</td>
                  <td>{account.firstName} {account.lastName}</td>
                  <td>{account.email}</td>
                  <td>{!account.dateOfBirth ? "Not defined" : new Date(account.dateOfBirth)
                      .toISOString()
                      .slice(0, 10)
                      .replace("T", " ")}
                  </td>
                  <td>{!account.zipCode ? "Not defined" : account.zipCode}</td>
                  <td>{!account.country ? "Not defined" : account.country}</td>
                  <td>{!account.contactNumber ? "Not defined" : account.contactNumber}</td>
                  <td>{account.role}</td>
                  <td className="shipments">{account.shipments.length}</td>
                  <td>
                      <div className="row">
                        <EditAccountModal
                            account={account}
                            countries={countries}
                            updateAccount={updateAccount}/>
                        <DeleteAccountModal
                            account={account}
                            deleteAccount={deleteAccount}/>
                      </div>
                  </td>
                </tr>
        ) 
});

return (
    <table className="table table-bordered">
    <thead className="thead-light">
      <tr>
        <th scope="col">ID</th>
        <th scope="col">Name</th>
        <th scope="col">Email</th>
        <th scope="col">Date of Birth</th>
        <th scope="col">Zipcode</th>
        <th scope="col">Country of residence</th>
        <th scope="col">Contact number</th>
        <th scope="col">Role</th>
        <th scope="col">Shipments</th>
        <th scope="col">Edit Details</th>
      </tr>
    </thead>
    <tbody>

        {accountList.length > 0 ? (
            accountObjects
        ) : (
            <tr>
                <td>No record was found.</td>
            </tr>
        )}
    </tbody>
    </table>
);
};

export default AccountList;
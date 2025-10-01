import React from 'react';


const TablesPage = () => {

  const inactiveUsers = [
    { id: 1, firstName: 'Graham', lastName: 'Brent', country: 'Benin', city: 'Ripabottoni', phone: '1-512-760-9094' },
    { id: 2, firstName: 'Clark', lastName: 'Angela', country: 'Estonia', city: 'Borghetto di Vara', phone: '1-660-850-1647' },
    { id: 3, firstName: 'Wylie', lastName: 'Joseph', country: 'Korea, North', city: 'Guelph', phone: '325-4351' },
    { id: 4, firstName: 'Garth', lastName: 'Clementine', country: 'Indonesia', city: 'Narcao', phone: '722-8264' },
  ];
      

  
    return (
      <div className="main-content-container container-fluid px-4">
        {/* Page Header */}
        <div className="page-header row no-gutters py-4">
          <div className="col-12 col-sm-4 text-center text-sm-left mb-0">
            <span className="text-uppercase page-subtitle">Overview</span>
            <h3 className="page-title">Data Tables</h3>
          </div>
        </div>
        
    
        <div className="row">
      <div className="col">
        <div className="card card-small overflow-hidden mb-4">
          <div className="card-header ">
            <h6 className="m-0 text-white">Inactive Users</h6>
          </div>
          <div className="card-body p-0 pb-3  text-center table-card">
            <table className="table table-dark mb-0">
              <thead className="thead-dark">
                <tr>
                  <th scope="col" className="border-bottom-0">#</th>
                  <th scope="col" className="border-bottom-0">First Name</th>
                  <th scope="col" className="border-bottom-0">Last Name</th>
                  <th scope="col" className="border-bottom-0">Country</th>
                  <th scope="col" className="border-bottom-0">City</th>
                  <th scope="col" className="border-bottom-0">Phone</th>
                </tr>
              </thead>
              <tbody>
                {inactiveUsers.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.country}</td>
                    <td>{user.city}</td>
                    <td>{user.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>




      </div>
    );
};

export default TablesPage;

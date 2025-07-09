import './index.css';
import {useState,useEffect} from 'react'
import Header from '../Header';
import { ArrowLeft } from "@phosphor-icons/react";
import { Link } from 'react-router-dom';

const User = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  useEffect(() => {
      const fetchUserData = async () => {
        try {
          const response = await fetch(`https://jsonplaceholder.typicode.com/users`);
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          console.error('Failed to fetch user data:', response.statusText);
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (loading) {
    return <p>Loading user data...</p>;
  }
  if (error) {
    return <p>Error loading user data: {error.message}</p>;
  }

  const getInitials = (name) => {
    const initials = name.split(' ').map(word => word[0]).join('');
    return initials.toUpperCase();
  };
  
  const address = `${userData[0].address.suite}, ${userData[0].address.street}, ${userData[0].address.city}`;

  return (
    <>
      <Header />
      <main className="profile-container">
        <div className="profile-header">
          <Link to="/dashboard"><ArrowLeft size={32} color="#1b0e0e" /></Link>
          <h2>Welcome, {userData[0].name}</h2>
        </div>
        <div className="profile-content">
          <div className="top-panel">
            <div className="avatar-container">
              <div className="profile-avatar">{getInitials(userData[0].name)}</div>
              <div>
                <h3>{userData[0].name}</h3>
                <p className="email">{userData[0].email}</p>
              </div>
            </div>
          </div>

          <div className="bottom-panel">
            <div>
              <div className="info-item">
                <label>User ID</label>
                <p className='info-value'>{userData[0].id}</p>
              </div>

              <div className="info-item">
                <label>Email ID</label>
                <p className='info-value'>{userData[0].email}</p>
              </div>

              <div className="info-item">
                <label>Phone</label>
                <p className='info-value'>{userData[0].phone}</p>
              </div>
            </div>
            <div>
              <div className="info-item">
                <label>Name</label>
                <p className='info-value'>{userData[0].name}</p>
              </div>

              <div className="info-item">
                <label>Address</label>
                <p className='info-value'>{address}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default User;

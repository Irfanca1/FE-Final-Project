import React from 'react';
import styles from '@/styles/Home.module.css';

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const Profile = ({ username, email, namaLengkap, nomorTelepon, alamat }) => {
  const formattedUsername = capitalizeFirstLetter(username);

  return (
    <div className={`${styles.description} `}>
      <div className="card" style={{ width: '100%' }}>
        <div className="card-body">
          <h5 className="card-title fw-bold fs-5">Profile</h5>
        </div>
        <table className="table">
          <tbody>
            <tr>
              <td>Username</td>:<td>{formattedUsername}</td>
            </tr>
            <tr>
              <td>Email</td>:<td>{email}</td>
            </tr>
            <tr>
              <td>Nama Lengkap</td>:<td>{namaLengkap}</td>
            </tr>
            <tr>
              <td>Nomor Telepon</td>:<td>{nomorTelepon}</td>
            </tr>
            <tr>
              <td>Alamat</td>:<td>{alamat}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Profile;

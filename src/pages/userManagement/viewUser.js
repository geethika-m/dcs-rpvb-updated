import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { database } from "../../firebase";
import { Helmet } from 'react-helmet';
import ContentContainer from "../../components/pageLayout/contentContainer";
import UserDetail from '../../components/user/userDetail';

/**
 * @function ViewUser
 * 
 * It's a function that returns a component that retrieve the data of the user
 * based on user id and displays the data. 
 * @returns The return is a form with the following data from the user.
 */

const ViewUser = () => {

  /* Getting the userId from the URL. */
  const { userId } = useParams();
  const [userData, setUserData] = useState([]);
  const [exist, setExist] = useState(true);
  const [archived, setArchived] = useState(false);

  useEffect(() => {
  
  /* It gets the user data from the database and sets the user data to the state. */
  const getUserData = () => {
    database.usersRef.doc(userId).get().then((snapshot) => {
        if (snapshot.exists) {
            snapshot.data().status === "Archive" ? setArchived(true) : setArchived(false)
            setUserData(snapshot.data())
        }
        else {
            setExist(false)
        }
    });
  }
  getUserData();
}, [userId])

return (
    <ContentContainer>
        <Helmet>
        <title>RPVB | View User</title>
        </Helmet>
            <div className='form-container'>
            {
            exist
            ? (
                <UserDetail userData={userData} archived={archived} />
            )
            : (
                <p>There is no such User.</p>
            )
            }             
            </div>
    </ContentContainer>    
    )
}

export default ViewUser
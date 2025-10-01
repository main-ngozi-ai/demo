import React, {  useContext } from 'react';
import SocialAccounts from './SocialAccounts';
import { UserContext } from '../../login/UserContext';

const SocialAccountContainer = () => {
    const { user } = useContext(UserContext);
    return <SocialAccounts user={user}/>
};

export default SocialAccountContainer;

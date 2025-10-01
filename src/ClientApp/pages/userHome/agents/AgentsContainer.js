import React, {  useContext } from 'react';
import Agents from './Agent';
import { UserContext } from '../../login/UserContext';

const AgentsContainer = () => {
    const { user } = useContext(UserContext);
    return <Agents user={user}/>
};

export default AgentsContainer;

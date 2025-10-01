import React, {  useContext } from 'react';
import ErrandBot from './ErrandBot';
import { UserContext } from '../../login/UserContext';

const ErrandBotContainer = () => {
    const { user } = useContext(UserContext);
    return <ErrandBot user={user}/>
};

export default ErrandBotContainer;

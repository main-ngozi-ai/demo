import React, {  useContext } from 'react';
import ControlPanel from './ControlPanel';
import { UserContext } from '../../login/UserContext';

const ControlPanelContainer = () => {
    const { user } = useContext(UserContext);
    return <ControlPanel user={user}/>
};

export default ControlPanelContainer;

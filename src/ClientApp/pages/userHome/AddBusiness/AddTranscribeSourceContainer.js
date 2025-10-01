import React, {  useContext } from 'react';
import AddTranscribeSource from './AddTranscribeSource';
import { UserContext } from '../../login/UserContext';

const AddTranscribeSourceContainer = () => {
    const { user } = useContext(UserContext);
    return <AddTranscribeSource user={user} />
};

export default AddTranscribeSourceContainer;

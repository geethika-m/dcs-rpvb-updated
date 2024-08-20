import React from 'react';
import { Helmet } from 'react-helmet';
import ContentContainer from '../../components/pageLayout/contentContainer';
import ConfirmationForm from '../../components/confirmation/confirmationForm';

const Confirmation = () => {
    return (
        <React.Fragment>
            <ContentContainer>
                <Helmet><title>RPVB | Confirmation</title></Helmet>
                <ConfirmationForm/>
            </ContentContainer>
        </React.Fragment>
    );
};

export default Confirmation;
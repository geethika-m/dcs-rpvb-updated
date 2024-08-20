import React, {useEffect, useState} from "react";
import { Helmet } from "react-helmet";
import EmailVerification from "../../components/firebaseAuthForms/emailVerification";
import { useNavigate } from "react-router";
import ResetPasswordForm from "../../components/firebaseAuthForms/resetPasswordForm";
import PageFooter from "../../components/pageLayout/footer";

const AuthAction = () => {
    /* Set state of the componenet */
    const [mode, setMode] = useState('');
    const [actionCode, setActionCode] = useState('');
    const [lang, setLang] = useState('');
    const [proceed, setProceed] = useState(false);
    const navigate = useNavigate();

    const getParameterByName = (name, url) => {
        if (!url) {
            url = window.location.href;
        }
        name = name.replace(/[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    useEffect(() => {
        /* Get the action to complete. */
        setMode(getParameterByName('mode'));
        /* Get the one-time code from the query parameter. */
        setActionCode(getParameterByName('oobCode'));
        /* (Optional) Get the language code if available. */
        setLang(getParameterByName('lang') || 'en');
        
        if (mode !== '' && actionCode !== '' && lang !== '') {
            setProceed(true);
        } 
        
        if (actionCode === null) {
            navigate("/");
        }
    }, [mode, actionCode, lang, navigate])

    return (
        <React.Fragment>
            <Helmet>
                <title>{`RPVB | ${mode}`}</title>
            </Helmet>
            <div className="login-fgtpwd-background sub-container" >
                {proceed && 
                    (
                        mode === "resetPassword"
                            ? <ResetPasswordForm actionCode={actionCode} />
                            : <EmailVerification actionCode={actionCode} />
                        )
                }
            </div>
            <div className="footer-noscroll">
                <PageFooter />
            </div>
        </React.Fragment>
    )
}
export default AuthAction
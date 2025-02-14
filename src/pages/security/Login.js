import React, {useEffect, useState} from 'react';
import {NavLink, useNavigate} from 'react-router-dom';
import Footer from "./components/Footer";
import AuthApi from "../../services/api/auth.api";
import * as ROUTES from '../../services/utils/routes.location';
import {useDispatch} from "react-redux";
import {setAuth, setRefreshToken, setToken, setUser} from "../../services/redux/auth.store.redux";

const Login = () => {
    const [form, setForm] = useState({email: '', password: ''});
    const [formErrors, setFormErrors] = useState({email: '', password: ''});
    const [formSubmited, setFormSubmited] = useState(false);
    const [invalidCredentials, setInvalidCredentials] = useState(false);
    const location = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        document.title = 'Skote | Authentification';
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formIsValid()) {
            return;
        }
        setFormSubmited(true);

        const store = {token: null, refreshToken: null};
        AuthApi.login(form.email, form.password)
            .then(response => {
                store.token = response.token;
                store.refreshToken = response.refresh_token;
                return AuthApi.me(response.token);
            })
            .then(user => {
                dispatch(setAuth(true));
                dispatch(setToken(store.token));
                dispatch(setRefreshToken(store.refreshToken));
                dispatch(setUser(JSON.stringify(user)));
                location(ROUTES.CHAT);
            })
            .catch(error => {
                if (error.response.status === 401 && error.response.statusText === 'Unauthorized') {
                    setInvalidCredentials(true);
                }
                setFormSubmited(false);
            });
    }

    const formIsValid = () => {
        let errors = {email: '', password: ''};
        if (!form.email) {
            errors.email = 'Ce champs est requis';
        } else if (!form.email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9]{2,}$/)) {
            errors.email = 'Cet email n\'est pas valide';
        }
        if (!form.password) {
            errors.password = 'Ce champs est requis';
        }

        setFormErrors(errors);
        if (!errors.email && !errors.password) {
            return true;
        }

        return false;
    }

    const showPassword = () => {
        let input = document.querySelector('#input_password');
        if (input.type === 'password') {
            input.type = 'input';
            return;
        }

        input.type = 'password';
    }

    return (
        <div className="account-pages my-5 pt-sm-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6 col-xl-5">
                        <div className="card overflow-hidden">
                            <div className="bg-primary bg-soft">
                                <div className="row">
                                    <div className="col-7">
                                        <div className="text-primary p-4">
                                            <h5 className="text-primary">Skote</h5>
                                            <p>Connectez-vous pour accéder à votre compte.</p>
                                        </div>
                                    </div>
                                    <div className="col-5 align-self-end">
                                        <img src="img/security/profile-img.png" alt="" className="img-fluid"/>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body pt-0">
                                <div className="auth-logo">
                                    <div className="avatar-md profile-user-wid mb-4">
                                            <span className="avatar-title rounded-circle bg-light">
                                                <img src="img/security/logo.svg" alt="" className="rounded-circle"
                                                     height="34"/>
                                            </span>
                                    </div>
                                </div>
                                {invalidCredentials &&
                                    <div className="alert alert-warning" role="alert">
                                        L'identifiant et/ou le mot de passe sont incorrects.
                                    </div>
                                }
                                <div className="p-2">
                                    <form className="form-horizontal" onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label htmlFor="email" className="form-label">Email</label>
                                            <input type="email" className="form-control" id="email"
                                                   placeholder="Entrez votre email"
                                                   onChange={(event) => setForm({...form, email: event.target.value})}
                                            />
                                            <ul className="parsley-errors-list filled">
                                                <li className="parsley-required">{formErrors.email}</li>
                                            </ul>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Mot de passe</label>
                                            <div className="input-group auth-pass-inputgroup">
                                                <input type="password" className="form-control" id="input_password"
                                                       placeholder="Entrez votre mot de passe" aria-label="Mot de passe"
                                                       aria-describedby="password-addon"
                                                       onChange={(event) => setForm({
                                                           ...form,
                                                           password: event.target.value
                                                       })}
                                                />
                                                <button className="btn btn-light " type="button" id="password-addon"
                                                        onClick={() => showPassword()}
                                                >
                                                    <i className="mdi mdi-eye-outline"></i>
                                                </button>
                                            </div>
                                            <ul className="parsley-errors-list filled">
                                                <li className="parsley-required">{formErrors.password}</li>
                                            </ul>
                                        </div>
                                        <div className="mt-3 d-grid">
                                            <button className="btn btn-primary waves-effect waves-light" type="submit"
                                                    disabled={formSubmited}
                                            >
                                                {formSubmited &&
                                                    <i className="bx bx-loader bx-spin font-size-16 align-middle me-2"></i>
                                                }
                                                Se connecter
                                            </button>
                                        </div>
                                    </form>
                                    <div className="mt-4 text-center">
                                        <h5 className="font-size-14 mb-3">Se connecter avec</h5>
                                        <ul className="list-inline">
                                            <li className="list-inline-item">
                                                <a href='#/'
                                                   className="social-list-item bg-primary text-white border-primary">
                                                    <i className="mdi mdi-facebook"></i>
                                                </a>
                                            </li>
                                            <li className="list-inline-item">
                                                <a href='#/'
                                                   className="social-list-item bg-info text-white border-info">
                                                    <i className="mdi mdi-twitter"></i>
                                                </a>
                                            </li>
                                            <li className="list-inline-item">
                                                <a href='#/'
                                                   className="social-list-item bg-danger text-white border-danger">
                                                    <i className="mdi mdi-google"></i>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="mt-4 text-center">
                                        <NavLink to={ROUTES.RESET_PASSWORD} className="text-muted">
                                            <i className="mdi mdi-lock mr-1"></i>
                                            Vous avez oublié votre mot de passe ?
                                        </NavLink>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Footer
                            text="Vous n'avez pas de compte ?"
                            url={ROUTES.REGISTER}
                            textButton="Créez votre compte !"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;

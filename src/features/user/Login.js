import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LandingIntro from './LandingIntro';
import ErrorText from '../../components/Typography/ErrorText';
import InputText from '../../components/Input/InputText';
import axios from 'axios';

function Login() {
    const INITIAL_LOGIN_OBJ = {
        password: "",
        email: ""
    };

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_OBJ);
    const [userType, setUserType] = useState("hospital"); // Default user type

    const submitForm = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (loginObj.email.trim() === "") return setErrorMessage("Email is required!");
        if (loginObj.password.trim() === "") return setErrorMessage("Password is required!");

        let loginEndpoint = '';

        // Determine the login endpoint based on the userType
        switch (userType) {
            case 'hospital':
                loginEndpoint = `${process.env.REACT_APP_BASE_URL}/hospitals/login`;
                break;
            case 'chiefDoctor':
                loginEndpoint = `${process.env.REACT_APP_BASE_URL}/cheifDoctors/login`;
                break;
            // Add more cases for other user types if needed
            default:
                return setErrorMessage("Invalid user type!");
        }

        try {
            setLoading(true);
            const response = await axios.post(loginEndpoint, loginObj);
            console.log(response.data.tokens.access.token);
            const token = response.data.tokens.access.token;
            localStorage.setItem("token", token);

            const userInfo = response.data
            localStorage.setItem("userInfo", JSON.stringify(userInfo))
            setLoading(false);
            window.location.href = '/';
        } catch (error) {
            setLoading(false);
            console.error('Error while setting userInfo in localStorage:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage("Something went wrong. Please try again later.");
            }
        }
    };

    const updateFormValue = ({ updateType, value }) => {
        setErrorMessage("");
        setLoginObj({ ...loginObj, [updateType]: value });
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center">
            <div className="card mx-auto w-full max-w-5xl  shadow-xl">
                <div className="grid  md:grid-cols-2 grid-cols-1  bg-base-100 rounded-xl">
                    <div className=''>
                        <LandingIntro />
                    </div>
                    <div className='py-24 px-10'>
                        <h2 className='text-3xl font-bold mb-2 text-center'>Login</h2>
                        <form onSubmit={submitForm}>

                            <div className="mb-4">
                                <InputText type="email" defaultValue={loginObj.email} updateType="email" containerStyle="mt-4" labelTitle="Email" updateFormValue={updateFormValue} />
                                <InputText defaultValue={loginObj.password} type="password" updateType="password" containerStyle="mt-4" labelTitle="Password" updateFormValue={updateFormValue} />
                            </div>

                            <div className="mb-4">
                                <label className="form-control w-full max-w-xs">
                                    <div className="label">
                                        <span className="label-text">Pick user type</span>
                                    </div>
                                    <select id="userType" name="userType" value={userType} onChange={(e) => setUserType(e.target.value)} className="select select-info w-full block">
                                        <option value="hospital">Hospital</option>
                                        <option value="chiefDoctor">Chief Doctor</option>
                                        {/* Add more options for other user types if needed */}
                                    </select>
                                </label>
                            </div>

                            {/* <div className='mb-4'>
                                <label htmlFor="userType" className="block text-sm font-medium text-gray-700">User Type</label>
                                <select id="userType" name="userType" value={userType} onChange={(e) => setUserType(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                                    <option value="hospital">Hospital</option>
                                    <option value="chiefDoctor">Chief Doctor</option>
                                    
                                </select>
                            </div> */}

                            <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>
                            <button type="submit" className={"btn mt-2 w-full btn-primary" + (loading ? " loading" : "")}>Login</button>

                            <div className='text-center mt-4'>Don't have an account yet? <Link to="/register"><span className="  inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200">Register</span></Link></div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;

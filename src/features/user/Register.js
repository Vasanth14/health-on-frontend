import {useState, useRef} from 'react'
import {Link} from 'react-router-dom'
import LandingIntro from './LandingIntro'
import ErrorText from  '../../components/Typography/ErrorText'
import InputText from '../../components/Input/InputText'
import axios from 'axios';

function Register(){

    const INITIAL_REGISTER_OBJ = {
        hospitalName : "",
        hospitalEmail : "",
        hospitalLocation : "",
        hospitalRegId : "",
        hospitalType : "general",
        hospitalContact : "",
        password : "",
    }

    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [registerObj, setRegisterObj] = useState(INITIAL_REGISTER_OBJ)

    const submitForm = async(e) =>{
        e.preventDefault()
        setErrorMessage("")

        if(registerObj.hospitalName.trim() === "")return setErrorMessage("Hospital name is required!")
        if(registerObj.hospitalEmail.trim() === "")return setErrorMessage("Hospital Email is required!")
        if(registerObj.hospitalLocation.trim() === "")return setErrorMessage("Hospital location is required!")
        if(registerObj.hospitalRegId.trim() === "")return setErrorMessage("Hospital registration ID is required!")
        if(registerObj.hospitalType.trim() === "")return setErrorMessage("Hospital type is required!")
        if(registerObj.hospitalContact.trim() === "")return setErrorMessage("Hospital contact is required!")
        if(registerObj.password.trim() === "")return setErrorMessage("Password is required!")
        else{
            try{
                setLoading(true);
                const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/hospitals/register`, registerObj)
                const token = response.data.tokens.access.token
                localStorage.setItem("token", token)

                const hospitalInfo = response.data
                localStorage.setItem("hospitalInfo", JSON.stringify(hospitalInfo))
                setLoading(false);
                window.location.href = '/';
            }catch (error){
                setLoading(false);
                console.error('Error while setting hospitalInfo in localStorage:', error);
                if (error.response && error.response.data && error.response.data.message) {
                    setErrorMessage(error.response.data.message);
                } else {
                    setErrorMessage("Something went wrong. Please try again later.");
                }
            }
        }
    }

    const updateFormValue = ({updateType, value}) => {
        setErrorMessage("")
        setRegisterObj({...registerObj, [updateType] : value})
    }

    return (
        <div className="min-h-screen bg-base-200 flex items-center">
            <div className="card mx-auto w-full max-w-5xl shadow-xl">
                <div className="grid md:grid-cols-2 grid-cols-1 bg-base-100 rounded-xl">
                    <div className=''>
                        <LandingIntro />
                    </div>
                    <div className='py-24 px-10'>
                        <h2 className='text-3xl font-bold mb-2 text-center'>Register Your Hospital</h2>
                        <form onSubmit={(e) => submitForm(e)}>
                            <div className="mb-4">
                                <InputText defaultValue={registerObj.hospitalName} updateType="hospitalName" containerStyle="mt-4" labelTitle="Hospital Name" updateFormValue={updateFormValue} />
                                <InputText defaultValue={registerObj.hospitalEmail} updateType="hospitalEmail" containerStyle="mt-4" labelTitle="Hospital Email" updateFormValue={updateFormValue} />
                                <InputText defaultValue={registerObj.hospitalLocation} updateType="hospitalLocation" containerStyle="mt-4" labelTitle="Hospital Location" updateFormValue={updateFormValue} />
                                <InputText defaultValue={registerObj.hospitalRegId} updateType="hospitalRegId" containerStyle="mt-4" labelTitle="Hospital Registration ID" updateFormValue={updateFormValue} />
                                <div className="mt-4">
                                    <label className="form-control w-full max-w-xs">
                                        <div className="label">
                                            <span className="label-text">Select Hospital Type</span>
                                        </div>
                                        <select className="select select-info w-full block" value={registerObj.hospitalType} onChange={(e) => updateFormValue({ updateType: "hospitalType", value: e.target.value })}>
                                            <option value="general">General Hospital</option>
                                            <option value="childCare">Children's Hospital</option>
                                            {/* Add more options for other user types if needed */}
                                        </select>
                                    </label>
                                </div>
                                <InputText defaultValue={registerObj.hospitalContact} updateType="hospitalContact" containerStyle="mt-4" labelTitle="Hospital Contact" updateFormValue={updateFormValue} />
                                <InputText defaultValue={registerObj.password} type="password" updateType="password" containerStyle="mt-4" labelTitle="Password" updateFormValue={updateFormValue} />
                            </div>
                            <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>
                            <button type="submit" className={"btn mt-2 w-full btn-primary" + (loading ? " loading" : "")}>Register</button>
                            <div className='text-center mt-4'>Already have an account? <Link to="/login"><span className=" inline-block hover:text-primary hover:underline hover:cursor-pointer transition duration-200">Login</span></Link></div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
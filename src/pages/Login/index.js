import React, {useState} from "react";
import PageHOC from "../../components/HOC";
import LogoImage from "../../assets/image/1.jpg";
import './login.css'
import {useDispatch, useSelector} from "react-redux";
import {NavLink} from "react-router-dom";
import {userLogin, userLogOut} from '../../redux/userData/userData.actions'

function Login() {

    const usersInfo = useSelector((state => state.userData.info));
    const userLoginInfo = useSelector((state => state.userData.userLoginInfo));
    const dispatch = useDispatch();

    const [tel, setTel] = useState()
    const [isLogin,setIsLogin]=useState(true)

    function handleChange(event) {
        event.preventDefault();
        setTel(event.target.value)
    }

    function login(event) {
        event.preventDefault();

        // eslint-disable-next-line
        const loginInfo = usersInfo.filter(item => {
            if (item.tel === tel) {
                return item
            }
        })
        if (loginInfo.length>0) {
            setIsLogin(true)
            dispatch(userLogin(loginInfo[0]))
        }
        else setIsLogin(false)
    }

    function logOut() {
        dispatch(userLogOut())
    }

    return (
        <PageHOC>
            <div className="login">
                <div className="col-md-4 login-body">
                    <img src={LogoImage} alt="" className="login-image"/>
                    {userLoginInfo.length === 0 ?
                        <div className="login-content">
                            <div className="login-header">
                                <p className="login-logo">Timepickers</p>
                                <p>sign in to your account</p>
                            </div>
                            {!isLogin && <p className="alert-danger">you are not already registered.</p>}
                            <div className="center">
                                <form onSubmit={login}>
                                    <div className="form-group input-group">
                                        <input className="form-control" type="tel"
                                               placeholder="phone"
                                               pattern="[0-9]{4}[0-9]{3}[0-9]{4}"
                                               onChange={event => handleChange(event)}
                                               required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <button type="submit"
                                                className="btn btn-secondary col-lg-12 col-md-12 col-sm-12">Login
                                        </button>
                                        <div className="link-suggestion">
                                            <p>You don't have any account? <NavLink className="p-link" to="/">signup here</NavLink></p>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        :
                        <div className="login-content">
                            <div className="welcome-form">
                                <p className="m-0">hi {userLoginInfo.name} ! you are login. </p>
                                <div className="link-suggestion">
                                    <NavLink className="p-link" to="/login" onClick={logOut}>
                                        Do you want to log out?
                                    </NavLink>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </PageHOC>
    )
}

export default Login;